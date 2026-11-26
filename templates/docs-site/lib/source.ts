import path from 'node:path';
import { localMd } from '@fumadocs/local-md';
import { loader } from 'fumadocs-core/source';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

// The docs live in the project, not in this site. bin/docs-site sets the path.
const docsDir = path.resolve(/* turbopackIgnore: true */ process.env.BLOOP_DOCS_DIR ?? 'content/docs');

// A fresh source on every request, so an edit to a page shows on the next reload.
// This is a preview. Reading the files each time is the point, not a cost to cut.
export async function getSource() {
  const md = localMd({
    dir: docsDir,
    mdxOptions: { remarkPlugins: [remarkMdxMermaid] },
  });
  return loader({ baseUrl: '/docs', source: await md.staticSource() });
}
