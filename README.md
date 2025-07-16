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

A flexible tool to dynamically generate Next.js pages from data sources.

## Installation

```bash
npm install next-page-generator
# or
yarn add next-page-generator
```

## Quick Start with Configuration

1. Create a configuration file in your project root:

```js
// next-page-generator.config.js
module.exports = {
  sourceFile: 'data/pages.json',
  outputDir: 'pages',
  watch: true
};
```

2. Add to your package.json scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"next-page-generator\" \"next dev\""
  }
}
```

3. Run your development server:

```bash
npm run dev
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| sourceFile | string | 'data/sourceData.json' | Path to the source data file |
| outputDir | string | 'pages' | Directory where pages will be generated |
| watch | boolean | true | Whether to watch for changes to the source file |
| pathProperty | string | 'path' | Property name to use as path (fallbacks to 'id') |
| fileExtension | string | '.js' | File extension for generated pages |
| template | function | (built-in) | Custom page template function |
| verbose | boolean | true | Whether to log messages |

## Configuration File

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
- `--help`, `-h`: Show help message
- `--watch`, `-w`: Enable file watching
- `--no-watch`: Disable file watching
- `--verbose`, `-v`: Show detailed logs
- `--quiet`, `-q`: Suppress detailed logs

## Data Format

Your data file should follow this format:

```json
{
  "items": [
    { 
      "path": "about", 
      "title": "About Us", 
      "content": "This is the about page."
    },
    { 
      "path": "blog/first-post", 
      "title": "My First Post", 
      "content": "This is my first blog post."
    }
  ]
}
```

## Programmatic Usage

You can also use the package programmatically:

```javascript
const { setupPageGenerator } = require('next-page-generator');

setupPageGenerator({
  sourceFile: 'data/pages.json',
  // ...other options
});
```

## License

MIT
