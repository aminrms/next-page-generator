import { ReactNode } from 'react';

export interface PageItem {
  path?: string;
  id?: string;
  title: string;
  content: string;
  [key: string]: any;
}

export interface PageData {
  items: PageItem[];
  [key: string]: any;
}

export interface GeneratorOptions {
  /**
   * Path to the source data file (JSON)
   * @default 'data/sourceData.json'
   */
  sourceFile?: string;
  
  /**
   * Directory where pages will be generated
   * @default 'pages'
   */
  outputDir?: string;
  
  /**
   * Whether to watch for changes to the source file
   * @default true
   */
  watch?: boolean;
  
  /**
   * Property name to use as path (fallback to id if not found)
   * @default 'path'
   */
  pathProperty?: string;
  
  /**
   * File extension to use for generated pages
   * @default '.js'
   */
  fileExtension?: '.js' | '.jsx' | '.ts' | '.tsx';
  
  /**
   * Custom page template function
   */
  template?: (item: PageItem) => string;
  
  /**
   * Whether to log messages
   * @default true
   */
  verbose?: boolean;
}

export interface Generator {
  generate: () => void;
  generatePage: (item: PageItem) => void;
}

export interface WatcherOptions extends GeneratorOptions {
  generator: Generator;
}
