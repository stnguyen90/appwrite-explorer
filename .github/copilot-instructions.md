# Appwrite Explorer

Appwrite Explorer is a React TypeScript web application that provides a user interface to explore and manage Appwrite projects. It uses Vite as the build system, Chakra UI for components, and connects to Appwrite backend services for database, storage, functions, and realtime features.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup

- Install dependencies: `npm install`
  - Requires `npm install --force` due to peer dependency warnings from legacy packages (`react-query@3.39.3` and `react-table@7.8.0`)
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
  - Uses multi-stage build with Node.js 20 and nginx:alpine
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

- **Problem**: npm install requires `--force` flag due to peer dependency warnings from `react-query@3.39.3` and `react-table@7.8.0`
- **Solution**: The React 19 upgrade works correctly with these legacy packages, but they haven't been updated to officially support React 19. Use `npm install --force` to bypass non-blocking peer dependency warnings.

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
- `Dockerfile` - Multi-stage Docker build (Node.js 20 + nginx)

### Important Commands Reference

```bash
# Setup
npm install --force

# Development
npm start                                    # Start dev server on :3000
npm run build                               # Build for production (~10s)
npm run format                              # Format with Prettier (~4s)
npx eslint src --ext .ts,.tsx              # Lint TypeScript files (~3s)

# Docker
docker build .                              # Build Docker image (5-10 min)
docker run --rm -p 8080:80 <image-name>    # Run containerized app on :8080
```

## Key Features

### Database Operations

The application supports full CRUD operations for database rows:

- **Create Row**: Use the "New Row" button to create a new row with custom ID, permissions, and JSON data
- **List Rows**: Query rows using the Appwrite Query syntax with filters, limits, and ordering
- **Update Row**: Click on a row's data to open the UpdateRowModal and edit permissions or JSON data
- **Delete Row**: In the UpdateRowModal, click the red "Delete" button to remove a row
  - A confirmation dialog appears to prevent accidental deletions
  - On successful deletion, the row is removed and the table refreshes automatically
  - Error handling with toast notifications for failed operations

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

## CI/CD Workflows

The repository uses GitHub Actions for continuous integration and deployment:

### Test Workflow (`.github/workflows/test.yml`)

- Triggers on: push to main, pull requests to main
- Node version: 20.x
- Steps:
  1. Checkout code
  2. Setup Node.js with npm cache
  3. Install dependencies with `npm i --force`
  4. Run tests with `npm test`
  5. Build project with `npm run build`
- **Duration**: ~1-2 minutes total

### Docker Image Publishing (`.github/workflows/publish-docker-image.yml`)

- Triggers on: new release published
- Builds multi-platform Docker images (linux/amd64, linux/arm64)
- Publishes to Docker Hub: `stnguyen90/appwrite-explorer`
- Uses semantic versioning tags
- **Duration**: ~5-10 minutes

### OSV-Scanner (`.github/workflows/osv-scanner.yml`)

- Scans for security vulnerabilities using Google's OSV-Scanner
- Triggers on: push to main, PRs to main, weekly schedule (Mondays at 8:31 AM)
- Uploads results to GitHub Security tab
- **Important**: Address any security findings before merging PRs

## Security and Dependencies

### Security Best Practices

- **NEVER** commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration
- The Appwrite endpoint and project ID should be user-configurable at runtime
- Review OSV-Scanner results in the Security tab regularly
- Keep dependencies up to date, but test thoroughly after updates

### Dependency Management

- **Current React Version**: 19.1.1 (with legacy package peer dependency warnings)
- **Package Manager**: npm with `--force` flag required
- **Known Compatibility Issues**:
  - `react-query@3.39.3` - legacy package, works but shows peer dependency warnings
  - `react-table@7.8.0` - legacy package, works but shows peer dependency warnings
- **Before Adding Dependencies**:
  - Check if functionality exists in current dependencies
  - Verify compatibility with React 19
  - Consider bundle size impact (current bundle: ~795KB)
  - Run `npm install --force` after adding

### Handling Security Vulnerabilities

- Run `npm audit` to check for known vulnerabilities
- For critical vulnerabilities, update dependencies immediately
- For moderate vulnerabilities, assess impact and update in next release
- Document any exceptions in PR description

## Architecture and Design Patterns

### Application Architecture

```
App (ChakraProvider + React Query)
├── AppwriteProvider (Appwrite Client context)
│   └── Routes (React Router)
│       ├── Login/Guest Access
│       └── Main Interface
│           ├── Database (CRUD operations)
│           ├── Storage (File management)
│           ├── Functions (Execution management)
│           ├── Teams (Team management)
│           └── Realtime (WebSocket subscriptions)
```

### Key Technologies

- **UI Framework**: Chakra UI v2.8.2 - Component library with theme support
- **State Management**: React Query v3.39.3 - Server state management and caching
- **Routing**: React Router DOM v7.8.0 - Client-side routing
- **Backend SDK**: Appwrite v20.1.0 - Official Appwrite JavaScript SDK
- **Form Handling**: React Hook Form v7.65.0 - Form validation and management
- **Code Editor**: Monaco Editor v4.6.0 - For JSON/code editing

### Design Patterns

- **Custom Hooks**: Each Appwrite service has a dedicated hook (e.g., `useAccount`, `useRows`, `useStorage`)
- **Context Pattern**: `AppwriteProvider` provides Appwrite client instance throughout the app
- **React Query Pattern**: API calls wrapped in React Query hooks for caching and state management
- **Component Composition**: Reusable components in `src/components/` directory

### State Management Guidelines

- Use React Query for server state (API data, caching)
- Use React Context for global app state (Appwrite client)
- Use local component state for UI state
- Avoid prop drilling - use context when needed

## Code Style and Conventions

### TypeScript Guidelines

- Use TypeScript strict mode (enabled in `tsconfig.json`)
- Define interfaces in `src/interfaces.ts` for shared types
- Use type inference where possible, explicit types for function signatures
- Avoid `any` type - use `unknown` if type is truly unknown

### React Component Guidelines

- Use functional components with hooks (no class components)
- Use `ReactElement` return type for components
- Follow React Hook rules (don't call hooks conditionally)
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

### File Organization

- **Components**: Place in `src/components/` (inputs, modals, tables, layout)
- **Pages**: Place in `src/pages/` (main views like Database, Storage)
- **Hooks**: Place in `src/hooks/` (API integration hooks)
- **Contexts**: Place in `src/contexts/` (global state providers)
- **Utilities**: Place in `src/utils/` (helper functions)
- **Tests**: Co-locate with source files using `.test.tsx` or `.test.ts` suffix

### Naming Conventions

- **Components**: PascalCase (e.g., `DatabasePage.tsx`, `LoginForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAccount.tsx`, `useRows.tsx`)
- **Utilities**: camelCase (e.g., `queryParser.ts`)
- **Constants**: UPPER_SNAKE_CASE in `constants.tsx`
- **Interfaces**: PascalCase (e.g., `AppwriteConfig`, `RowData`)

### Formatting and Linting

- **Prettier**: Configured for automatic formatting
- **ESLint**: TypeScript and Prettier integration
- **IMPORTANT**: ESLint 9.x requires new config format
  - Current `.eslintrc` uses legacy format
  - When running linting, you may see migration warnings
  - Existing linting errors are documented; only fix NEW errors you introduce
- Always run `npm run format` before committing

## Pull Request and Code Review Guidelines

### Before Submitting a PR

1. Run all validation checks:
   - `npm run format` - Format code
   - `npm test` - Run tests
   - `npm run build` - Verify build succeeds
2. Test functionality manually (follow Application Functionality Test)
3. Check for console errors or warnings
4. Update relevant documentation if needed
5. Write clear commit messages describing changes

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing Done

- [ ] Tested manually in browser
- [ ] Added/updated tests
- [ ] Verified build succeeds
- [ ] Checked for console errors

## Screenshots (if applicable)

Add screenshots for UI changes
```

### Code Review Expectations

- Reviews focus on: functionality, code quality, security, performance
- Address all review comments or explain why changes aren't needed
- Keep PRs focused and small (< 400 lines changed when possible)
- Be open to feedback and iterate on suggestions

## Troubleshooting Extended

### ESLint Configuration Issues

- **Issue**: ESLint 9.x expects `eslint.config.js` but project has `.eslintrc`
- **Workaround**: Use legacy format for now, migration to flat config planned
- **Alternative**: Run Prettier instead: `npm run format`

### Build Warnings About Bundle Size

- **Warning**: "Some chunks are larger than 500 kB after minification"
- **Status**: Known issue, bundle is ~795KB
- **Future**: Consider code splitting with dynamic imports
- **Current**: Safe to ignore, application loads acceptably

### React Query DevTools

- Not currently installed but can be added for development
- Add `@tanstack/react-query-devtools` if needed for debugging

### Monaco Editor Issues

- Monaco Editor is used for JSON/code editing
- If editor doesn't load, check browser console for module loading errors
- May need to adjust Vite config for Monaco worker files

### Appwrite Connection Issues

- Verify Appwrite endpoint URL is correct (e.g., `https://cloud.appwrite.io/v1`)
- Check CORS settings in Appwrite console
- Verify project ID is correct
- Check browser console for API errors

### Hot Module Reload Issues

- If changes don't reflect, try hard refresh (Ctrl+Shift+R)
- Check Vite dev server console for errors
- Restart dev server if HMR stops working: `Ctrl+C` then `npm start`

## Completing Work and Final Verification

Before finalizing your session and completing any task, you **MUST** perform the following steps:

### Required Final Steps

1. **Run all critical commands successfully:**

   ```bash
   npm install --force
   npm run test
   npm run build
   ```

   - All three commands must complete successfully with no errors
   - `npm install --force`: Must install all dependencies (typically 640+ packages)
   - `npm run test`: All tests must pass (currently 7 tests in 2 test suites)
   - `npm run build`: Build must complete successfully (typically in 4-5 seconds)

2. **Take screenshots of all changes:**
   - If you made code changes, capture screenshots showing the impact
   - For UI changes, always take screenshots of the application running
   - For documentation changes, capture screenshots showing the updated content
   - Include screenshots in the PR description or comments

3. **Verify changes work correctly:**
   - Test the application manually if UI/functionality was changed
   - Verify documentation is accurate and complete
   - Check that no unintended files were modified

### Verification Checklist

Before you report completion:

- [ ] `npm install --force` completed successfully
- [ ] `npm run test` all tests passed
- [ ] `npm run build` completed successfully
- [ ] Screenshots taken and documented
- [ ] Manual testing completed (if applicable)
- [ ] All changes have been committed via `report_progress`

**IMPORTANT**: Do not consider your work complete until all items in this checklist are verified.

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs) - Official Appwrite docs
- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started) - UI component library
- [React Query Documentation](https://tanstack.com/query/v3/docs/react/overview) - Server state management
- [Vite Documentation](https://vite.dev/) - Build tool and dev server
