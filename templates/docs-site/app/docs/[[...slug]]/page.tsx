import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { getSource } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';

export const dynamic = 'force-dynamic';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const source = await getSource();
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const { render } = await page.data.load();
  const { body, toc } = await render(getMDXComponents());

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  );
}
