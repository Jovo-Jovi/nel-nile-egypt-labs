// Build tooling, not evidence tooling. `scripts/` root reproduces measurements
// recorded in docs/research/; `scripts/guard/` gates a commit. CF-58 draws that line.
//
// PHASES.md §3a: checklist boxes are derived from SESSION_CONTEXT.md, never
// hand-maintained. This guard makes that rule executable.
//
//   R1  A checked `- [x] **<id>**` task box whose id has no done-step row.
//   R2  A checked task box whose Verdict cell is `pushed — verdict at push`
//       or empty.
//   R3  An unchecked `- [ ] **<id>**` task box whose Verdict cell records a
//       reviewer verdict (filled, and not the placeholder). The box should
//       have been checked.
//   R4  A checked gate box `- [x] **G<n>**` whose phase-map Gate cell does
//       not read `PASSED`. Gate ids are `G` plus digits and nothing else, so
//       `G3-R` is a task id and is evaluated by R1–R3.
//   R5  A done-step row whose pipe count is not 5 (an unescaped `|` in a
//       cell of the four-column table). Report-only until CF-100's seventeen
//       rows are escaped; a later P05 task turns this rule blocking.
//
// Done-step rows are parsed from the right: Date is the last cell, Verdict
// the one before it. Task-cell pipes therefore cannot steal the verdict.
// Scaffold rows whose Step cell is `—` are not task rows and are excluded
// from R5 so the named seventeen remain the set this rule reports.
//
// Usage:
//   node scripts/guard/phases.mjs              scan docs/PHASES.md and
//                                              docs/SESSION_CONTEXT.md

import { readFileSync } from "node:fs";

const PHASES_PATH = "docs/PHASES.md";
const SESSION_PATH = "docs/SESSION_CONTEXT.md";
const PLACEHOLDER_VERDICT = "pushed — verdict at push";
const CHECKBOX_RE = /^- \[([ x])\] \*\*(.+?)\*\*/;
const GATE_ID_RE = /^G(\d+)$/;
const TASK_STEP_SKIP = "—";

function readUtf8(path) {
  return readFileSync(path, "utf8");
}

function splitLines(source) {
  return source.split(/\n/);
}

function sectionBounds(lines, heading) {
  const start = lines.findIndex((line) => line.trimEnd() === heading);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return { start, end };
}

function splitRow(line) {
  const pipeCount = (line.match(/\|/g) || []).length;
  let parts = line.split("|");
  if (parts[0] === "") parts = parts.slice(1);
  if (parts.length > 0 && parts[parts.length - 1].trim() === "") {
    parts = parts.slice(0, -1);
  }
  const cells = parts.map((cell) => cell.trim());
  return { pipeCount, cells };
}

function parseDoneSteps(lines, startLine) {
  const rows = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith("|")) continue;
    if (line.startsWith("| Step") || line.startsWith("|---")) continue;
    const { pipeCount, cells } = splitRow(line);
    if (cells.length < 2) continue;
    const step = cells[0];
    const date = cells[cells.length - 1];
    const verdict = cells[cells.length - 2];
    rows.push({
      step,
      verdict,
      date,
      pipeCount,
      line: startLine + i,
    });
  }
  return rows;
}

function parsePhaseMapGates(lines, startLine) {
  const gates = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith("|")) continue;
    if (line.startsWith("| Order") || line.startsWith("| Phase") || line.startsWith("|---")) {
      continue;
    }
    const { cells } = splitRow(line);
    if (cells.length < 4) continue;
    // From the right: Non-waivable, Gate, Contents…, Phase, Order.
    const nonWaivable = cells[cells.length - 1];
    const gate = cells[cells.length - 2];
    const phase = cells.length >= 5 ? cells[1] : cells[0];
    if (!/^P\d+$/.test(phase)) continue;
    gates.set(phase, { gate, nonWaivable, line: startLine + i });
  }
  return gates;
}

function isGateId(id) {
  return GATE_ID_RE.test(id);
}

function phaseForGateId(id) {
  const hit = GATE_ID_RE.exec(id);
  if (!hit) return null;
  return `P${hit[1].padStart(2, "0")}`;
}

function isReviewerVerdict(verdict) {
  if (verdict === undefined || verdict === null) return false;
  const value = verdict.trim();
  if (value === "") return false;
  if (value === TASK_STEP_SKIP) return false;
  if (value === PLACEHOLDER_VERDICT) return false;
  return true;
}

function parseCheckboxes(lines) {
  const boxes = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const hit = CHECKBOX_RE.exec(line);
    if (!hit) continue;
    boxes.push({
      checked: hit[1] === "x",
      id: hit[2].trim(),
      line: i + 1,
    });
  }
  return boxes;
}

function report(blocking, reports, scannedLabel) {
  if (blocking.length === 0) {
    process.stdout.write(`guard:phases — PASS. ${scannedLabel}\n`);
  } else {
    process.stdout.write(`guard:phases — FAIL. ${scannedLabel}\n`);
    process.stdout.write(`${blocking.length} blocking finding(s).\n\n`);
    for (const finding of blocking) {
      process.stdout.write(`  ${finding.file}:${finding.line}  ${finding.rule}  ${finding.reason}\n`);
    }
    process.stdout.write("\n");
  }

  // R5 is report-only until CF-100's seventeen rows are escaped; a later
  // P05 task turns this rule blocking. Do not weaken the check to make a
  // build pass (P03-T03).
  if (reports.length > 0) {
    process.stdout.write(
      `R5 report-only (CF-100; becomes blocking at P05 once the rows are escaped): ${reports.length} row(s)\n`,
    );
    for (const finding of reports) {
      process.stdout.write(`  ${finding.file}:${finding.line}  ${finding.rule}  ${finding.reason}\n`);
    }
    process.stdout.write("\n");
  }

  return blocking.length > 0 ? 1 : 0;
}

function main() {
  let phasesSource;
  let sessionSource;
  try {
    phasesSource = readUtf8(PHASES_PATH);
    sessionSource = readUtf8(SESSION_PATH);
  } catch (err) {
    process.stdout.write(`guard:phases — FAIL. Could not read ${PHASES_PATH} or ${SESSION_PATH}.\n`);
    process.stdout.write(`  ${err.message}\n`);
    return 1;
  }

  const phasesLines = splitLines(phasesSource);
  const sessionLines = splitLines(sessionSource);

  const doneBounds = sectionBounds(sessionLines, "## Done steps");
  const mapBounds = sectionBounds(sessionLines, "## Phase map");
  if (doneBounds === null || mapBounds === null) {
    process.stdout.write(
      "guard:phases — FAIL. SESSION_CONTEXT.md is missing ## Done steps or ## Phase map.\n",
    );
    return 1;
  }

  const doneRows = parseDoneSteps(
    sessionLines.slice(doneBounds.start, doneBounds.end),
    doneBounds.start + 1,
  );
  const byStep = new Map();
  for (const row of doneRows) {
    byStep.set(row.step, row);
  }
  const phaseGates = parsePhaseMapGates(
    sessionLines.slice(mapBounds.start, mapBounds.end),
    mapBounds.start + 1,
  );

  const boxes = parseCheckboxes(phasesLines);
  const blocking = [];
  const reports = [];

  for (const box of boxes) {
    if (isGateId(box.id)) {
      if (box.checked) {
        const phase = phaseForGateId(box.id);
        const mapped = phase ? phaseGates.get(phase) : undefined;
        const gateCell = mapped?.gate ?? "";
        if (!gateCell.includes("PASSED")) {
          blocking.push({
            file: PHASES_PATH,
            line: box.line,
            rule: "R4",
            reason: `checked gate box **${box.id}** but phase-map Gate cell for ${phase} does not read PASSED (cell: \`${gateCell || "(missing)"}\`)`,
          });
        }
      }
      continue;
    }

    const row = byStep.get(box.id);
    if (box.checked) {
      if (!row) {
        blocking.push({
          file: PHASES_PATH,
          line: box.line,
          rule: "R1",
          reason: `checked box **${box.id}** has no done-step row`,
        });
        continue;
      }
      const verdict = row.verdict ?? "";
      if (verdict === PLACEHOLDER_VERDICT || verdict.trim() === "") {
        blocking.push({
          file: PHASES_PATH,
          line: box.line,
          rule: "R2",
          reason: `checked box **${box.id}** has Verdict \`${verdict || "(empty)"}\``,
        });
      }
      continue;
    }

    if (row && isReviewerVerdict(row.verdict)) {
      blocking.push({
        file: PHASES_PATH,
        line: box.line,
        rule: "R3",
        reason: `unchecked box **${box.id}** has a reviewer verdict (\`${row.verdict}\`); the box should have been checked`,
      });
    }
  }

  for (const row of doneRows) {
    if (row.step === TASK_STEP_SKIP) continue;
    if (row.pipeCount === 5) continue;
    reports.push({
      file: SESSION_PATH,
      line: row.line,
      rule: "R5",
      reason: `${row.step}  pipe count ${row.pipeCount} (expected 5)`,
    });
  }

  return report(blocking, reports, `Read ${PHASES_PATH} and ${SESSION_PATH}.`);
}

process.exit(main());
