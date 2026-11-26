'use client';

import { useEffect, useId, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { default: mermaid } = await import('mermaid');
      const dark = document.documentElement.classList.contains('dark');
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral' });
      try {
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) return <pre>{`mermaid: ${error}\n\n${chart}`}</pre>;
  if (!svg) return <pre>{chart}</pre>;
  return <div className="my-6 flex justify-center [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
