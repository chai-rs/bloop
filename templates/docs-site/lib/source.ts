import path from 'node:path';
import { localMd } from '@fumadocs/local-md';
import { loader } from 'fumadocs-core/source';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { openapi } from '@/lib/openapi';

// The docs live in the project, not in this site. bin/docs-site sets the path.
const docsDir = path.resolve(/* turbopackIgnore: true */ process.env.BLOOP_DOCS_DIR ?? 'content/docs');

// A fresh source on every request, so an edit to a page shows on the next reload.
// This is a preview. Reading the files each time is the point, not a cost to cut.
export async function getSource() {
  const md = localMd({
    dir: docsDir,
    mdxOptions: { remarkPlugins: [remarkMdxMermaid] },
  });
  const docs = await md.staticSource();

  if (!openapi) return loader({ baseUrl: '/docs', source: docs });

  // The API reference is generated from the OpenAPI file into /docs/openapi,
  // one folder per tag, with no file written. Put "...openapi" in the root
  // meta.json pages to list the tags in the sidebar.
  return loader(
    { docs, openapi: await openapi.staticSource({ baseDir: 'openapi', groupBy: 'tag', meta: true }) },
    { baseUrl: '/docs', plugins: [openapi.loaderPlugin()] },
  );
}
