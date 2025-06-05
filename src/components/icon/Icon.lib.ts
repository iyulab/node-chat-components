const images = import.meta.glob('../../assets/images/*.svg', { 
  eager: true,
  query: '?raw'
});

export const lib: Map<string, string> = new Map(
  Object.entries(images).map(([path, module]) => {
    const fileName = path.split('/').pop()?.replace('.svg', '') || '';
    return [fileName, (module as any).default];
  })
);