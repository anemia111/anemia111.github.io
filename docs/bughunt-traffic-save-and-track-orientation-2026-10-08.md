# Traffic, checkpoint and map corrections — 2026-10-08

This batch follows the user's bug hunt, report of persistent GT/WEC trains,
and request to make every home straight horizontal on screen. No settings,
FREE or dashboard layout redesign is included.

## Reproduced defects

- Expansion passing decisions used current speed difference. Matching a
  slower car's speed removed the reason to move out and pass. Free-running
  speed capability and power/mass acceleration now also inform the attempt.
  Identical cars accelerating together do not initiate a pass on that basis.
  A passing car avoids choosing an occupied side, while slower-class traffic
  holds its line rather than making an abrupt blue-flag lane change. All
  three yellow/FCY/SC cases retain the no-passing distance constraint.
- F1 checkpoint validation rejected positive average charge and discharge
  power within the same saved interval. The integrator can transition between
  recovery and deployment during its internal substeps, producing two positive
  averages without simultaneous physical charging/discharging. Validation now
  checks consistent bus, mechanical and stored power as well as the existing
  energy balance, allocation and finite/range constraints.
- Pit energy updates stopped super-clipping power but retained its prior
  active episode. This could show stale activity and invalidate a checkpoint.
  Pit updates now clear the episode's current intensity/power/start/duration
  while keeping the lap recovery energy ledger.

F1 failures reproduced at 320.0 s (mixed averaged power) and 321.0 s (pit
episode) with seed `sc-release-lap-timing`, 3 cars, Albert Park, a forced
two-lap SC formation, then actual 50 ms integration. The final test saves and
restores every 0.5 s for 120 s in F1 and SF, including the original failures.

## Display orientation

RaceScene uses a separate presentation curve, rigidly rotated around the
vertical axis so its control-line tangent points horizontally left-to-right.
All road, car, pit, sector, flag and observed-progress placements use that
curve. Source centerlines, distance/progress, geodata projection and physical
course geometry are untouched. The overview camera fits the rotated bounds;
the orbit distance cap now accommodates the overview fit instead of clipping
wide rotated courses at the previous fixed distance of 58 display units.
The near-vertical Y-up lookAt also rolled unpredictably with tiny horizontal
interpolation errors, leaving paused views skewed and clipped. Overview now
uses an explicit downward orientation with screen X fixed to world X.
The overview itself accepts wheel zoom, left-drag rotation and right-drag
pan. The existing overview button or a double-click resets to the horizontal
full-course view. A focused canvas also accepts +/−, arrow rotation and Home
reset. The camera stops automatically recentering after an interaction, while
chase mode continues to follow the selected car. Manual orbit remains
available. Tests cover every native F1/SF selectable
track and every expansion course, verifying horizontal tangent, equal curve
length, identical distances to sector marks and no source mutation.

## Verification and limits

Related regression: 16 files / 167 tests, including GT/WEC traffic on all
their available real courses, a matched-speed three-car slower-class train,
equal-performance cars and caution no-passing. Build and lint pass. Normal
publish performs all five browser playtests. An additional browser script
captures the overview for all six categories for visual inspection.
It also verifies keyboard zoom/rotation, wheel zoom, drag rotation and the
overview reset button in every category by comparing rendered canvas frames.

The artificial rectangle isolates the zero-speed-difference traffic trigger;
real-course tests check that the faster class clears the three cars within
180 simulated seconds. These tests do not establish measured race-pace or
an exact pass time on every corner. Tight same-class racing can still form
queues; the fix does not give every following car a guaranteed pass.

WEC traffic behavior reference: the Le Mans race director briefing instructs
slower cars to remain predictable on their racing line and the faster car to
find a way past. This informs behavior, not a claim of measured calibration:
https://fiawec.alkamelsystems.com/Results_NoticeBoard/12_2024/04_24%20Hours%20of%20Le%20Mans/036_Doc%2036%20-%20BRIEFING%20NOTES.pdf
