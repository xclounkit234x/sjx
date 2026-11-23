# reGUST

reGUST is a browser-style web proxy built from the GUST shell, with Scramjet
JavaScript rewriting and libcurl.js/WISP transport. It is a client-side app and
does not use a Service Worker.

## Features

- Tabbed browser interface with history, bookmarks, and navigation controls
- GUST themes, skins, and appearance settings
- Configurable WISP server and connection settings
- DuckDuckGo as the default search engine; other engines can be selected in
  Settings
- Scramjet JavaScript rewriting for proxied pages
- Credits page at `gust://credits`
- Standalone HTML build

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by the Vite version in use)
- npm
- A network connection to reach a WISP relay and externally hosted fonts/icons

## Run locally

Install dependencies and start the Vite development server:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The app connects to a WISP relay to retrieve
proxied websites; relay availability and browser/network policies can affect
whether a site loads.

## Build

Create the standalone browser HTML:

```sh
npm run build
```

The generated file is `dist/index.html`. The build inlines the app's source
JavaScript and CSS, along with the Scramjet rewriter bundle. The page still
needs network access for WISP proxying and externally hosted fonts/icons, so
the output is not an offline copy of the internet.

The rewriter bundle can also be built on its own with:

```sh
npm run build:rewriter
```

## Project layout

```text
index.html                 Browser shell markup
src/app.js                 Browser UI, proxy navigation, and settings
src/regust-rewriter.js     Scramjet JavaScript rewriter integration
src/libcurl.js             Vendored libcurl.js runtime
src/acorn.js               Vendored Acorn parser
src/shell.css              Main browser shell styles
src/skins.css              Theme and skin styles
src/tail.css               Limited-mode/no-JavaScript styles
scripts/build-singlefile.mjs
                           Assembles dist/index.html
vite.rewriter.config.js    Builds the Scramjet rewriter bundle
```

## WISP and privacy

The browser uses a WebSocket-based WISP relay to fetch proxied content. You can
change the relay in Settings. A relay operator may be able to observe connection
metadata and the traffic it handles; use a relay you trust and review its
policies. Public relay availability is not guaranteed.

The app also loads fonts and icons from external CDNs. For attribution and
third-party dependency details, open `gust://credits` inside reGUST.

**Built off of:**
[GUST](https://github.com/nautilus-os/GUST) by [Nautilus Labs](https://github.com/nautilus-os/)
[Scramjet](https://github.com/MercuryWorkshop/scramjet) by [Mercury Workshop](https://github.com/MercuryWorkshop/)