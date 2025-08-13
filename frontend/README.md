# Messaging App Frontend

A modern, real-time messaging application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time messaging with WebSockets
- 📱 Responsive design that works on all devices
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time message updates
- 🛡️ Protected routes
- 🚀 Optimized for performance

## Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm
- Backend API server (see backend README for setup)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # App router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected dashboard routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── auth/               # Auth components
│   ├── ui/                 # UI components
│   └── ErrorBoundary.tsx   # Error boundary
├── contexts/               # React contexts
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Real-time**: WebSockets
- **Form Handling**: React Hook Form
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Formatting**: Prettier
- **Linting**: ESLint

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Format code with Prettier

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Self-Hosting

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
