type LogLevel = 'info' | 'warn' | 'error';

/**
 * Utility for logging messages based on verbose setting
 */
export function log(level: LogLevel, message: string, verbose = true): void {
  if (!verbose) return;
  
  switch (level) {
    case 'info':
      console.log(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    case 'error':
      console.error(message);
      break;
  }
}

/**
 * Creates a component name from a file path
 * E.g., 'blog/2023/my-post' -> 'Blog2023MyPost'
 */
export function createComponentName(filePath: string): string {
  const name = filePath.replace(/\.js$/, '').replace(/\\/g, '/');
  return name.split('/') 
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(''); 
}
