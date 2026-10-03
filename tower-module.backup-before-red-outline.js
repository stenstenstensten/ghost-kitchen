// New Ghost Kitchen sketch: same grid structure as sketch.js (4x3 main grid,
// header row, far-right column), but every decorative function stripped out
// — this file draws only bare grid borders plus one new module: a 'tower'
// of 4 chamfered rectangles (black, white, black, white), each OVERLAID on
// the one below, centred on its top edge, with each overlay's width/height
// a random 0.1-0.6x fraction of that instance's own base shape.
//
// Each of the 5 target grid cells gets 4 towers, one per edge (top, bottom,
// left, right) — each anchored flush against its edge of the cell and
// rotated to grow inward, toward the cell's centre.

let cols = 4;
let rows = 3;
let cellW, cellH;
let headerH, gridTop;
let extraColW;

let strokeColour;
let bgColour;

// every tower gets queued here instead of drawn immediately, so that once
// the whole sketch's set of towers is known, exactly 4 of them (chosen at
// random from the total) can be picked out for the colour treatment below
let towerQueue = [];

// grid cells the tower instances sit in
let towerGrids = [2, 4, 5, 6, 7, 8, 10];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  //randomSeed(10); // keep the random chamfers/lean directions stable across resizes

  strokeColour = color(0);
  bgColour = color(255);
}

// ported directly from sketch.js's computeLayout()
function computeLayout() {
  cellH = height / (rows + 0.25);
  headerH = cellH / 4;
  extraColW = headerH; // far-right column: same width as the header row's height
  cellW = (width - extraColW) / cols;
  gridTop = headerH;
}

function draw() {
  computeLayout();
  background(bgColour);

  drawGridStructure();

  towerQueue = [];

  for (let i = 0; i < towerGrids.length; i++) {
    let index = towerGrids[i];
    let row = floor((index - 1) / cols);
    let col = (index - 1) % cols;
    let x = cellW * (col + 0.5);
    let y = gridTop + cellH * (row + 0.5);

    if (index === 2) {
      drawCenterFacingTowers(x, y, cellW, cellH);
      drawEdgeTower(x, y, cellW, cellH, 'top', 0.5);
    } else if (index === 4) {
      drawMiniGridTowers(x, y, cellW, cellH);
    } else {
      for (let side of ['top', 'bottom', 'left', 'right']) {
        drawEdgeTower(x, y, cellW, cellH, side);
      }
    }
  }

  // grid 1: a single module on its own, no edges/rotation, just centred
  let x1 = cellW * 0.5;
  let y1 = gridTop + cellH * 0.5 + cellH * 0.2; // slightly low, so the tower's upward growth has room
  drawTower(x1, y1, cellW * 0.35, cellH * 0.3, 0);

  // grid 1: also add edge-anchored modules on its top and left edges
  // (scaled down to match grid 4's mini-grid modules)
  let y1Centre = gridTop + cellH * 0.5;
  drawEdgeTower(x1, y1Centre, cellW, cellH, 'top', 0.5);
  drawEdgeTower(x1, y1Centre, cellW, cellH, 'left', 0.5);

  // grid 3: top edge
  let x3 = cellW * 2.5;
  let y3 = gridTop + cellH * 0.5;
  drawEdgeTower(x3, y3, cellW, cellH, 'top', 0.5);

  // grid 9: bottom and left edges
  let x9 = cellW * 0.5;
  let y9 = gridTop + cellH * 2.5;
  drawEdgeTower(x9, y9, cellW, cellH, 'bottom', 0.5);
  drawEdgeTower(x9, y9, cellW, cellH, 'left', 0.5);

  // grid 11: bottom edge
  let x11 = cellW * 2.5;
  let y11 = gridTop + cellH * 2.5;
  drawEdgeTower(x11, y11, cellW, cellH, 'bottom', 0.5);

  // grid 12: bottom and right edges
  let x12 = cellW * 3.5;
  let y12 = gridTop + cellH * 2.5;
  drawEdgeTower(x12, y12, cellW, cellH, 'bottom', 0.5);
  drawEdgeTower(x12, y12, cellW, cellH, 'right', 0.5);

  drawModuleTabs();

  flushTowerQueue();

  noLoop();
}

// every drawTower() call above just queued itself — now that the whole
// sketch's tower list is known, pick exactly 4 at random (out of however
// many there turned out to be) to get a random base colour, each with
// level 2 as a variation of that same colour. Everything else uses a very
// dark blue/green/red instead of plain black. Renders the whole queue either way.
function flushTowerQueue() {
  let n = towerQueue.length;
  let specialIndices = new Set();
  while (specialIndices.size < min(4, n)) {
    specialIndices.add(floor(random(n)));
  }

  // separate, independent selection: 15% of all stacks get the base-level
  // edge comb (see drawEdgeCombLines()) — may or may not overlap with the
  // 4 colour-special stacks above
  let combCount = round(n * 0.15);
  let combIndices = new Set();
  while (combIndices.size < min(combCount, n)) {
    combIndices.add(floor(random(n)));
  }

  for (let i = 0; i < n; i++) {
    let t = towerQueue[i];
    let baseColour = specialIndices.has(i) ? color(random(255), random(255), random(255)) : null;
    renderTower(t.baseCx, t.baseCy, t.w, t.h, t.rot, baseColour, combIndices.has(i));
  }
}

// the single module used as tabs: one pair per grid (5 and 7), each pair
// straddling that grid's top and bottom edges — bottom edge on the shared
// edge, growing outward into the neighbouring grid (1/3 above, 9/11 below)
function drawModuleTabs() {
  let tabW = cellW * 0.35;
  let tabH = cellH * 0.3;

  for (let gridCol of [0, 2]) {
    // grid 5 (col 0) and grid 7 (col 2), both row 1
    let x = cellW * (gridCol + 0.5);
    let topY = gridTop + cellH * 1; // shared edge with grid 1/3 above
    let bottomY = gridTop + cellH * 2; // shared edge with grid 9/11 below

    // bottom edge of the module on the grid's top edge, growing up
    drawTower(x, topY - tabH / 2, tabW, tabH, 0);

    // top edge of the module on the grid's bottom edge, growing down
    drawTower(x, bottomY + tabH / 2, tabW, tabH, PI);
  }
}

// borders — ported structure from sketch.js, no fill/decoration — plus the
// 1-12 debug numbering on the main grid cells, same as sketch.js's drawGrid()
function drawGridStructure() {
  noFill();
  stroke(strokeColour);
  strokeWeight(1);

  for (let col = 0; col < cols; col++) {
    rect(cellW * (col + 0.5), headerH / 2, cellW, headerH);
  }

  let index = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = cellW * (col + 0.5);
      let y = gridTop + cellH * (row + 0.5);
      //rect(x, y, cellW, cellH);

      noStroke();
      fill(strokeColour);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(index, x, y);
      noFill();
      stroke(strokeColour);

      index++;
    }
  }

  let extraX = cellW * cols + extraColW / 2;
  for (let row = 0; row < rows; row++) {
    rect(extraX, gridTop + cellH * (row + 0.5), extraColW, cellH);
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
}

// places a tower so its flat (local bottom, anchor) edge sits at
// (anchorX, anchorY), facing in whatever direction 'rot' points it —
// the shared math behind both drawCenterFacingTowers() and
// drawQuadrantTowers() below
function drawAnchoredTower(anchorX, anchorY, w, h, rot) {
  let baseCx = anchorX + (h / 2) * sin(rot);
  let baseCy = anchorY - (h / 2) * cos(rot);
  drawTower(baseCx, baseCy, w, h, rot);
}

// grid 2's flipped test: 4 modules whose flat (anchor) edge sits at the
// grid's own centre point, each facing outward — up, down, left, right —
// instead of anchored at the cell's outer edges and growing inward
function drawCenterFacingTowers(cx, cy, cellW, cellH) {
  let wUD = cellW * 0.35;
  let hUD = cellH * 0.3;
  let wLR = cellH * 0.35; // axes swap once rotated 90 degrees
  let hLR = cellW * 0.3;

  drawAnchoredTower(cx, cy, wUD, hUD, 0); // up
  drawAnchoredTower(cx, cy, wUD, hUD, PI); // down
  drawAnchoredTower(cx, cy, wLR, hLR, -HALF_PI); // left
  drawAnchoredTower(cx, cy, wLR, hLR, HALF_PI); // right
}

// grid 4: split into 4 mini-grids (a 2x2 of half-width/half-height cells),
// each getting exactly one module per edge, flat edge against the outer
// edge, growing inward — 4 edges x 4 mini-grids = 16 module stacks total
function drawMiniGridTowers(cx, cy, cellW, cellH) {
  let miniW = cellW / 2;
  let miniH = cellH / 2;

  for (let qRow = 0; qRow < 2; qRow++) {
    for (let qCol = 0; qCol < 2; qCol++) {
      let miniCx = cx - cellW / 4 + qCol * (cellW / 2);
      let miniCy = cy - cellH / 4 + qRow * (cellH / 2);

      for (let side of ['top', 'bottom', 'left', 'right']) {
        drawSingleEdgeTower(miniCx, miniCy, miniW, miniH, side);
      }
    }
  }
}

// exactly one module flush against a cell's edge, growing inward — the
// single-module counterpart to drawEdgeTower()'s 1-or-3-module logic,
// reusing drawAnchoredTower()'s anchor-at-a-point math with the anchor
// placed at the edge's own midpoint
function drawSingleEdgeTower(cx, cy, cellW, cellH, side) {
  let edgeLength = side === 'left' || side === 'right' ? cellH : cellW;
  let w = random(edgeLength * 0.3, edgeLength);
  let h = cellH * random(0.15, 0.3);

  if (side === 'bottom') {
    drawAnchoredTower(cx, cy + cellH / 2, w, h, 0);
  } else if (side === 'top') {
    drawAnchoredTower(cx, cy - cellH / 2, w, h, PI);
  } else if (side === 'left') {
    drawAnchoredTower(cx - cellW / 2, cy, w, h, HALF_PI);
  } else {
    // right
    drawAnchoredTower(cx + cellW / 2, cy, w, h, -HALF_PI);
  }
}

// positions and rotates a tower so its base sits flush against one edge of
// a cell's extent, growing inward — 'side' is which cell edge it's anchored
// to. The tower is always built growing in local -y; rotating the whole
// thing is what makes it face inward from whichever side it's on.
function drawEdgeTower(cx, cy, cellW, cellH, side, scale = 1) {
  // edgeLength (true, unscaled) positions/spaces modules along the real
  // edge; sizeLength is what their actual widths are drawn from — scale
  // shrinks the modules themselves without moving them off the true edge
  let edgeLength = side === 'left' || side === 'right' ? cellH : cellW;
  let sizeLength = edgeLength * scale;

  // one depth factor per edge (0.6-1x), shared by every module on that
  // edge — so a grid with 4 edges gets 4 independent factors
  let depthFactor = random(0.6, 1);

  // per edge, one of 3 equally likely arrangements: one partial-length
  // module, or three modules (equal or random length)
  let mode = floor(random(3));
  let widths;
  if (mode === 0) {
    widths = [random(sizeLength * 0.4, sizeLength)];
  } else if (mode === 1) {
    let w3 = sizeLength / 3;
    widths = [w3, w3, w3];
  } else {
    let slot = sizeLength / 3;
    widths = [random(slot * 0.3, slot), random(slot * 0.3, slot), random(slot * 0.3, slot)];
  }

  let n = widths.length;
  for (let i = 0; i < n; i++) {
    let w = widths[i];
    let h = cellH * random(0.15, 0.3) * scale;

    // position along the edge: centred if there's just one, otherwise
    // centred within its own 1/3 slot of the edge
    let along = n === 1 ? 0 : -edgeLength / 2 + (edgeLength / n) * (i + 0.5);

    let baseCx, baseCy, rot;
    if (side === 'bottom') {
      rot = 0;
      baseCx = cx + along;
      baseCy = cy + cellH / 2 - h / 2;
    } else if (side === 'top') {
      rot = PI;
      baseCx = cx + along;
      baseCy = cy - cellH / 2 + h / 2;
    } else if (side === 'left') {
      rot = HALF_PI;
      baseCx = cx - cellW / 2 + h / 2;
      baseCy = cy + along;
    } else {
      // right
      rot = -HALF_PI;
      baseCx = cx + cellW / 2 - h / 2;
      baseCy = cy + along;
    }

    drawTower(baseCx, baseCy, w, h, rot);
  }
}

// queues a tower instead of drawing it immediately — see flushTowerQueue()
function drawTower(baseCx, baseCy, w, h, rot) {
  towerQueue.push({ baseCx, baseCy, w, h, rot });
}

// a random colour within +/- pct of seed, each channel clamped to 0-255
function randomNearColour(seed, pct) {
  let range = 255 * pct;
  let r = constrain(seed[0] + random(-range, range), 0, 255);
  let g = constrain(seed[1] + random(-range, range), 0, 255);
  let b = constrain(seed[2] + random(-range, range), 0, 255);
  return color(r, g, b);
}

// the module: 4 chamfered rectangles overlaid from (baseCx, baseCy),
// alternating black/white, each centred on the top (long) edge of the one
// below — sizes are random fractions of the base shape (0.1-0.6x its width
// and height), not a fixed half of the previous level, so overlay sizes
// and proportions vary independently of each other. rot orients the whole
// tower (base position + growth direction) as one rigid unit. baseColour is
// null for a plain (very dark blue/green/red) tower, or a colour for one of
// the 4 special ones picked by flushTowerQueue() — its level 0 uses that
// colour exactly, level 2 a variation of it (still within 15%).
function renderTower(baseCx, baseCy, w, h, rot, baseColour, addEdgeComb) {
  push();
  translate(baseCx, baseCy);
  rotate(rot);

  let baseW = w;
  let baseH = h;
  let curCx = 0;
  let curCy = 0;
  let curW = w;
  let curH = h;

  let baseColourArr = baseColour ? [red(baseColour), green(baseColour), blue(baseColour)] : null;
  let level0ChamferCorner, level0ChamferFrac;

  for (let level = 0; level < 4; level++) {
    // white stays white; without a base colour, both black levels are
    // plain black. With one, level 0 is that colour exactly and level 2
    // is a variation of it.
    let col;
    if (level % 2 === 1) {
      col = color(255);
    } else if (!baseColour) {
      col = color(0);
    } else if (level === 0) {
      col = baseColour;
    } else {
      col = randomNearColour(baseColourArr, 0.15);
    }
    let chamferCorner = floor(random(4));
    let chamferFrac = random(0.1, 0.6);

    if (level === 0) {
      level0ChamferCorner = chamferCorner;
      level0ChamferFrac = chamferFrac;
    }

    drawChamferedRect(curCx, curCy, curW, curH, col, chamferCorner, chamferFrac);

    if (level < 3) {
      // next shape's centre lands on the midpoint of this rect's top edge —
      // curCx is unchanged since that midpoint shares the same x
      curCy = curCy - curH / 2;
      curW = baseW * random(0.1, 0.6);
      curH = baseH * random(0.1, 0.6);
    }
  }

  // for 1/4 of all stacks (picked in flushTowerQueue()): a comb of
  // perpendicular tick lines around all 5 edges of the base (level 0) shape
  if (addEdgeComb) {
    let basePts = getChamferedRectPoints(baseW, baseH, level0ChamferCorner, level0ChamferFrac);
    drawEdgeCombLines(basePts, cellW * 0.025, cellW * 0.025);
  }

  // test: one more overlay on the base module, centred on the edge that's
  // clockwise-next from the top edge (where the first overlay sits) — i.e.
  // the base's right edge (top -> right -> bottom -> left, clockwise).
  // Red for now so it's easy to see; meant to end up white.
  let extraW = baseW * random(0.1, 0.6);
  let extraH = baseH * random(0.1, 0.6);
  drawChamferedRect(baseW / 2, 0, extraW, extraH, color(255), floor(random(4)), random(0.1, 0.6));

  pop();
}

// the 4 or 5 vertices of a rectangle with exactly one corner chamfered —
// cut inward by the same distance along both edges meeting at that corner,
// that distance being chamferFrac (0.1-0.6x) of the rectangle's short edge.
// Shared by drawChamferedRect() (fill) and drawEdgeCombLines() (base outline).
function getChamferedRectPoints(w, h, chamferCorner, chamferFrac) {
  let hw = w / 2;
  let hh = h / 2;
  let c = chamferFrac * min(w, h);

  let corners = [
    [-hw, -hh], // top-left
    [hw, -hh], // top-right
    [hw, hh], // bottom-right
    [-hw, hh], // bottom-left
  ];

  let pts = [];
  for (let i = 0; i < 4; i++) {
    if (i === chamferCorner) {
      let [x, y] = corners[i];
      let prev = corners[(i + 3) % 4];
      let next = corners[(i + 1) % 4];
      let dPrev = [Math.sign(prev[0] - x), Math.sign(prev[1] - y)];
      let dNext = [Math.sign(next[0] - x), Math.sign(next[1] - y)];
      pts.push([x + dPrev[0] * c, y + dPrev[1] * c]);
      pts.push([x + dNext[0] * c, y + dNext[1] * c]);
    } else {
      pts.push(corners[i]);
    }
  }

  return pts;
}

// a rectangle with exactly one corner chamfered — see getChamferedRectPoints()
function drawChamferedRect(cx, cy, w, h, col, chamferCorner, chamferFrac) {
  push();
  translate(cx, cy);
  noStroke();
  fill(col);

  let pts = getChamferedRectPoints(w, h, chamferCorner, chamferFrac);

  beginShape();
  for (let p of pts) vertex(p[0], p[1]);
  endShape(CLOSE);

  pop();
}

// a comb of tick marks around every edge of a polygon (here, the base
// shape's 5 edges): one line per 'spacing' interval along each edge,
// starting at that edge's first vertex, each perpendicular to the edge and
// extending outward by 'extend'. Assumes pts are wound consistently (as
// getChamferedRectPoints() produces) so the (uy, -ux) normal always points
// outward regardless of which corner is chamfered.
function drawEdgeCombLines(pts, spacing, extend) {
  stroke(strokeColour);
  strokeWeight(1);

  let n = pts.length;
  for (let i = 0; i < n; i++) {
    let p1 = pts[i];
    let p2 = pts[(i + 1) % n];
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    let edgeLen = sqrt(dx * dx + dy * dy);
    if (edgeLen < 0.0001) continue;

    let ux = dx / edgeLen;
    let uy = dy / edgeLen;
    let nx = uy; // outward normal
    let ny = -ux;

    for (let t = 0; t < edgeLen; t += spacing) {
      let px = p1[0] + ux * t;
      let py = p1[1] + uy * t;
      line(px, py, px + nx * extend, py + ny * extend);
    }
  }
}
