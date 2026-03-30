# NexxClinic Frontend

A modern, professional ophthalmic consultation management system built with Next.js 16, featuring real-time patient management, modal-based workflows, and a clean medical UI.

## 🚀 Features

- **Patient Management**: Comprehensive patient registration with duplicate prevention
- **Consultation Workflow**: Status-based visit progression (CREATED → IN_PROGRESS → COMPLETED)
- **Real-time Search**: Progressive patient search with debounced queries
- **Insurance Integration**: Dynamic forms with age-based requirements
- **Dark/Light Theme**: Professional medical theme with OKLCH color space
- **Modal-first Design**: Clean, accessible workflows using Radix Dialog components
- **GraphQL API**: Type-safe data operations with Apollo Client
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom medical theme
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: Apollo Client for GraphQL
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Theme**: next-themes with custom context

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, or bun package manager
- GraphQL API endpoint

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexxmedfront
   ```

2. **Install dependencies**
   ```bash
   # Using bun (recommended)
   bun install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=your-graphql-api-url
   ```

4. **Run the development server**
   ```bash
   # Using bun
   bun run dev

   # Or using npm
   npm run dev

   # Or using yarn
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and theme variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── apollo-wrapper.tsx # Apollo Client provider
│   ├── dashboard-page.tsx # Main dashboard
│   ├── login-page.tsx    # Authentication page
│   └── patient-*.tsx     # Patient-related components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── apollo-client.ts  # GraphQL client configuration
│   ├── auth-context.tsx  # Authentication context
│   ├── theme-context.tsx # Theme management
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🏗 Development

### Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React/Next.js
- **Prettier**: Code formatting (via ESLint)
- **Component Structure**: Modal-first design pattern
- **Styling**: Utility-first with Tailwind CSS

### Key Patterns

#### Component Architecture
```tsx
// Modal-first design using Radix Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PatientModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Registration</DialogTitle>
        </DialogHeader>
        {/* Modal content */}
      </DialogContent>
    </Dialog>
  )
}
```

#### GraphQL Integration
```tsx
// Centralized hooks in hooks/auth-hooks.ts
import { useMutation } from "@apollo/client"
import { LOGIN_MUTATION } from "./mutations"

export function useLogin() {
  return useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // Handle success
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}
```

#### Theme Usage
```tsx
// Custom theme variables in globals.css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0.117 254.667);
}

// Dark mode
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

## 🔧 Configuration

### Next.js Config (`next.config.mjs`)
- TypeScript errors ignored in build
- Images unoptimized for static deployment

### Tailwind Config
- CSS variables for theming
- Custom scrollbar utilities
- OKLCH color space for professional appearance

### Apollo Client
- Bearer token authentication
- Error handling with toast notifications
- Centralized in `lib/apollo-client.ts`

## 🚀 Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Start production server**
   ```bash
   bun run start
   ```

The application will be available on port 3000 by default.

## 🤝 Contributing

1. Follow the established code patterns
2. Use TypeScript for all new code
3. Maintain modal-first design for new workflows
4. Test GraphQL operations thoroughly
5. Update types in `lib/types.ts` for new data structures

## 📄 License

This project is private and proprietary to NexxClinic.</content>
<parameter name="filePath">/Users/pro/workspace/personal/nexxserve/fronted/nexxmedfront/README.md