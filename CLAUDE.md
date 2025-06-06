# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run build` - Build the package using tsup (generates both CJS and ESM outputs)
- `npm run dev` - Watch mode for development builds
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run lint` - Lint TypeScript files in src/ directory using ESLint
- `npm run test` - Run Jest tests (requires .env file with TUSHARE_TOKEN)
- `npm run example` - Run comprehensive demo showcasing all APIs

### Testing
- Tests are located in the `test/` directory and use Jest
- Test files use `.js` extension and are configured for Node.js environment
- Tests require a valid TuShare Pro token in `.env` file
- Test timeout is set to 30 seconds for API calls

## Architecture Overview

This is a TypeScript SDK for the TuShare Pro financial data API with zero runtime dependencies.

### Core Structure
- `src/core/request.ts` - Main HTTP client with fetch abstraction and token management
- `src/apis/` - High-level API wrappers (daily, realtime, stock, index)
- `src/types/` - TypeScript type definitions
- `src/errors/` - Custom error classes for different failure scenarios

### Key Design Patterns
- **Zero Dependencies**: Uses native fetch API or optional undici peer dependency
- **Token Management**: Global token initialization via `init()` function
- **Cross-Platform**: Supports both Node.js 16+ and modern browsers
- **Type Safety**: Full TypeScript coverage with generated declaration files

### HTTP Client (`src/core/request.ts`)
- Handles TuShare API authentication and request formatting
- Auto-detects fetch availability (native vs undici)
- Implements 10-second timeout with AbortController
- Transforms TuShare's field/items response format to typed objects
- Exports both low-level `request()` and public `call()` functions

### API Layer Pattern
Each API module follows the same pattern:
- Validates input parameters (date formats, required fields)
- Calls the core request function with appropriate API name
- Returns typed response data
- Example: `getDaily()` calls `request('daily', params, fields)`

### Available APIs
- **Basic Data**: `getTradeCal`, `getStockBasic` (enhanced)
- **Market Data**: `getDaily`, `getMinuteData`, `getWeeklyData`, `getMonthlyData`
- **Real-time**: `getRealtimeQuote`
- **Advanced**: `getIndexWeight`, `call` (generic interface)

### Build Configuration
- Uses tsup for building both CommonJS and ESM formats
- Generates TypeScript declarations with source maps
- Target is Node.js 16+ for compatibility
- Output includes both minified and unminified versions

### Environment Setup
- Requires `TUSHARE_TOKEN` environment variable for API access
- Uses dotenv for development environment configuration
- Tests automatically load environment variables via setup.js