# Bellum Gens: Looking for Group & Esports Business League (EB-League)

![Node.js CI](https://github.com/BellumGens/bellum-gens/workflows/Node.js%20CI/badge.svg)
[![Deployment Status](https://github.com/BellumGens/bellum-gens/actions/workflows/master_bellumgens.yml/badge.svg)](https://github.com/BellumGens/bellum-gens/actions/workflows/master_bellumgens.yml)
[![Coverage Status](https://coveralls.io/repos/github/BellumGens/bellum-gens/badge.svg)](https://coveralls.io/github/BellumGens/bellum-gens)

## Overview

Bellum Gens is a monorepo project containing two Angular applications:

- [**Bellum Gens**](https://bellumgens.com) - The main Bellum Gens web application, hosting information about Bellum Gens and Bellum Gens Elite. 
- [**EB-League**](https://eb-league.com) - An Esports Business League management platform for organizing and running esports tournaments and competitions.

Both applications share a common library (`bellum-gens-common`) with shared services, models, and utilities, and are built with [Angular 21](https://angular.io/), [Infragistics Ignite UI](https://www.infragistics.com/products/ignite-ui-angular), and [RxJS](https://rxjs.dev/).

## Project Structure

```
projects/
├── bellumgens/          # Main Bellum Gens application
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── locale/      # i18n translation files
│       ├── main.ts      # Client entry point
│       └── main.server.ts # SSR entry point
├── ebleague/            # Esports Business League application
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── locale/      # i18n translation files
│       ├── main.ts      # Client entry point
│       └── main.server.ts # SSR entry point
└── common/              # Shared library (published to npm)
    └── src/
        ├── environments/
        ├── guards/
        ├── lib/
        ├── models/
        └── services/
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- [bellum-gens-api-core](https://github.com/BellumGens/bellum-gens-api-core) running locally (required for API integration)

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/BellumGens/bellum-gens.git
cd bellum-gens

# Install dependencies
npm install

# Clone and run the API server (in a separate terminal)
git clone https://github.com/BellumGens/bellum-gens-api-core.git
cd bellum-gens-api-core
# Follow the API setup instructions
```

### 2. Development Server

Start both applications concurrently:

```bash
npm start
```

This will launch:
- **Bellum Gens** at `http://localhost:4200`
- **EB-League** at `http://localhost:4201`

To run individual applications:

```bash
npm run start-bellumgens   # Bellum Gens only (port 4200)
npm run start-ebleague     # EB-League only (port 4201)
```

## Build

### Build for Production

Build all applications:

```bash
npm run build
```

This will:
1. Build the common library (`npm run build:common`)
2. Build both applications (`npm run build:bellumgens` and `npm run build:ebleague`)

Output is generated in the `dist/` directory.

### Server-Side Rendering (SSR)

Build with SSR:

```bash
npm run build:ssr:bellumgens
npm run build:ssr:ebleague
```

Serve SSR applications:

```bash
npm run serve:ssr:bellumgens
npm run serve:ssr:ebleague
```

Or run concurrently:

```bash
npm run dev:ssr:bellumgens
npm run dev:ssr:ebleague
```

## Testing

### Unit Tests

Run unit tests for all projects:

```bash
npm run test
```

Run with code coverage and no watch mode:

```bash
npm run test:prod
```

### End-to-End Tests

Run e2e tests with Cypress:

```bash
npm run cypress:open       # Open Cypress in interactive mode
npm run cypress:run        # Run Cypress in headless mode
```

## Code Quality

### Linting

Check code style with ESLint:

```bash
npm run lint
```

The project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages.

## Internationalization (i18n)

Extract translation strings:

```bash
npm run i18n               # Extract for all applications
npm run i18n:bellumgens    # Extract for Bellum Gens only
npm run i18n:ebleague      # Extract for EB-League only
```

Translation files are located in `projects/*/src/locale/` and follow XLIFF format.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

Key guidelines:
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Follow ESLint rules - run `npm run lint` to check
- Write tests for new code - run `npm run test:prod` to verify
- Use the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)

## Technologies

- **Angular** 21 - Frontend framework
- **Infragistics Ignite UI** - Enterprise UI components
- **RxJS** - Reactive programming library
- **TypeScript** 5.9 - Language
- **Sass** - CSS preprocessing
- **Cypress** - E2E testing
- **Karma/Jasmine** - Unit testing
- **ESLint** - Code linting
- **Express.js** - SSR server runtime

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Community

- **Code of Conduct**: See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/BellumGens/bellum-gens/issues)
- **Pull Requests**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines

## Additional Resources

- [Angular CLI Documentation](https://angular.io/cli)
- [Ignite UI for Angular](https://www.infragistics.com/products/ignite-ui-angular)
- [RxJS Documentation](https://rxjs.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
