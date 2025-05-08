# Dimensio - Furniture Dimension Converter

Dimensio is a modern web application that helps convert furniture dimensions between different measurement systems and formats. Built with Next.js, it provides a user-friendly interface for converting dimensions between metric and imperial units.

## Features

- Convert dimensions between metric (mm) and imperial (inches) units
- Support for multiple input formats
- Multiple output format options:
  - Metric: `100mmH x 100mmW x 100mmD`
  - Metric: `100H x 100W x 100D (mm)`
  - Imperial: `12 1/2" H x 12 1/2" W x 12 1/2" D`
- Real-time conversion with AI-powered processing
- Clean, modern UI with dark mode support
- Responsive design for all devices

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, create a `.env.local` file in the root directory and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Geist Font](https://vercel.com/font) - Typography
- OpenAI GPT-4 - Dimension conversion processing

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
