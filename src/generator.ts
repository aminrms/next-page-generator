import fs from 'fs';
import path from 'path';
import { GeneratorOptions, Generator, PageItem } from './types';
import { createComponentName, log } from './utils';

const DEFAULT_OPTIONS: Partial<GeneratorOptions> = {
  sourceFile: 'data/sourceData.json',
  outputDir: 'pages',
  pathProperty: 'path',
  fileExtension: '.js',
  verbose: true,
};

export function setupGenerator(userOptions: GeneratorOptions): Generator {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  
  // Resolve paths relative to cwd
  const sourceDataPath = path.resolve(process.cwd(), options.sourceFile!);
  const pagesDirectory = path.resolve(process.cwd(), options.outputDir!);
  
  function generatePage(item: PageItem) {
    // Get path from item using pathProperty or fallback to id
    const itemPath = item[options.pathProperty!] || item.id;
    
    if (!itemPath || typeof itemPath !== 'string' || typeof item.title !== 'string' || typeof item.content !== 'string') {
      log('error', `Skipping generation for malformed item. Item must have ${options.pathProperty} or id, title, and content properties.`, options.verbose);
      return;
    }
    
    // Normalize path
    const pageRelativePath = itemPath.replace(/\\/g, '/');
    const componentName = createComponentName(pageRelativePath);
    
    // Generate content using custom template or default
    const trimmedNewContent = options.template 
      ? options.template(item).trim()
      : generateDefaultTemplate(componentName, item).trim();
    
    // Determine file path
    const targetFilePath = path.join(pagesDirectory, `${pageRelativePath}${options.fileExtension}`);
    
    // Create directories if needed
    const parentDir = path.dirname(targetFilePath);
    if (!fs.existsSync(parentDir)) {
      try {
        fs.mkdirSync(parentDir, { recursive: true });
        log('info', `Created directory: ${parentDir}`, options.verbose);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        log('error', `Error creating directory ${parentDir}: ${errorMsg}. Skipping page generation.`, options.verbose);
        return;
      }
    }
    
    // Check if file exists and compare content
    if (fs.existsSync(targetFilePath)) {
      try {
        const existingContent = fs.readFileSync(targetFilePath, 'utf8').trim();
        if (existingContent === trimmedNewContent) {
          log('info', `Skipping generation for ${targetFilePath}: Content is identical.`, options.verbose);
          return;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        log('error', `Error reading existing file ${targetFilePath}: ${errorMsg}. Attempting to overwrite.`, options.verbose);
      }
    }
    
    // Write the file
    try {
      fs.writeFileSync(targetFilePath, trimmedNewContent);
      log('info', `Generated/Updated page: ${targetFilePath}`, options.verbose);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log('error', `Error writing file ${targetFilePath}: ${errorMsg}.`, options.verbose);
    }
  }
  
  function generate() {
    log('info', 'Running page generation...', options.verbose);
    
    let itemsToGenerate: PageItem[] = [];
    
    try {
      if (!fs.existsSync(sourceDataPath)) {
        log('warn', `Source data file not found at ${sourceDataPath}. No pages will be generated.`, options.verbose);
      } else {
        const rawData = fs.readFileSync(sourceDataPath, 'utf8');
        const parsedData = JSON.parse(rawData);
        
        if (parsedData && Array.isArray(parsedData.items)) {
          itemsToGenerate = parsedData.items;
        } else {
          log('error', `${sourceDataPath} does not contain a valid 'items' array.`, options.verbose);
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      log('error', `Critical Error reading or parsing ${sourceDataPath}: ${errorMsg}`, options.verbose);
    }
    
    // Ensure output directory exists
    if (!fs.existsSync(pagesDirectory)) {
      try {
        fs.mkdirSync(pagesDirectory, { recursive: true });
        log('info', `Created base pages directory: ${pagesDirectory}`, options.verbose);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        log('error', `Error creating base pages directory ${pagesDirectory}: ${errorMsg}. Cannot generate pages.`, options.verbose);
        return;
      }
    }
    
    // Generate pages
    if (itemsToGenerate.length > 0) {
      itemsToGenerate.forEach(generatePage);
    } else {
      log('warn', 'No valid items found in source data to generate new pages.', options.verbose);
    }
    
    log('info', 'Page generation complete.', options.verbose);
  }
  
  return {
    generate,
    generatePage,
  };
}

function generateDefaultTemplate(componentName: string, item: PageItem): string {
  return `
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
}
