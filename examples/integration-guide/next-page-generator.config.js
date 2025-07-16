/**
 * Next Page Generator Configuration
 * 
 * This file configures the automatic page generation from data sources.
 */
module.exports = {
    // Optional custom template function with dynamic route handling
    template: (item) => {
      // Extract component name safely
      const componentName = item.path.split('/')
        .map(segment => {
          // Handle dynamic parameters
          if (segment.startsWith('[') && segment.endsWith(']')) {
            const paramName = segment.slice(1, -1);
            return paramName.charAt(0).toUpperCase() + paramName.slice(1);
          }
          // Normal segments
          return segment.charAt(0).toUpperCase() + segment.slice(1);
        })
        .join('');
      
      // For dynamic routes, include the parameter in the component
      const hasParams = item.path.includes('[');
      
      return `
  import React from 'react'
  import type { NextPage } from 'next'
  import Head from 'next/head'
  ${hasParams ? 'import { useRouter } from "next/router"' : ''}
  
  const ${componentName}Page: NextPage = () => {
    ${hasParams ? 'const router = useRouter()\n  const { ' + 
      item.path.match(/\[(.*?)\]/g)?.map(param => param.slice(1, -1)).join(', ') + 
      ' } = router.query' : ''}
    
    return (
      <div>
        <Head>
          <title>${item.title}</title>
          <meta name="description" content="${item.content.substring(0, 160)}" />
        </Head>
  
        <main>
          <h1>${item.title}</h1>
          <p>${item.content}</p>
          ${hasParams ? '<p>Parameters: ' + 
            item.path.match(/\[(.*?)\]/g)?.map(param => {
              const paramName = param.slice(1, -1);
              return `{${paramName}}`; 
            }).join(', ') + '</p>' : ''}
        </main>
      </div>
    )
  }
  
  export default ${componentName}Page
  `
    }
  };