/* bloop:managed boundary-rules */
/** Enforces the hexagonal import direction: adapter -> port -> application -> domain */
module.exports = {
  forbidden: [
    {
      name: "domain-depends-on-nothing",
      comment: "domain is business rules only. If it knows about a db or http, it is no longer domain.",
      severity: "error",
      from: { path: "^src/domain" },
      to: { pathNot: "^src/domain|^(node:)?[a-z]" },
    },
    {
      name: "application-knows-no-adapter",
      comment: "application acts through ports only, otherwise swapping the db means editing every use case.",
      severity: "error",
      from: { path: "^src/application" },
      to: { path: "^src/adapter" },
    },
    {
      name: "port-knows-no-adapter",
      comment: "a port declares what is needed, it does not know who satisfies it.",
      severity: "error",
      from: { path: "^src/port" },
      to: { path: "^src/adapter|^src/application" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphan",
      comment: "a file nobody imports is a file you can delete.",
      severity: "warn",
      from: { orphan: true, pathNot: "\\.(test|spec|config)\\.(ts|js)$" },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
  },
};
/* bloop:end boundary-rules */
