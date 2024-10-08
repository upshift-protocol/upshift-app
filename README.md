# Earn App

Upshift pools generate yields from institutional loans on the August protocol.

## Getting Started

#### Requirements

- [Node.js v18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/)

#### Environment Variables

Create a `.env` file to input the following variables:

- `NEXT_PUBLIC_INFURA_API_KEY`: being your infura API key
- `NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY`: being your august digital API key

or copy and paste the `.env.sample` with your appropriate values

#### Installation

Run the following command on your local environment:

```bash
pnpm install
```

#### Development

Run the local developer server with:

```bash
pnpm dev
```

*which injects the environment variable `NEXT_PUBLIC_DEV=1` in order to display logs and render the devtools.*

Open http://localhost:3000 in your browser to start working on the UpShift app. 

*Note: Next JS requires some additional time to compile the project for your first time.*

To run the project using a diiferent network, you can either:

1) use `pnpm dev:<NETWORK_NAME (local for example)>`

2) inject the following `.env` variable, `NEXT_PUBLIC_NETWORK=`

## Directory

```
.
├── README.md                   # README file
├── next.config.js              # Next JS configuration
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

You can create an optimized production build with:

```
pnpm build-prod
```

Now, the app is ready to be deployed. All generated files are located at `out` folder, which you can deploy with any hosting service.

#### Live

The site is currently deployed using netlify on the following links:

- https://upshift.netlify.app (`main`)
- https://upshift-staging.netlify.app (`develop`)

## Contributions

Everyone is welcome to contribute to the Upshift web-app. Feel free to [open an issue](https://github.com/lazarev-protocol/earn-app/issues) if you have a proposal or found a bug. PR's should be made to `develop` branch and await approval from team which will go through a QA process before being merged to the production branch, `main`.

## License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.