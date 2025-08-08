# Appwrite Explorer

Appwrite Explorer is a React TypeScript web application that provides a user interface to explore and manage Appwrite projects. It uses Vite as the build system, Chakra UI for components, and connects to Appwrite backend services for database, storage, functions, and realtime features.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup

- Install dependencies: `npm install`
  - May require `npm install --force` if peer dependency warnings appear from legacy packages
  - Takes ~60 seconds to complete
  - Install creates `node_modules` directory and installs 700+ packages
- Create required Jest mock files (if missing):
  - `mkdir -p __mocks__`
  - Create `__mocks__/fileMock.js` with content: `module.exports = 'test-file-stub';`
  - Create `__mocks__/styleMock.js` with content: `module.exports = {};`

### Build Process

- Build the application: `npm run build`
  - **NEVER CANCEL**: Build takes approximately 10-12 seconds. ALWAYS wait for completion.
  - Command runs TypeScript compilation (`tsc`) followed by Vite build
  - Creates `dist/` directory with production build
  - **WARNING**: Build output includes large bundle warning (781kB) - this is expected
  - Set timeout to 60+ seconds to ensure build completes

### Development Server

- Start development server: `npm start`
  - Runs on http://localhost:3000 by default
  - Uses Vite dev server with hot module reloading
  - **NEVER CANCEL**: Server startup takes ~5 seconds, then runs continuously
  - Browser automatically opens to the application
  - To test application: Navigate to login screen, click "Continue as Guest", fill in:
    - Endpoint: `https://cloud.appwrite.io/v1`
    - Project ID: `test-project`
  - Then click "Continue as Guest" again to access main interface

### Testing

- Run tests: `npm test`
  - Tests now pass successfully with React 19 and jest polyfills
  - TextEncoder/TextDecoder polyfills handled by `jest.setup.js`
  - Tests use simplified approach without DOM rendering to avoid compatibility issues
  - Current tests: `src/App.test.tsx` contains 3 tests validating App component structure
  - Test configuration includes Jest mock files for assets and styles

### Code Quality

- Format code: `npm run format`
  - Uses Prettier to format all files in project
  - Takes ~4 seconds to complete, processes 50+ files
  - **ALWAYS** run before committing changes
- Lint code: `npx eslint src --ext .ts,.tsx`
  - Uses ESLint with TypeScript and Prettier plugins
  - Takes ~2-3 seconds to complete
  - **NOTE**: Repository currently has 6 ESLint errors (unused variables)
  - Configuration in `.eslintrc` extends TypeScript and Prettier recommended rules

### Docker Build

- Build Docker image: `docker build .`
  - **NEVER CANCEL**: Docker build takes 5-10 minutes. Set timeout to 15+ minutes.
  - Uses multi-stage build with Node.js 18 and nginx:alpine
  - Dockerfile has been updated to use `dist/` directory (not `build/`)
  - Final image serves application on nginx

## Validation Scenarios

After making changes, ALWAYS test these scenarios:

### Application Functionality Test

1. Start development server: `npm start`
2. Navigate to http://localhost:3000
3. Verify login screen appears with Appwrite Explorer title
4. Fill in test credentials:
   - Endpoint: `https://cloud.appwrite.io/v1`
   - Project ID: `test-project`
5. Click "Continue as Guest"
6. Verify main interface loads with navigation: Database, Storage, Functions, Realtime
7. Verify Database interface shows fields for Database ID, Collection ID, Queries
8. Take screenshot to confirm UI is working

### Build Validation Test

1. Run `npm run build` and wait for completion (~10 seconds)
2. Verify `dist/` directory is created with `index.html` and assets
3. Check that build succeeds without TypeScript errors

### Code Quality Test

1. Run `npm run format` to ensure code formatting
2. Run `npx eslint src --ext .ts,.tsx` to check for linting issues
3. Address any new ESLint errors before committing

## Common Issues and Solutions

### Dependency Installation Issues

- **Problem**: npm install may show peer dependency warnings from `react-query@3.39.3` and `react-table@7.8.0`
- **Solution**: The React 19 upgrade has resolved most peer dependency conflicts. If warnings appear, use `npm install --force` to bypass non-blocking warnings.

### React Version Compatibility

- **Current State**: React 19.1.1 is working correctly with jest polyfills
- **Testing**: TextEncoder/TextDecoder polyfills are provided by `jest.setup.js`
- **Solution**: Project uses React 19 for modern compatibility and performance.
- **Testing Approach**: Uses simplified component structure testing instead of DOM rendering

### Build Directory Confusion

- **Important**: Vite builds to `dist/` directory, NOT `build/`
- The Dockerfile has been updated to reference correct `dist/` directory

### ESLint Errors

- **Current State**: Repository has 6 ESLint errors related to unused variables
- **Action**: Fix only NEW ESLint errors introduced by your changes
- **Do NOT**: Attempt to fix all existing ESLint errors as part of feature work

## Key Project Structure

### Important Directories

- `src/` - Main source code
  - `src/components/` - React components (Layout, Routes, inputs, modals, tables)
  - `src/pages/` - Page components (Database, Storage, Functions, Teams, etc.)
  - `src/hooks/` - Custom React hooks for Appwrite API calls
  - `src/contexts/` - React context providers
- `dist/` - Vite build output (created by `npm run build`)
- `__mocks__/` - Jest mock files for testing
- `.github/workflows/` - GitHub Actions for Docker image publishing

### Key Files

- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Vite build configuration (port 3000, React with Emotion)
- `tsconfig.json` - TypeScript configuration
- `.eslintrc` - ESLint configuration
- `Dockerfile` - Multi-stage Docker build (Node.js 18 + nginx)

### Important Commands Reference

```bash
# Setup
npm install

# Development
npm start                                    # Start dev server on :3000
npm run build                               # Build for production (~10s)
npm run format                              # Format with Prettier (~4s)
npx eslint src --ext .ts,.tsx              # Lint TypeScript files (~3s)

# Docker
docker build .                              # Build Docker image (5-10 min)
docker run --rm -p 8080:80 <image-name>    # Run containerized app on :8080
```

## Testing Instructions

### Manual Application Test

1. Ensure development server is running (`npm start`)
2. Navigate to http://localhost:3000
3. Verify the login screen appears correctly
4. Test guest access flow:
   - Enter endpoint: `https://cloud.appwrite.io/v1`
   - Enter project ID: `test-project`
   - Click "Continue as Guest"
5. Verify main application interface loads
6. Test navigation between Database, Storage, Functions, Realtime sections
7. Verify no JavaScript console errors

### Build Verification

1. Run `npm run build` and verify successful completion
2. Check `dist/` directory contains `index.html` and bundled assets
3. Verify no TypeScript compilation errors

**ALWAYS** perform these validation steps after making changes to ensure the application remains functional.
