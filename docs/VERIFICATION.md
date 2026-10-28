# Snapshot verification

Checks recorded in the isolated source copy on 2026-10-28. These results are not a production certification.

| Directory | Command | Result |
| --- | --- | --- |
| `.` | `npm ci --ignore-scripts --no-audit --no-fund` | Passed |
| `.` | `npm run lint` | Did not pass (exit 1) |
| `.` | `npm run build` | Passed |

Python application files passed syntax parsing. This does not execute imports, launch the desktop UI, contact a portal or validate an external integration.

The production build passed, but existing ESLint findings remain (including unused values and React effect rules). A passing build does not imply a clean lint result.

## Publication boundaries

- Operational sources remained read-only; only isolated copies were prepared.
- No corporate service, real-record import, live notification or production database was invoked.
- No deployment command, deploy workflow or new hosting integration is part of this update. Included Vercel configurations disable Git-driven deployments.
- New source imports exclude local environments, databases, generated outputs and operational documents.
- Existing Git history is preserved. Historical public names or assets may remain in old commits; current snapshots use neutral public presentation.

## Production npm dependency audit — enterprise-indicators-portal

`npm audit --omit=dev --json` reported 0 critical, 0 high, 0 moderate, 0 low findings in the installed dependency tree on 2026-10-28. Counts include transitive packages and do not establish exploitability in this application.

## Synthetic local function checks

Three Node tests passed for method/input rejection, successful lookup without leaking the credential list, wrong-password rejection and a generic error when local configuration is unavailable. The tests use only temporary fictitious configuration. They do not establish a trusted session, report authorization or production-ready authentication.
