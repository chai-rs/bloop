# <project name>

<!-- bloop:managed architecture -->
<!-- init writes this file from the interview. Never leave a placeholder behind -->

## Business

<Who this system creates value for, and how. One paragraph>

## Scope

**v1 does**

- <item>

**v1 does not**

- <item. At least three. An edge you did not write down is an edge someone will push on later>

## Dataflow

<Where things come in, what they pass through, where they go. Write it as a sequence, not a picture>

1. <source> sends <what> over <channel>
2. <module> does <what> and writes to <where>
3. <destination> reads <what> and uses it for <what>

## Modules

| module | owns which data | talks to |
| --- | --- | --- |
| <name> | <data> | <other module> |

## Functional requirements

- FR-1 <what the system must be able to do>

## Non-functional requirements

| concern | number | how it is checked |
| --- | --- | --- |
| latency p95 | <ms> | <how it is measured> |
| concurrent users | <count> | <how it is measured> |
| RPO / RTO | <time> | <how it is rehearsed> |
| data regulation | <PDPA, GDPR, none> | <how it is checked> |

A number with no way to check it is a hope, not a requirement.

## Tech stack

| layer | chosen | why |
| --- | --- | --- |
| <language> | <choice> | <reason> |

## Codebase shape

```
src/
  domain/        business rules only, imports nothing from outside
  application/   use cases that compose the domain
  port/          interfaces the application declares it needs
  adapter/       the real thing that talks to db, http, queue, implementing the ports
```

**Allowed import direction** `adapter` → `port` → `application` → `domain`, never backwards. `.dependency-cruiser.cjs` enforces it.

**Why this shape** <If this is the default, say why it fits this project. If it is not the default, say what it had to bend around>

<!-- bloop:end architecture -->
