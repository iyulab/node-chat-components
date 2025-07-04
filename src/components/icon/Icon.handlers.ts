/**
 * Icon library for the application.
 * This library maps icon names to their SVG content.
 * It uses dynamic imports to load SVG files from the assets/icons directory.
 */
export const iconLibrary = new Map<string, string>(
  Object.entries(import.meta.glob('../../assets/icons/*.svg', { 
    eager: true,
    query: '?raw'
  })).map(([path, module]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || '';
    return [name, (module as any).default] as [string, string];
  }).filter(([name]) => name !== '')
);
