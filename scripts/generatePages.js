const fs = require('fs');
const path = require('path');

const sourceDataPath = path.join(__dirname, '../data/sourceData.json');
const pagesDirectory = path.join(__dirname, '../pages');

// --- Helper to capitalize for component names from path segments ---
// This helper needs to be more robust for nested paths.
// Example: 'products/details' -> 'ProductsDetails'
function createComponentName(filePath) {
  // Remove .js extension if present and normalize path separators
  const name = filePath.replace(/\.js$/, '').replace(/\\/g, '/');
  return name.split('/') // Split by path segments
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)) // Capitalize each segment
    .join(''); // Join them together
}
// --- End Helper ---

function generatePage(item) {
  // Now we expect a 'path' property instead of 'id'
  if (!item || typeof item.path !== 'string' || typeof item.title !== 'string' || typeof item.content !== 'string') {
    console.error('Error: Skipping generation for malformed item. Item must have string properties: path, title, content.', item);
    return;
  }

  // Construct the full file path including nested directories
  // Normalize the path to handle both '/' and '\' on Windows
  const pageRelativePath = item.path.replace(/\\/g, '/'); // Ensure forward slashes for internal consistency
  const componentFileName = pageRelativePath.split('/').pop(); // Get the last segment for the file name (e.g., 'details' from 'products/details')
  const componentName = createComponentName(pageRelativePath); // Get a suitable component name (e.g., 'ProductsDetails')


  const newPageContent = `
import React from 'react';

const ${componentName}Page = () => {
  return (
    <div>
      <h1>${item.title}</h1>
      <p>${item.content}</p>
    </div>
  );
};

export default ${componentName}Page;
  `;

  // Determine the full target file path
  // E.g., path.join(pagesDirectory, 'products', 'details.js')
  const targetFilePath = path.join(pagesDirectory, `${pageRelativePath}.js`);
  const trimmedNewContent = newPageContent.trim();

  // Create necessary subdirectories if they don't exist
  const parentDir = path.dirname(targetFilePath);
  if (!fs.existsSync(parentDir)) {
    try {
      fs.mkdirSync(parentDir, { recursive: true });
      console.log(`Created directory: ${parentDir}`);
    } catch (mkdirError) {
      console.error(`Error creating directory ${parentDir}: ${mkdirError.message}. Skipping page generation for ${item.path}`);
      return; // Abort if directory creation fails
    }
  }

  // Check if file exists and compare content
  if (fs.existsSync(targetFilePath)) {
    try {
      const existingContent = fs.readFileSync(targetFilePath, 'utf8').trim();
      if (existingContent === trimmedNewContent) {
        console.log(`Skipping generation for ${targetFilePath}: Content is identical.`);
        return; // No change, so don't write
      }
    } catch (readError) {
      console.error(`Error reading existing file ${targetFilePath}: ${readError.message}. Attempting to overwrite.`);
      // Continue to write if reading failed
    }
  }

  // Write the file (or overwrite if different or read failed)
  try {
    fs.writeFileSync(targetFilePath, trimmedNewContent);
    console.log(`Generated/Updated page: ${targetFilePath}`);
  } catch (writeError) {
    console.error(`Error writing file ${targetFilePath}: ${writeError.message}.`);
  }
}

function runGeneration() {
  console.log('Running code generation...');

  let itemsToGenerate = [];

  try {
    if (!fs.existsSync(sourceDataPath)) {
      console.warn(`Warning: Source data file not found at ${sourceDataPath}. No pages will be generated from source.`);
    } else {
      const rawData = fs.readFileSync(sourceDataPath, 'utf8');
      const parsedData = JSON.parse(rawData);

      if (parsedData && Array.isArray(parsedData.items)) {
        itemsToGenerate = parsedData.items;
      } else {
        console.error(`Error: ${sourceDataPath} does not contain a valid 'items' array.`);
        console.error('No pages will be generated from source due to malformed data. Existing pages will be kept.');
      }
    }
  } catch (error) {
    console.error(`Critical Error reading or parsing ${sourceDataPath}: ${error.message}`);
    console.error('Code generation aborted due to source data error. Existing pages will be kept.');
  }

  // Ensure the base pages directory exists
  if (!fs.existsSync(pagesDirectory)) {
    try {
      fs.mkdirSync(pagesDirectory, { recursive: true });
      console.log(`Created base pages directory: ${pagesDirectory}`);
    } catch (mkdirError) {
      console.error(`Error creating base pages directory ${pagesDirectory}: ${mkdirError.message}. Cannot generate pages.`);
      return;
    }
  }

  // No deletion logic here as per previous requirements.
  // If you *did* want to clean up nested directories of old generated pages,
  // that would require a more complex traversal and comparison.

  if (itemsToGenerate.length > 0) {
    itemsToGenerate.forEach(generatePage);
  } else {
    console.warn('No valid items found in source data to generate new pages. Existing pages will be maintained.');
  }

  console.log('Code generation complete.');
}

module.exports = {
  runGeneration,
};