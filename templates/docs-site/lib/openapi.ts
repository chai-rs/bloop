import { createOpenAPI } from 'fumadocs-openapi/server';

// bin/docs-site sets this when the project has an OpenAPI file. Without one,
// there is no API reference, and the docs render on their own.
const input = process.env.BLOOP_OPENAPI;

export const openapi = input ? createOpenAPI({ input: [input] }) : null;
