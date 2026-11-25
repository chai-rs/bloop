# <system name>

We do not own this system and we cannot change it. This file records what we depend on, and how we stay alive when it does not behave.

## Owner

<Which team or company maintains it, how to contact them, and where we report problems>

## What we use

| endpoint or topic | what we use it for | how often we call it |
| --- | --- | --- |
| `POST /v3/<...>` | <...> | <...> |

If you have a copy of their spec, put it next to this file and say here which version it is and when it was pulled.

## What we cannot rely on

Write checkable statements, not feelings.

- <e.g. a field longer than the limit is silently truncated, with no error>
- <e.g. how long a pending status can stay pending>

## What we do when it is down

- **retry** <how many times, how far apart, and whether this operation is idempotent>
- **what the user sees** <the message or behaviour a person hits>
- **where our data is left** <what is stranded, and who cleans it up>

## How we find out they changed something

<Is there a webhook? Do we have to subscribe? Or do we only find out when it breaks?>
