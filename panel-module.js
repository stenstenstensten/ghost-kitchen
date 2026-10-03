// Extracted from "liquid death crossing.js"'s panelSingle()/panelMaster01 —
// the one module worth keeping out of that sketch: an off-centre rectangle
// (one corner chamfered, the others square — that asymmetry is what makes
// stacks of it read as 'shuffled' once copies are rotated against each
// other), with off-centre internal seams, a translucent eroded outline, and
// plug-like connector nubs on all four edges. Everything else from the old
// sketch (the tile variant, poles, connectorArc, the 300-instance random
// panel list, the palette experiments) was dropped as unrelated scaffolding.
//
// panel() is the reusable module (unchanged below). Everything above it is
// a test: sketch.js's grid setup (4x3 main grid + header row + far-right
// column) ported over as-is, with one panel() instance centred in each of
// grids 2, 4, 5, 6, 7, 8, 10 — the rest of the grid (header cells, the extra
// column, grids 1/3/9/11/12) is just borders, for structural context.

let cols = 4;
let rows = 3;
let cellW, cellH;
let headerH, gridTop;
let extraColW;

let strokeColour;
let bgColour;
let palette;

let targetGrids = [2, 4, 5, 6, 7, 8, 10];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  rectMode(CENTER);
  randomSeed(20); // keep the demo's random flex/colour choices stable across resizes

  strokeColour = color(0, 0, 40);
  bgColour = color(230, 5, 12);
  palette = [
    color(20, 50, 90), // orange
    color(340, 45, 20), // pink
    color(35, 15, 92), // cream
    color(210, 25, 75), // blue
  ];

  computeLayout();
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
  background(bgColour);

  drawGridStructure();

  for (let i = 0; i < targetGrids.length; i++) {
    let index = targetGrids[i];
    let row = floor((index - 1) / cols);
    let col = (index - 1) % cols;
    let x = cellW * (col + 0.5);
    let y = gridTop + cellH * (row + 0.5);

    panel(
      x, y, cellW * 0.82, cellH * 0.82, 0,
      1, 1, 1, 1,
      palette[i % palette.length], palette[(i + 2) % palette.length],
      bgColour, palette
    );

    // two more, layered on top at the same centre — different proportions
    // each time (not just uniformly scaled-down copies), still no rotation
    panel(
      x, y, cellW * 0.55, cellH * 0.28, 0,
      1, 1, 1, 1,
      palette[(i + 1) % palette.length], palette[(i + 3) % palette.length],
      bgColour, palette
    );
    panel(
      x, y, cellW * 0.32, cellH * 0.46, 0,
      1, 1, 1, 1,
      palette[(i + 2) % palette.length], palette[i % palette.length],
      bgColour, palette
    );
  }

  noLoop();
}

// borders only, for every header cell, main grid cell and extra-column cell
// — ported structure from sketch.js, no fill/decoration on the untargeted ones
function drawGridStructure() {
  noFill();
  stroke(strokeColour);
  strokeWeight(1);

  for (let col = 0; col < cols; col++) {
    rect(cellW * (col + 0.5), headerH / 2, cellW, headerH);
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rect(cellW * (col + 0.5), gridTop + cellH * (row + 0.5), cellW, cellH);
    }
  }

  let extraX = cellW * cols + extraColW / 2;
  for (let row = 0; row < rows; row++) {
    rect(extraX, gridTop + cellH * (row + 0.5), extraColW, cellH);
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  computeLayout();
}

// the module: an off-centre rectangle (chamfered top-left corner only),
// with flex-controlled internal seams, a soft eroded outline, and
// connector nubs on all four edges
function panel(x, y, w, h, rot, flexL, flexR, flexT, flexB, bodyCol, accentCol, bgCol, seamPalette) {
  push();
  translate(x, y);
  rotate(rot);
  noStroke();

  // body: left side chamfered at the top, right side square —
  // the single asymmetric cut is the module's signature 'shuffled' trait
  fill(bodyCol);
  beginShape();
  vertex(-w / 2, -h / 2 + h * 0.2);
  vertex(-w * 0.4, -h / 2);
  vertex(-w * 0.4, h / 2);
  vertex(-w / 2, h / 2);
  endShape(CLOSE);

  beginShape();
  vertex(w / 2, -h / 2);
  vertex(w * 0.4, -h / 2);
  vertex(w * 0.4, h / 2);
  vertex(w / 2, h / 2);
  endShape(CLOSE);

  // left/right seams: same colour as the body, off-centre width via flexL/R
  fill(bodyCol);
  rect(-w * 0.4 + w * 0.05 * flexL, 0, w * 0.1 * flexL, h);
  rect(w * 0.4 - w * 0.05 * flexR, 0, w * 0.1 * flexR, h);

  // top/bottom seams: a random colour from the palette each time, so each
  // instance shuffles its own internal colour even at a fixed bodyCol
  fill(random(seamPalette));
  rect(0, -h / 2 + h * 0.05 * flexT, w * 0.8, h * 0.1 * flexT);
  fill(random(seamPalette));
  rect(0, h / 2 - h * 0.05 * flexB, w * 0.8, h * 0.1 * flexB);

  // eroded translucent outline: two inset copies of the chamfered silhouette,
  // low-alpha white — softens the edge where panels overlap/layer
  noStroke();
  fill(0, 0, 100, 20);
  for (let s of [0.9, 0.81]) {
    push();
    scale(s);
    beginShape();
    vertex(w / 2, -h / 2);
    vertex(w / 2, h / 2);
    vertex(-w / 2, h / 2);
    vertex(-w / 2, -h / 2 + h * 0.2);
    vertex(-w * 0.4, -h / 2);
    endShape(CLOSE);
    pop();
  }

  // connector nubs, one per edge
  edgeLock(-w / 2 - w * 0.08, 0, w, h, 'v', bgCol, accentCol);
  edgeLock(w / 2 + w * 0.08, 0, w, h, 'v', bgCol, accentCol);
  edgeLock(0, -h / 2 - h * 0.08, w, h, 'h', bgCol, accentCol);
  edgeLock(0, h / 2 + h * 0.08, w, h, 'h', bgCol, accentCol);

  // centre rivet
  fill(bgCol);
  rect(0, 0, min(w, h) * 0.2);
  fill(accentCol);
  rect(0, 0, min(w, h) * 0.06);

  pop();
}

// plug-like connector nub, shared by all four edges of panel() — axis 'v'
// sticks out sideways (elongated along h), axis 'h' sticks out up/down
// (elongated along w); 4 nested rects shrinking from bgCol down to white
function edgeLock(cx, cy, w, h, axis, bgCol, accentCol) {
  push();
  noStroke();

  let alongDim = axis === 'v' ? h : w;
  let acrossDim = axis === 'v' ? w : h;
  let white = color(0, 0, 100, 100);

  let layers = [
    [bgCol, 0.2, 0.5],
    [accentCol, 0.15, 0.1],
    [white, 0.15, 0.07],
    [white, 0.15, 0.02],
  ];

  for (let [col, acrossFrac, alongFrac] of layers) {
    fill(col);
    let across = acrossDim * acrossFrac;
    let along = alongDim * alongFrac;
    if (axis === 'v') rect(cx, cy, across, along);
    else rect(cx, cy, along, across);
  }

  pop();
}
