# SouthPole Official

A modern Next.js 14 application built with TypeScript, Tailwind CSS, and Ant Design.

## 🚀 Features

- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for utility-first styling
- ✅ **Ant Design** for rich UI components
- ✅ **Framer Motion** for animations
- ✅ **pnpm** as package manager
- ✅ **Error Boundaries** for robust error handling
- ✅ **Custom Theme** with design tokens
- ✅ **CSS Variables** for consistent styling
- ✅ **Prettier** with Tailwind plugin for code formatting

## 📁 Project Structure

```
southpole-official/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles and CSS variables
│   ├── components/
│   │   ├── ui/                 # Reusable Tailwind components
│   │   │   ├── Button.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts
│   │   ├── ant/                # Ant Design wrapper components
│   │   │   └── AntButton.tsx
│   │   ├── sections/           # Page sections
│   │   │   └── Hero.tsx
│   │   ├── layouts/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── index.ts            # Component exports
│   ├── lib/                    # Utility functions
│   │   └── utils.ts
│   ├── hooks/                  # Custom React hooks
│   │   └── useLocalStorage.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   └── styles/                 # Additional styles (if needed)
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── .prettierrc                # Prettier configuration
├── .gitignore                 # Git ignore rules
├── .npmrc                     # pnpm configuration
└── package.json               # Dependencies and scripts
```

## 🛠 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design System

### Colors
- **Primary**: Blue scale (`primary-50` to `primary-950`)
- **Gray**: Neutral scale (`gray-50` to `gray-950`)
- **Success**: Green scale for positive actions
- **Warning**: Orange scale for warnings
- **Error**: Red scale for errors

### Typography
- **Font Family**: Geist Sans and Geist Mono
- **Font Sizes**: Responsive typography scale
- **Line Heights**: Optimized for readability

### Spacing
- **Custom Spacing**: Extended with `18`, `88`, `128` rem values
- **Max Widths**: Extended with `8xl`, `9xl` sizes

### Animations
- **Fade Effects**: `fade-in`, `fade-in-up`, `fade-in-down`
- **Scale Effects**: `scale-in`
- **Slide Effects**: `slide-in-right`, `slide-in-left`

## 🧩 Components

### UI Components (Tailwind-based)
- `Button`: Multiple variants and sizes
- `ErrorBoundary`: Error handling with fallback UI

### Ant Design Components
- `AntButton`: Styled Ant Design button wrapper
- Extended theme configuration for consistent styling

### Layout Components
- `Header`: Navigation header with responsive design
- `Footer`: Footer with links and contact information

### Section Components
- `Hero`: Landing page hero section with animations

## 🔧 Configuration

### Tailwind CSS
- Custom color palette
- Extended spacing and sizing
- Custom animations and keyframes
- Responsive breakpoints including `xs` (475px)

### Ant Design
- Custom theme tokens matching Tailwind colors
- Component-specific styling overrides
- Integrated with CSS variables

### TypeScript
- Path aliases configured (`@/*` maps to `src/*`)
- Strict type checking enabled
- Next.js types included

## 🎯 Development Guidelines

### Code Style
- Use Prettier for formatting
- Follow TypeScript best practices
- Use CSS-in-JS sparingly, prefer Tailwind utilities
- Implement proper error boundaries

### Component Development
- Prefer functional components with hooks
- Use TypeScript interfaces for props
- Include proper JSDoc comments for complex components
- Follow the established naming conventions

### Styling
- Use Tailwind utilities first
- Leverage CSS variables for theming
- Maintain consistency with the design system
- Use Ant Design components for complex UI patterns

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- `xs`: 475px and up
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🚦 Error Handling

- Global error boundary wraps the entire application
- Development mode shows detailed error information
- Graceful fallback UI for production errors
- Error reporting hooks for monitoring integration

## 📄 License

This project is private and proprietary to SouthPole.

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Ant Design.
