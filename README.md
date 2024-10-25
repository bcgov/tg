## MOTI Tech Inventory Network Graph

The Network Graph is a visualization tool to allow users to explore complex relationships between applications, technologies, and environments. The tool is designed to dynamically process and display MOTI Tech Landscape in an interactive, intuitive, and scalable way.

## Prerequisites

- Node 21 and npm 10.2

- WSL2 (Optional. But if you come from \*nix, this is for you. I use Arch WSL)

- PowerApps CLI

## Tech Stack

- TypeScript

- React

- Node

- D3

- Tailwind

## Folder Structure

```
src/
│
├── components/
│   ├── NetworkGraph.tsx  # Main visualization component
│   ├── Modal.tsx         # Renders modal popups with node details
│   └── overlays/         # Contains UI overlays like settings and search
│
├── hooks/
│   ├── useFetchData.ts   # Fetches data from APIs
├── services/
│   ├── Appearance.ts     # Handles styling and appearance for nodes/links
│   ├── NodesLink.ts      # Defines nodes and links
│   ├── Canvas.ts         # Creates the Canvas plane
│   └── Simulations.ts    # Configures the D3 force simulation
│
├── utils/
│   ├── NodeTypes.ts      # TypeScript interfaces for nodes and links
│   ├── ConvexHulls.ts    # Function to draw convex hulls for clustering
│   ├── Zoom.ts           # Configures zoom behavior for D3
│   └── const.ts          # Constants for application (e.g., Date, Views)
│
├── NetworkGraph/         # PCF Component assets
├── index.tsx             # Class-based React DOM entry point
tailwind.config.js        # Tailwind configuration
tsconfig.json             # TypeScript configuration
```

The separation of concerns between services and utils are to be noted. utils are implementation agnostic, and services aren’t. Should this project be repurposed or reused for other objectives (say, a different ministry), we would only need to modify services.

## Usage

### Running and Development

Clone the repository

```
git clone https://github.com/bcgov/tg.git or ssh -T git@github.com:bcgov/tg.git
```

Build Tailwind

```
npx tailwindcss -i ./src/index.css -o ./src/generated/style.css
```

Use --watch to watch your changes as more classes are added

Run it

```
npm start
```

PCF Context.WebAPI is only given on runtime in a model-driven apps and portals. Since your local development is not treated as such, you have to:

- Create a proxy server to fetch the API for you. Either by copy-pasting the cookie header to make the request or use OAuth with client credentials given in Azure EntraID. Then you modify our React hook to fetch the necessary data.

- Use Fiddler
  \*\* For canvas app: https://learn.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/streamline-javascript-development-fiddler-autoresponder?view=op-9-1

- Mocking Data Locally: Simply query the API and take those responses as a local JSON files that you use for development.

## Deployment

Before you deploy, however you deploy it, please remember to increment the version in src\ControlManifest.Input.xml (this is the code component) and src\TechInventoryNetworkGraph\src\Other\Solution.xml(the Solution itself) as dear Microsoft does not automatically do it for you.

For a more detailed guide, please refer to https://learn.microsoft.com/en-us/power-apps/developer/component-framework/create-custom-controls-using-pcf

Deployment is automated using GitHub Actions https://github.com/bcgov/tg/actions , however, should you ever need to deploy it from your machine, here are some options:

- Debug: Simply `pac pcf push` and this will automatically create a debug component in PowerApps.

- Release: In the directory containing PCF Component Assets, run `msbuild /p:configuration=Releasefrom` a developer Command Prompt. This will create bin/Releasefolder containing an uploadable .zip .

API

Microsoft provides all the properties and methods available in a PCF. The method we’re interested in the most is the WebAPI. Unfortunately, it is only available for Model-driven apps and portals. Please refer to development for available methods.

Context.WebApi

Context is passed to the PCF component from a model-driven applications and portals at runtime.

Here’s an example for retrieveMultipleRecords:

context.webAPI.retrieveMultipleRecords(entityLogicalName, options, maxPageSize).then(successCallback, errorCallback);

## Frontend

The frontend implementation is loosely based on the https://www2.gov.bc.ca/gov/content/digital/design-system to comply with accessibility standard and to speed the development process. For custom components, sizing guidelines from Figma https://www.figma.com/design/K9LflMXx1hOXGEhhKyKuBm/B.C.-Design-System-(Community)?node-id=3351-1799&node-type=canvas&t=fhDXhKlhHrS7Vr3x-0 were taken. The React component storybook can be found here.

I have made a colour scheme in Figma https://www.figma.com/design/FbokUSV239ZswUUks2crFh/Colour-Schemes?node-id=7-1619&node-type=canvas&t=vDkYUGEUa6XMCpqa-0

### TailwindCSS

Instead of writing our own CSS, a utility-class CSS framework is used. This ensures that our components are original; that it does not come from an opinionated library.

Be sure to check out tailwind.config.js to get a better understanding of the theming choices and build configurations.

You can test your Tailwind classes with your configuration on its playground: https://play.tailwindcss.com/

#### Dark mode

Our dark mode respects system settings of the Operating System via media query prefers-color-scheme: dark

Dark mode classes are added using the selector dark:. As such, you should write classes for both default and dark mode. For example:

```
<div className="bg-node-db-light dark:bg-node-db-dark"></div>
```

More details on dark mode can be found here: https://tailwindcss.com/docs/dark-mode

## Graph

D3 is used for the creation of this graph as it offers intuitive use, performance scaling with the number of vertices and edges.

The guideline used for the graph representation can be found here: https://elijahmeeks.com/networkviz/
