# 2026 category expansion — implementation status

This work is **not a completed four-series simulator expansion**. F1 and SUPER
FORMULA remain the only executable packages. The Data view now exposes the
source-backed expansion directory and identifies missing simulation support.

## Implemented

- Compact lapped trains prepare one passing corridor, using the actual lapping
  car rather than the nearest following backmarker. Preparatory courtesy can
  propagate across gaps of at most 0.8 reference seconds, up to six reference
  seconds ahead of the leader. These are SIM policy values, not regulations.
  Formal blue flags retain their existing 1.5-second threshold. Yellow,
  neutralisation, emergency handling and physical occupancy still take priority.
- A production-engine regression places a leader behind three backmarkers and
  verifies that all three are cleared within 15 seconds without stopping or
  jumping forward. This is one seeded straight-line scenario, not a claim that
  every train can safely be passed in one move at every circuit.
- Official identity snapshots: KYOJO 20 entries; SUPER GT GT500 14 and GT300 29;
  INDYCAR 33 driver-directory records; WEC Imola v1 17 Hypercar and 18 LMGT3
  entries. WEC preserves whole crews, leading-zero car numbers, and the driver
  with no printed nationality. A directory record is not a simultaneous grid.
- All five KYOJO meetings, eight SUPER GT events, eighteen INDYCAR events, and
  eight amended WEC events are listed with source references. The SUPER GT
  Round 3 Motegi replacement and WEC Barcelona/Monza replacements supersede
  old calendars. Race-weekend chronology is distinct from official round number.
- Reviewed bilingual identities link existing SF people to their SUPER GT
  entries and existing reserve people to WEC/INDYCAR. No fuzzy identity merge.
- Cross-category clean-pace calibration code and numerical regression tests.
  No production observations or additional driver ratings are fabricated.

## Source import

`scripts/import-expansion-catalog.py --as-of 2026-10-07` requires Python with
`lxml` and `pypdf`. It fetches public primary sources, checks directory counts
and required identity columns, then writes `src/data/expansionCatalog2026.json`.
Every source includes its URL, verification date, scope and SHA-256 of fetched
bytes. HTML hashes can change with dynamic site content even if identity facts
do not. Review diffs before accepting a refreshed snapshot. It does not run
at application startup or send source requests from clients.

WEC source: Imola provisional list v1, issued 7 April 2026, **not** the final
season-wide roster. Additional Le Mans entries, substitute drivers and later
event changes remain to be collected. INDYCAR car models are unavailable in
the imported driver directory and remain null, rather than inferred from logos.
Listed courses are identities and calendar records, not newly generated layouts.

## Ability model requested by the user

`src/series/crossCategoryRatings.ts` implements `shared-driver-clean-pace-v1`.
There is one driver node per reviewed person, shared across categories, with
separate qualifying-pace and race-pace graphs. There is no category-wide ability
deduction or random skill-axis variation.

1. Ingest driver-attributable clean lap aggregates with official timing sources.
   A comparison group must match circuit/layout, session phase, weather, tyre
   and a defensible fuel window. Exclude out/in laps, traffic/neutralisation,
   deleted laps and incident laps upstream. Input labels are an audited contract;
   the numerical solver cannot discover a falsely labelled weather/fuel group.
2. Compare the same vehicle-performance specification. Across different
   specifications, both observations must carry explicit, source-backed machine
   corrections. Being on the same team alone does not establish equivalence.
   Endurance car classification is never individual pace evidence. Driver changes
   require actual stint attribution. Do not compare combined GT qualifying sums
   as if each crew member set that sum individually.
3. Each matched pair contributes the clean-time log ratio, in percentage units,
   corrected for the machine: `100 ln(tB/tA) + correctionA - correctionB`.
   Solve the weighted graph Laplacian for relative driver pace. A shared driver
   links otherwise separate category graphs without needing equal absolute lap
   durations. Per-session pair expansion is normalised and correlated lap counts
   are capped at five for weighting. This cap is a modelling assumption.
4. Translate relative pace onto the application's 0–100 scale using at least
   two distinct, supplied scale anchors. Fit the conversion from anchor pace
   differences, instead of inventing a fixed points-per-second coefficient.
   Existing authored ratings may define this scale but are not official ability
   measurements. Existing CSV/user ratings are not overwritten automatically.
5. Return null for disconnected, insufficient or contradictory evidence. Expose
   anchors, comparison counts, categories, source IDs and residual discrepancy.
   Confidence labels are heuristic (`low`/`medium`), not confidence intervals.
   Exactly two anchors and single bridging drivers are fragile; hold out events
   and anchor drivers before using estimates to change a production field.

This estimates two **pace** axes. Tyre management, starts, wet skill, racecraft,
consistency, adaptability and potential cannot be inferred by copying pace into
every axis. They require their own observations and validation. Career experience
and changing ability over time also require season-window controls upstream.

The current expansion directory contains identities, not qualifying/clean-stint
observations, so its derived-rating list is intentionally empty. Shared-driver
badges show identity links, not completed ability calculations. Collecting and
auditing timing inputs, calculating actual ratings and integrating approved
results into executable driver packages remain open work.

## Required before new series can execute faithfully

- KYOJO: official KC-MG01 technical/tyre inputs, qualifying and sprint-to-final
  grid rules, equal-car model, points and measured pace validation.
- SUPER GT: per-car crews and driver changes, class-specific classification,
  GT500/GT300 traffic, event distances, refuelling/service rules, tyre suppliers,
  success weight/fuel-flow restrictions and event-specific BoP.
- WEC: timed endurance completion, driver stint attribution and rest/drive-time
  limits, Hypercar/LMGT3 class rules, car-specific hybrid deployment, BoP, refuelling,
  FCY/SC procedures, night/temperature evolution and Le Mans event exceptions.
- INDYCAR: reviewed chassis/engine inputs, road/street/oval vehicle configurations,
  hybrid and push-to-pass rules, refuelling, tyre compounds, rolling starts,
  oval/Indianapolis qualifying and caution/lapped-car rules.
- Missing course layouts: sourced/geodata-derived geometry, length validation,
  pit entry/exit, timing lines, banking/width availability and track-specific
  calibration. No F1 circuit is substituted under a different course's name.
- Capacity and persistence: mixed-class car/crew identity must replace the current
  one-driver/one-car assumptions, including worker messages, checkpoints, results,
  championship scoring, race controls and maps. Free Mode's 40-car cap is below
  a full SUPER GT field and a Le Mans field and requires a tested change.

## Validation

Targeted tests cover train identity/clearance, actual engine traversal, source
directory counts and amended calendars, shared-driver calibration, machine
correction, disconnected graphs, phase/condition isolation and invalid inputs.
The repository's full publish gate must also pass before a deployment is claimed.
