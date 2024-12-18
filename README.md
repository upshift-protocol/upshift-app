# Earn App

Upshift pools generate yields from institutional loans on the August protocol using the [August SDK](https://www.npmjs.com/package/@augustdigital/sdk).

## Table of Contents

- [Getting Started](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#getting-started)
  - [Requirements](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#requirements)
  - [Environment Variables](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#environment-variables)
  - [Installation](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#installation)
  - [Development](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#development)
- [Directory](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#directory)
- [Deployment](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#deployment)
  - [Live Links](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#live)
- [Contributions](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#contributions)
- [License](https://github.com/lazarev-protocol/upshift-app?tab=readme-ov-file#license)

## Getting Started

This frontend features:

- [Typescript as the core language](https://www.typescriptlang.org/)
- [NextJS to enable SSR](https://nextjs.org/)
- [TailwindCSS to assist in styling](https://tailwindcss.com/)
- [Prettier to keep code clean](https://prettier.io/)
- [ESLint to ensure code builds](https://eslint.org/)
- [Husky to automate git interactions](https://typicode.github.io/husky/)

### Requirements

- [Node.js v18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/)

### Environment Variables

Create a `.env` file to input the following variables:

- `NEXT_PUBLIC_INFURA_API_KEY`: being your infura API key
- `NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY`: being your august digital API key

or copy and paste the `.env.sample` with your appropriate values

### Installation

Run the following command on your local environment:

```bash
pnpm install
```

### Development

Run the local development server with:

```bash
pnpm dev
```

*which injects the environment variable `NEXT_PUBLIC_DEV=1` in order to display logs and render the devtools.*

Open http://localhost:3000 in your browser to start working on the UpShift app. 

Or run
```bash
pnpm dev:referral
```
to enable the Upshift Referral Program in your development server.

*Note: Next JS requires some additional time to compile the project for your first time.*

To run the project using a diiferent network, you can either:

1) use `pnpm dev:<NETWORK_NAME (local for example)>`

2) inject the following `.env` variable, `NEXT_PUBLIC_NETWORK=`

#### Adding New Tokens Images

In order to properly render a token, a token image must be added to `/src/ui/atoms/token-logo.tsx` as an `svg` or `Image`.

## Directory

```
.
├── README.md                   # README file
├── next.config.js              # Next JS configuration
├── scripts                     # Scripts to be run to assist in deployment and codebase cleanup
...
├── src
│   ├── config                  # All configuration files
│   ├── hooks                   # Hooks used throughout the app
│   ├── pages                   # Next JS pages
│   ├── styles                  # All CSS files
│   ├── ui                      # Atomically-designed UI components
│   │   ├── atoms               # Smallest component, like a button
│   │   ├── molecules           # Made up of atoms to build organisms
│   │   ├── organisms           # Larger, fully-functional component made up of atoms and molecules
│   │   └── skeletons           # Templates, layouts, and core components like a header
│   └── utils                   # Utility folder
│       ├── constants           # Various constant variables denoted in uppercase
│       ├── helpers             # Various helper methods
│       └── types.ts            # Global typescript interfaces 
├── ...
└── tsconfig.json               # TypeScript configuration
```

## Deployment

You can see the results locally in production mode with:

```bash
pnpm build
pnpm start
```

The generated HTML and CSS files are minified (built-in feature from Next js).

Now, the app is ready to be deployed. All generated files are located at `out` folder, which you can deploy with any hosting service.

Given there are 4 live instances of upshift deployed, there is a simple script that can be run once the work / new features in `develop` branch. By running `sh scripts/update-instances.sh` that will merge in `develop` and update all instances that are outlined below.

*Note: there is a github workflow that will deploy all various instances (`avax`, `lombard`, etc) when there is a push to `develop`.*

### Live

The site is currently deployed using AWS Amplify on the following links:

- https://private.upshift.finance (`main`)
- https://app-staging.upshift.finance (`develop`)
- https://avax.upshift.finance (`avax`)
- https://lombard.upshift.finance (`lombard`)
- https://treehouse.upshift.finance (`treehouse`)
- https://ethena.upshift.finance (`ethena`)

## Contributions

Everyone is welcome to contribute to the Upshift web-app. Feel free to [open an issue](https://github.com/upshift-protocol/upshift-app/issues) if you have a proposal or found a bug. PR's should be made to `develop` branch and await approval from team which will go through a QA process before being merged to the production branch, `main`.

## License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.