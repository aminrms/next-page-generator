const { setupPageGenerator } = require('next-page-generator');

// Initialize with custom options
setupPageGenerator({
  sourceFile: 'data/pages.json',
  outputDir: 'pages',
  watch: true,
  
  // Custom handling for data transformations
  template: (item) => {
    // You could fetch additional data or transform content here
    const enhancedContent = `${item.content}\n\nLast updated: ${new Date().toLocaleDateString()}`;
    
    return `
import React from 'react';
import Layout from '../components/Layout';

const Page = () => {
  return (
    <Layout title="${item.title}">
      <h1>${item.title}</h1>
      <div className="content">
        ${enhancedContent}
      </div>
    </Layout>
  );
};

export default Page;
    `;
  }
});

console.log('Page generator initialized!');
