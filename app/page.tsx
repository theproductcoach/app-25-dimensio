"use client";

import { useState } from "react";

export default function Home() {
  const [dimensions, setDimensions] = useState("");
  const [outputFormat, setOutputFormat] = useState("format1");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("metric"); // "metric" or "imperial"

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

      // Create specialized system prompts based on the active tab
      let systemPrompt = "";

      if (activeTab === "metric") {
        systemPrompt =
          "You are a metric dimension conversion assistant. Your task is to convert measurements to metric formats.\n\n" +
          "RULES:\n" +
          "1. Unit Detection:\n" +
          "   - If input has 'in', 'inches', or '\"', convert from inches to mm\n" +
          "   - If input has 'mm', 'cm', or 'm', convert to mm\n" +
          "   - If input has NO units, ALWAYS assume millimetres\n\n" +
          "2. Conversion Process:\n" +
          "   - For inches to mm: multiply by 25.4\n" +
          "   - For cm to mm: multiply by 10\n" +
          "   - For m to mm: multiply by 1000\n\n" +
          "3. Formatting:\n" +
          "   - Match the exact structure of the target format\n" +
          "   - Only replace the numbers, keep all other text including '(mm)' if present\n" +
          "   - For metric: use whole numbers, round to nearest mm\n\n" +
          "4. Response Format:\n" +
          "   - Return ONLY the final formatted string\n" +
          "   - Do NOT include any explanations\n" +
          "   - Include '(mm)' at the end if it's in the target format\n\n" +
          "Example 1 (Imperial to Metric):\n" +
          'Input: 12" H x 6" W x 3" D\n' +
          "Format: 100mmH x 100mmW x 100mmD\n" +
          "Response: 305mmH x 152mmW x 76mmD\n\n" +
          "Example 2 (Metric to Metric):\n" +
          "Input: 100cm H x 50cm W x 25cm D\n" +
          "Format: 100H x 100W x 100D (mm)\n" +
          "Response: 1000H x 500W x 250D (mm)";
      } else {
        systemPrompt =
          "You are an imperial dimension conversion assistant. Your task is to convert measurements to imperial formats.\n\n" +
          "RULES:\n" +
          "1. Unit Detection:\n" +
          "   - If input has 'in', 'inches', or '\"', keep as inches\n" +
          "   - If input has 'mm', 'cm', or 'm', convert to inches\n" +
          "   - If input has NO units, ALWAYS assume millimetres and convert to inches\n\n" +
          "2. Conversion Process:\n" +
          "   - For mm to inches: divide by 25.4\n" +
          "   - For cm to inches: divide by 2.54\n" +
          "   - For m to inches: multiply by 39.37\n\n" +
          "3. Formatting:\n" +
          "   - Match the exact structure of the target format\n" +
          "   - For imperial formats, use fractions instead of decimals\n" +
          '   - Use fractions with denominator 2, 4, 8, 16, or 32 (e.g., 3 15/16")\n' +
          '   - For whole numbers, don\'t include a fraction (e.g., 12" not 12 0/16")\n\n' +
          "4. Response Format:\n" +
          "   - Return ONLY the final formatted string\n" +
          "   - Do NOT include any explanations\n\n" +
          "Example 1 (Metric to Imperial):\n" +
          "Input: 100H x 50W x 25D\n" +
          'Format: 12 1/2" H x 12 1/2" W x 12 1/2" D\n' +
          'Response: 3 15/16" H x 2" W x 1" D\n\n' +
          "Example 2 (Imperial to Imperial):\n" +
          'Input: 12.5" H x 6.25" W x 3.125" D\n' +
          'Format: 12 1/2" H x 12 1/2" W x 12 1/2" D\n' +
          'Response: 12 1/2" H x 6 1/4" W x 3 1/8" D';
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
              content: systemPrompt,
            },
            {
              role: "user",
              content: `CONVERSION TASK:\nInput: ${dimensions}\nTarget Format: ${formatExample}\n\nFollow these steps:\n1. Identify all measurements in the input\n2. Convert each measurement to match the target format's unit\n3. Format the numbers to match the target format exactly\n4. Return ONLY the final formatted string with no additional text`,
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Set default format based on tab
    if (tab === "metric") {
      setOutputFormat("format1");
    } else {
      setOutputFormat("format3");
    }
    // Clear the result when switching tabs
    setResult("");
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

        {/* Tabs */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Convert to:</p>
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "metric"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("metric")}
              type="button"
            >
              Metric Output
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "imperial"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("imperial")}
              type="button"
            >
              Imperial Output
            </button>
          </div>
        </div>

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

          {activeTab === "metric" ? (
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
              </select>
            </div>
          ) : (
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
                <option value="format3">
                  12 1/2" H x 12 1/2" W x 12 1/2" D
                </option>
              </select>
            </div>
          )}

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
