# Earn App

Upshift pools generate yields from institutional loans on the August protocol.

## Getting Started

#### Requirements

- Node.js 
- PNPM

#### Environment Variables

Create a `.env.local` to input the following variables:

- `NEXT_PUBLIC_INFURA_API_KEY`: being your infura API key
- `NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY`: being your august digital API key

#### Development

Run the following command on your local environment:

```
pnpm install
```

Then, you can run locally in development mode with live reload:

```
pnpm dev
```

Open http://localhost:3000 with your favorite browser to see your project. For your information, Next JS need to take some time to compile the project for your first time.

## Directory

```
.
├── README.md            # README file
├── next.config.js       # Next JS configuration
...
├── src
│   ├── config           # All configuration files
│   ├── hooks            # Hooks used throughout the app
│   ├── pages            # Next JS pages
│   ├── styles           # All CSS files
│   ├── ui               # Atomically-designed UI components
│   └── utils            # Utility folder
├── ...
└── tsconfig.json        # TypeScript configuration
```

## Deployment

You can see the results locally in production mode with:

```
$ pnpm build
$ pnpm start
```

The generated HTML and CSS files are minified (built-in feature from Next js).

You can create an optimized production build with:

```
pnpm build-prod
```

Now, the app is ready to be deployed. All generated files are located at `out` folder, which you can deploy with any hosting service.

## Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug. PR's should be made to `main` branch and await approval from team.

## License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.