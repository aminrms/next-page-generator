# TypeScript Next.js example

This is a really simple project that shows the usage of Next.js with TypeScript.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript&project-name=with-typescript&repository-name=with-typescript)

## How to use it?

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-typescript with-typescript-app
```

```bash
yarn create next-app --example with-typescript with-typescript-app
```

```bash
pnpm create next-app --example with-typescript with-typescript-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```shell
npm install --save-dev typescript
```

```shell
yarn install --save-dev typescript
```

```shell
pnpm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```shell
npm install --save-dev @types/react @types/react-dom @types/node
```

```shell
yarn install --save-dev @types/react @types/react-dom @types/node
```

```shell
pnpm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.

# next-page-generator

A flexible tool for dynamically generating Next.js pages from data sources. This package enables you to create pages in your Next.js application automatically based on your data files.

## Features

- 🚀 Generate Next.js pages from JSON data sources
- 👀 Watch data files for changes and regenerate pages automatically
- 🔧 Customizable page templates
- 🧩 Support for nested page paths
- 📄 TypeScript/JavaScript compatible (.js, .jsx, .ts, .tsx)

## Installation

```bash
npm install next-page-generator
# or
yarn add next-page-generator
```

## Quick Start

### 1. Create a configuration file

Create `next-page-generator.config.js` in your project root:

```js
module.exports = {
  sourceFile: 'data/pages.json',
  outputDir: 'pages',
  watch: true
};
```

### 2. Prepare your data file

Create `data/pages.json`:

```json
{
  "items": [
    {
      "path": "about",
      "title": "About Us",
      "content": "Learn more about our company."
    },
    {
      "path": "blog/first-post",
      "title": "My First Blog Post",
      "content": "This is my first blog post content."
    }
  ]
}
```

### 3. Add to your package.json scripts

```json
{
  "scripts": {
    "dev": "concurrently \"next-page-generator\" \"next dev\"",
    "build": "next-page-generator --no-watch && next build"
  }
}
```

### 4. Start your development server

```bash
npm run dev
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceFile` | string | 'data/sourceData.json' | Path to the JSON data file |
| `outputDir` | string | 'pages' | Directory where pages will be generated |
| `watch` | boolean | true | Watch for changes in the data file |
| `pathProperty` | string | 'path' | Property in data items to use as page path |
| `fileExtension` | string | '.js' | File extension for generated pages (.js, .jsx, .ts, .tsx) |
| `template` | function | (built-in) | Custom template function for page content |
| `verbose` | boolean | true | Show detailed logs during generation |

## Configuration File Formats

You can use any of these formats:
- `next-page-generator.config.js`
- `next-page-generator.config.json`
- `.next-page-generatorrc`
- `.next-page-generatorrc.json`
- `.next-page-generatorrc.js`

## CLI Usage

```bash
npx next-page-generator [options]
```

Options:
- `--help`, `-h`: Show help information
- `--watch`, `-w`: Watch for changes (default: true)
- `--no-watch`: Disable watching for changes
- `--verbose`, `-v`: Show detailed logs (default: true)
- `--quiet`, `-q`: Suppress logs

## Advanced Usage

### Custom Templates

You can define custom page templates to control exactly how your pages are generated:

```js
// next-page-generator.config.js
module.exports = {
  sourceFile: 'data/pages.json',
  outputDir: 'pages',
  fileExtension: '.tsx', // Use TypeScript
  template: (item) => `
import React from 'react';
import Layout from '../components/Layout';

const ${item.path.split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Page = () => {
  return (
    <Layout>
      <h1>${item.title}</h1>
      <div className="content">
        ${item.content}
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
      </div>
    </Layout>
  );
};

export default ${item.path.split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Page;
  `
};
```

### Programmatic Usage

For more control, you can use the package programmatically:

```javascript
// scripts/setup-pages.js
const { setupPageGenerator } = require('next-page-generator');

setupPageGenerator({
  sourceFile: 'data/pages.json',
  outputDir: 'pages',
  watch: true,
  verbose: true
});

console.log('Page generator initialized!');
```

Then in your package.json:

```json
{
  "scripts": {
    "dev": "node scripts/setup-pages.js & next dev"
  }
}
```

### Integration with Next.js Config

For advanced use cases, you can integrate directly in your Next.js config:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Only run the page generator during development
if (process.env.NODE_ENV === 'development') {
  require('next-page-generator/dist/cli');
}

module.exports = nextConfig;
```

## Data Format

Your data file should contain an `items` array with objects having at minimum:

```json
{
  "items": [
    {
      "path": "route/to/page", // Required: becomes the route path
      "title": "Page Title",   // Required: used in the page title
      "content": "Content"     // Required: page content
    }
  ]
}
```

You can add any additional properties to the items, which will be available in your custom templates.

## License

MIT
