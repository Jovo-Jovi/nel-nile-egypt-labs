# scripts/

Evidence tooling. Scripts here reproduce a measurement recorded in `docs/research/`. They are not application code, are not imported by anything under `src/`, and do not ship. Sanctioned at the P02-X02 verdict, 27 August 2026, after two scripts landed unquoted at P02-X02 and were kept rather than deleted because a committed method is reproducible and a prose method is not.

`scripts/guard/` is build tooling, not evidence tooling. Scripts there gate a commit and are wired into `package.json`. Sanctioned at P01-T03-R-M1 by CF-58's closure. The distinction: evidence tooling reproduces a measurement recorded in `docs/research/`; build tooling fails a build. Neither is application code and neither ships.
