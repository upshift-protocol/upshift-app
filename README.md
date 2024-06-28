# Lazarev Earn App

Earn yields from real institutional loans via a crypto protocol. Users contribute to a decentralized pool on the blockchain, funding business loans and earning returns through smart contracts. Democratizing high-yield investments traditionally limited to financial institutions.

### Requirements

- Node.js 
- PNPM

### Getting started

Run the following command on your local environment:

```
pnpm install
```

Then, you can run locally in development mode with live reload:

```
pdnpm run dev
```

Open http://localhost:3000 with your favorite browser to see your project. For your information, Next JS need to take some time to compile the project for your first time.

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
│   ├── ui               # User interfaces components
│   └── utils            # Utility folder
├── ...
└── tsconfig.json        # TypeScript configuration
```

### Deploy to production

You can see the results locally in production mode with:

```
$ pnnpm run build
$ pnnpm run start
```

The generated HTML and CSS files are minified (built-in feature from Next js).

You can create an optimized production build with:

```
pnpm run build-prod
```

Now, the app is ready to be deployed. All generated files are located at `out` folder, which you can deploy with any hosting service.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug.

### License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.