"use client";

import { useState } from "react";

export default function Home() {
  const [dimensions, setDimensions] = useState("");
  const [outputFormat, setOutputFormat] = useState("format1");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the format example based on the selected format
      let formatExample = "";
      switch (outputFormat) {
        case "format1":
          formatExample = "100mmH x 100mmW x 100mmD";
          break;
        case "format2":
          formatExample = "100H x 100W x 100D (mm)";
          break;
        case "format3":
          formatExample = '12 1/2" H x 12 1/2" W x 12 1/2" D';
          break;
      }

      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                'You are a dimension conversion assistant. Your task is to convert measurements to match a specific format.\n\nRULES:\n1. Unit Detection:\n   - If input has \'in\', \'inches\', or \'"\', treat as inches\n   - If input has \'mm\', \'cm\', or \'m\', convert to required format\n   - If input has NO units, ALWAYS assume millimetres\n\n2. Conversion Process:\n   - If input and output use the same units (both imperial or both metric), only format the numbers, no conversion needed\n   - For mm to inches: divide by 25.4\n   - For inches to mm: multiply by 25.4\n   - For cm to mm: multiply by 10\n   - For m to mm: multiply by 1000\n\n3. Formatting:\n   - Match the exact structure of the target format\n   - Only replace the numbers, keep all other text including \'(mm)\' if present\n   - For imperial: use fractions (e.g., 3 15/16")\n   - For metric: use whole numbers\n\n4. Response Format:\n   - Return ONLY the final formatted string\n   - Do NOT include any explanations\n   - Do NOT include any additional text\n   - Do NOT include the word \'Output:\' or similar\n   - Include \'(mm)\' at the end if it\'s in the target format\n\nExample 1 (Metric to Imperial):\nInput: 100H x 50W x 25D\nFormat: 12 1/2" H x 12 1/2" W x 12 1/2" D\nResponse: 3 15/16" H x 2" W x 1" D\n\nExample 2 (Imperial to Metric):\nInput: 12" H x 6" W x 3" D\nFormat: 100H x 100W x 100D (mm)\nResponse: 305H x 152W x 76D (mm)\n\nExample 3 (Same Units - Imperial):\nInput: 12" H x 6" W x 3" D\nFormat: 12 1/2" H x 12 1/2" W x 12 1/2" D\nResponse: 12" H x 6" W x 3" D\n\nExample 4 (Same Units - Metric):\nInput: 100mmH x 50mmW x 25mmD\nFormat: 100H x 100W x 100D (mm)\nResponse: 100H x 50W x 25D (mm)',
            },
            {
              role: "user",
              content: `CONVERSION TASK:\nInput: ${dimensions}\nTarget Format: ${formatExample}\n\nFollow these steps:\n1. Check if input and output use the same units\n2. If same units, only format the numbers to match the target format\n3. If different units, convert measurements to match the target format's unit\n4. Format the numbers to match the target format exactly, including any '(mm)' at the end if present\n5. Return ONLY the final formatted string with no additional text`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans relative"
      style={{
        backgroundImage: "url('/bg-hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="w-full max-w-lg bg-white/95 rounded-lg shadow-md p-6 md:p-8 relative z-10 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Dimension Converter
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="dimensions"
              className="block mb-2 font-medium text-gray-700"
            >
              Enter Dimension Text
            </label>
            <textarea
              id="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder:text-gray-500 text-gray-800"
              placeholder="Paste your dimension text here..."
            />
          </div>

          <div>
            <label
              htmlFor="outputFormat"
              className="block mb-2 font-medium text-gray-700"
            >
              Output Format
            </label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="format1">100mmH x 100mmW x 100mmD</option>
              <option value="format2">100H x 100W x 100D (mm)</option>
              <option value="format3">
                12 1/2&quot; H x 12 1/2&quot; W x 12 1/2&quot; D
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Converting..." : "Convert"}
          </button>
        </form>

        {isLoading && (
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700">Processing...</span>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <h2 className="font-medium mb-2 text-gray-800">Result:</h2>
            <div className="text-gray-700 font-mono break-words">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
