module.exports = {
  // Path to your data file
  sourceFile: 'data/pages.json',
  
  // Output directory (usually 'pages' or 'src/pages' in Next.js projects)
  outputDir: 'pages',
  
  // Whether to watch for changes in the data file
  watch: true,
  
  // File extension for the generated pages
  fileExtension: '.tsx',
  
  // Log detailed information during generation
  verbose: true,
  
  // Custom template for TypeScript pages
  template: (item) => `
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

const ${item.path.split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>${item.title}</title>
        <meta name="description" content="${item.content.substring(0, 160)}" />
      </Head>

      <main>
        <h1>${item.title}</h1>
        <p>${item.content}</p>
      </main>
    </div>
  )
}

export default ${item.path.split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Page
`
};
