import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getSource } from '@/lib/source';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: ReactNode }) {
  const source = await getSource();
  return (
    <DocsLayout tree={source.getPageTree()} nav={{ title: process.env.BLOOP_DOCS_TITLE ?? 'Docs' }}>
      {children}
    </DocsLayout>
  );
}
