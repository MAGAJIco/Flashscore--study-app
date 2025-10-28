// Explicitly declare only what you need
declare global {
  interface Window {
    fs?: {
      readFile: (path: string, options?: any) => Promise<any>;
    };
    storage?: any;
  }

  const localStorage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
  };

  const document: {
    createElement(tag: string): any;
    // Add only methods you actually use
  };

  const navigator: {
    userAgent: string;
    // Add only properties you use
  };
}

export {};
