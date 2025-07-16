import { setupGenerator } from './generator';
import { setupWatcher } from './watcher';
import { GeneratorOptions } from './types';

/**
 * Sets up the Next.js page generator with optional file watching
 * @param options Configuration options
 */
export function setupPageGenerator(options: GeneratorOptions) {
  const generator = setupGenerator(options);
  
  // Generate pages immediately
  generator.generate();
  
  // Setup watcher if enabled
  if (options.watch !== false) {
    return setupWatcher({
      ...options,
      generator
    });
  }
  
  return generator;
}

// Export types and individual components for advanced usage
export * from './types';
export { setupGenerator } from './generator';
export { setupWatcher } from './watcher';
