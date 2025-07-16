import chokidar from 'chokidar';
import path from 'path';
import { WatcherOptions } from './types';
import { log, debounce } from './utils';

export function setupWatcher(options: WatcherOptions) {
  const sourceFilePath = path.resolve(process.cwd(), options.sourceFile || 'data/sourceData.json');
  
  log('info', `Watching for changes in: ${sourceFilePath}`, options.verbose);
  
  // Create the watcher without explicit typing to avoid type errors with chokidar
  const watcher = chokidar.watch(sourceFilePath, { 
    ignored: /(^|[\/\\])\../, 
    persistent: true 
  }) as any;
  
  // Create debounced version of generate function (default 300ms debounce time)
  const debounceTime = typeof options.debounceTime === 'number' ? options.debounceTime : 300;
  const debouncedGenerate = debounce(() => {
    log('info', `Debounced generation triggered after ${debounceTime}ms`, options.verbose);
    options.generator.generate();
  }, debounceTime);
  
  // Add event handlers individually
  watcher.on('add', (filePath: string) => {
    log('info', `File ${filePath} has been added`, options.verbose);
    debouncedGenerate();
  });
  
  watcher.on('change', (filePath: string) => {
    log('info', `File ${filePath} has been changed`, options.verbose);
    debouncedGenerate();
  });
  
  watcher.on('unlink', (filePath: string) => {
    log('info', `File ${filePath} has been removed`, options.verbose);
    debouncedGenerate();
  });
  
  watcher.on('error', (error: Error) => {
    log('error', `Watcher error: ${error.message}`, options.verbose);
  });
  
  log('info', `Watcher started with ${debounceTime}ms debounce. Press Ctrl+C to stop.`, options.verbose);
  
  return {
    stop: () => watcher.close(),
    watcher,
    generator: options.generator
  };
}
