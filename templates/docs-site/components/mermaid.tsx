'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Open to zoom"
        className="group relative my-6 flex w-full cursor-zoom-in justify-center rounded-lg border bg-fd-card p-4 [&_svg]:max-w-full"
      >
        <span dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="absolute right-2 top-2 rounded border bg-fd-background px-2 py-0.5 text-xs text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Click to zoom
        </span>
      </button>
      {open ? <ZoomView svg={svg} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

const MIN = 0.2;
const MAX = 8;

function ZoomView({ svg, onClose }: { svg: string; onClose: () => void }) {
  // Scale and offset move together, so one update never sees the other half-applied
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const fit = useRef(1);

  // cx, cy: the point to keep still, relative to the centre of the stage
  const zoomAt = useCallback((factor: number, cx = 0, cy = 0) => {
    setView((v) => {
      const s = Math.min(MAX, Math.max(MIN, v.s * factor));
      const k = s / v.s;
      return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, []);

  const reset = useCallback(() => setView({ s: fit.current, x: 0, y: 0 }), []);

  // Mermaid draws at width 100% of its box, which here has no width. Give the
  // diagram its natural size, then scale it to fill the screen when it opens.
  useEffect(() => {
    const el = stage.current;
    const svgEl = content.current?.querySelector('svg');
    if (!el || !svgEl) return;
    const box = svgEl.viewBox.baseVal;
    const w = box && box.width ? box.width : svgEl.getBoundingClientRect().width;
    const h = box && box.height ? box.height : svgEl.getBoundingClientRect().height;
    svgEl.style.width = `${w}px`;
    svgEl.style.height = `${h}px`;
    svgEl.style.maxWidth = 'none';
    const r = el.getBoundingClientRect();
    fit.current = Math.min(MAX, Math.max(MIN, Math.min((r.width * 0.9) / w, (r.height * 0.9) / h)));
    setView({ s: fit.current, x: 0, y: 0 });
  }, [svg]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') zoomAt(1.25);
      if (e.key === '-') zoomAt(0.8);
      if (e.key === '0') reset();
    };
    window.addEventListener('keydown', onKey);
    const body = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = body;
    };
  }, [onClose, zoomAt, reset]);

  // A non-passive listener, so the wheel zooms the diagram instead of scrolling the page
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.1 : 0.9, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Diagram, zoomable"
      className="fixed inset-0 z-50 flex flex-col bg-fd-background"
    >
      <div className="flex items-center gap-2 border-b px-4 py-2 text-sm">
        <button type="button" className="rounded border px-2.5 py-1" onClick={() => zoomAt(0.8)} aria-label="Zoom out">
          −
        </button>
        <span className="w-14 text-center tabular-nums">{Math.round(view.s * 100)}%</span>
        <button type="button" className="rounded border px-2.5 py-1" onClick={() => zoomAt(1.25)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="rounded border px-2.5 py-1" onClick={reset}>
          Reset
        </button>
        <span className="ml-2 text-fd-muted-foreground">Scroll to zoom · drag to move · Esc to close</span>
        <button type="button" className="ml-auto rounded border px-2.5 py-1" onClick={onClose}>
          Close
        </button>
      </div>
      <div
        ref={stage}
        className="relative flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, px: view.x, py: view.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d) setView((v) => ({ ...v, x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onDoubleClick={() => zoomAt(1.5)}
      >
        <div
          ref={content}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
