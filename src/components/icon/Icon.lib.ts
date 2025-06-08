const images = import.meta.glob('../../assets/images/*.svg', { 
  eager: true,
  query: '?raw'
});

export const lib: Map<string, string> = new Map(
  Object.entries(images)
    .map(([path, module]) => {
      // 경로에서 파일명만 추출하고 .svg 확장자를 제거
      const name = path.split('/').pop()?.replace('.svg', '') || '';
      return [name, (module as any).default] as [string, string];
    })
    // name이 빈 문자열인 항목은 제외
    .filter(([name]) => name !== '')
);
