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
 * Handles dynamic route parameters in Next.js format (e.g., [id] -> Id)
 * E.g., 'blog/2023/my-post' -> 'Blog2023MyPost'
 * E.g., 'products/[id]' -> 'ProductsId'
 */
export function createComponentName(filePath: string): string {
  const name = filePath.replace(/\.js$/, '').replace(/\\/g, '/');
  
  return name.split('/') 
    .map(segment => {
      // Handle Next.js dynamic route parameters: [id] -> Id, [slug] -> Slug
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const paramName = segment.slice(1, -1); // Remove the brackets
        return paramName.charAt(0).toUpperCase() + paramName.slice(1);
      }
      
      // Handle catch-all routes: [...slug] -> SlugList
      if (segment.startsWith('[...') && segment.endsWith(']')) {
        const paramName = segment.slice(4, -1); // Remove [... and ]
        return paramName.charAt(0).toUpperCase() + paramName.slice(1) + 'List';
      }
      
      // Handle optional catch-all routes: [[...slug]] -> OptionalSlugList
      if (segment.startsWith('[[...') && segment.endsWith(']]')) {
        const paramName = segment.slice(5, -2); // Remove [[... and ]]
        return 'Optional' + paramName.charAt(0).toUpperCase() + paramName.slice(1) + 'List';
      }
      
      // Normal path segments
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join('');
}

/**
 * Creates a debounced version of a function that delays execution until
 * after wait milliseconds have elapsed since the last time it was called
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to wait before invoking the function
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
