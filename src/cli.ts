#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { setupPageGenerator } from './index';
import { GeneratorOptions } from './types';

// Possible configuration file names
const CONFIG_FILE_NAMES = [
  'next-page-generator.config.js',
  'next-page-generator.config.json',
  '.next-page-generatorrc',
  '.next-page-generatorrc.json',
  '.next-page-generatorrc.js'
];

/**
 * Find and load the configuration file
 */
function loadConfig(): GeneratorOptions | null {
  const cwd = process.cwd();
  
  // Check each possible config file
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = path.join(cwd, fileName);
    
    if (fs.existsSync(filePath)) {
      try {
        // For .js files, require them directly
        if (fileName.endsWith('.js')) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const config = require(filePath);
          return config.default || config;
        } 
        // For JSON files, read and parse
        else {
          const content = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(content);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error loading configuration from ${filePath}: ${errorMsg}`);
      }
    }
  }
  
  return null;
}

/**
 * Main CLI entry point
 */
function main() {
  // Check for CLI arguments
  const args = process.argv.slice(2);
  const showHelp = args.includes('--help') || args.includes('-h');
  
  if (showHelp) {
    console.log(`
next-page-generator

Usage: npx next-page-generator [options]

Options:
  --help, -h      Show this help message
  --watch, -w     Watch for changes in source files (default: true)
  --verbose, -v   Show detailed logs (default: true)
  --no-watch      Disable file watching
  --quiet, -q     Suppress detailed logs

Configuration:
  Create a next-page-generator.config.js or .next-page-generatorrc.json file
  in your project root with your generator settings.
    `);
    return;
  }
  
  // Parse CLI options
  const watch = !args.includes('--no-watch');
  const verbose = !args.includes('--quiet') && !args.includes('-q');
  
  // Load config
  const config = loadConfig();
  
  if (!config) {
    console.error(`
No configuration file found. Please create one of:
- next-page-generator.config.js
- next-page-generator.config.json
- .next-page-generatorrc
- .next-page-generatorrc.json
- .next-page-generatorrc.js
in your project root directory.

For an example configuration, run with --help.
    `);
    process.exit(1);
  }
  
  // Override config with CLI options
  const finalConfig: GeneratorOptions = {
    ...config,
    watch: args.includes('--watch') || args.includes('-w') ? true : (args.includes('--no-watch') ? false : config.watch),
    verbose: args.includes('--verbose') || args.includes('-v') ? true : (args.includes('--quiet') || args.includes('-q') ? false : config.verbose)
  };
  
  // Set up page generator
  console.log('Starting next-page-generator with config:', finalConfig);
  setupPageGenerator(finalConfig);
  
  // Keep process running if watching
  if (finalConfig.watch !== false) {
    console.log('Watching for changes. Press Ctrl+C to stop.');
  }
}

// Run the CLI
main();
