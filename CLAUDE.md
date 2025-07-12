# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 重要提醒：编码前必读

**在开始任何编码工作之前，请务必先阅读 `DEVELOPMENT_PLAN.md` 文件**

该文件包含：
- 完整的开发指令集
- 当前项目进度状态
- 技术规范和质量标准
- 改进建议的执行时机

**编码流程：**
1. 📖 阅读 DEVELOPMENT_PLAN.md 相关指令
2. 🔍 确认当前开发阶段和任务
3. 💻 按照指令规范进行编码
4. ✅ 完成后更新项目状态

## Common Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run tests (Jest with React Testing Library)
pnpm test

# Run a specific test file
pnpm test -- __tests__/button.test.tsx

# Run tests in watch mode
pnpm test -- --watch
```

## High-Level Architecture

### Tech Stack
- **Next.js 15** with App Router (React 19)
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling (primary)
- **Ant Design v5** for complex UI components
- **Framer Motion** for animations
- **pnpm** as package manager

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── providers.tsx       # Global providers (Theme, Antd, ErrorBoundary)
│   ├── layout.tsx          # Root layout with metadata
│   └── globals.css         # CSS variables and global styles
├── components/
│   ├── ui/                 # Tailwind-based components
│   ├── ant/                # Ant Design wrapper components
│   ├── sections/           # Page sections
│   └── layouts/            # Header/Footer components
├── lib/                    # Utilities and configurations
│   ├── colors.ts           # Brand color definitions
│   └── utils.ts            # Helper functions
├── styles/
│   └── ant-theme.ts        # Ant Design theme configuration
└── hooks/                  # Custom React hooks
```

### Key Architecture Patterns

1. **Provider Pattern**: All providers are centralized in `src/app/providers.tsx`:
   - ThemeProvider: Manages light/dark theme with localStorage persistence
   - AntdProvider: Wraps Ant Design configuration
   - GlobalStylesProvider: Manages CSS variables for theming
   - ErrorBoundary: Global error handling

2. **Component Organization**:
   - UI components use Tailwind CSS primarily
   - Ant Design components are wrapped for consistent theming
   - All components are TypeScript with proper interfaces

3. **Theming System**:
   - CSS variables defined in `globals.css` and dynamically updated
   - Theme colors imported from `lib/colors.ts`
   - Both Tailwind and Ant Design share the same color tokens
   - Dark mode support with system preference detection

4. **Performance Optimizations**:
   - Debounced theme switching
   - CSS variable batch updates
   - Memory monitoring in development
   - Turbopack for faster dev builds

### Testing Strategy
- Jest with React Testing Library
- Test files in `__tests__/` directory
- Mock Framer Motion in tests to avoid animation issues
- Use TestWrapper component to provide theme context

### Development Guidelines

1. **Component Creation**:
   - Use TypeScript interfaces for all props
   - Follow existing component patterns (see Button component)
   - Use Tailwind utilities first, CSS-in-JS sparingly
   - Include proper accessibility attributes

2. **Styling Approach**:
   - Tailwind utilities for most styling
   - CSS variables for dynamic theming
   - Ant Design for complex components (forms, tables, etc.)
   - Use `clsx` and `tailwind-merge` for conditional classes

3. **Path Aliases**:
   - Use `@/` prefix for imports (maps to `src/`)
   - Example: `import { Button } from '@/components/ui/Button'`

4. **Theme Colors**:
   - Primary: Blue scale (South Pole brand)
   - Secondary: Ice blue scale
   - Arctic: Light blue scale
   - Additional: success (green), warning (orange), error (red)

## Important Notes

- The app uses React 19 and Next.js 15 (latest versions)
- Tailwind CSS v4 is configured with custom animations and extended theme
- All color definitions are centralized in `src/lib/colors.ts`
- Error boundaries are implemented for robust error handling
- The project follows a consistent file naming convention (PascalCase for components)