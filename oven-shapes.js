// Freeform exploration: 12 rough, solid-colour shapes inspired by an oven
// service manual's exploded-view diagrams — both the literal hardware
// (coils, racks, brackets, fans) and the diagram's own drawing conventions
// (dashed cutaway lines, numbered callout circles, screw glyphs, angle
// arrows). Not tied to the main sketch.js grid/palette system.

let cols = 4;
let rows = 3;
let cellW, cellH;
let bgColour;
let screenStrokeWeight; // tied to window size, not any individual shape's size

// one colour for every shape in this exercise, deliberately
// muted/workshop-poster rather than bright
let shapeColour = [220, 80, 70];

let ovenShapeFunctions = [
  coilLoop,
  dotFieldSlab,
  ribbedTray,
  radialVentDisc,
  pinwheel,
  hookLatch,
  tiltedPane,
  calloutDot,
  dashGhost,
  crossBolt,
  bentBracket,
  flaggedProbe,
];

// chicken meatball soup: ingredients then equipment, rough/not-always-literal
// (per the brief: chicken mince -> a beak, not a bird or a scoop of mince)
let recipeShapeFunctions = [
  chickenBeak,
  herbSprig,
  eggYolk,
  ricottaScoop,
  breadcrumbScatter,
  lemonWedge,
  pinchSalt,
  leek,
  fennelBulb,
  garlicClove,
  carrotCone,
  celeryRib,
  stockPuddle,
  pastaTangle,
  mixingBowl,
  bakingTray,
  fryingPan,
  potWithLid,
];

// same recipe, new style: every element built from one base unit — a
// rounded pentagon — repeated, scaled, squashed, rotated and clustered
let recipePentagonFunctions = [
  chickenBeakP,
  herbSprigP,
  eggYolkP,
  ricottaScoopP,
  breadcrumbScatterP,
  lemonWedgeP,
  pinchSaltP,
  leekP,
  fennelBulbP,
  garlicCloveP,
  carrotConeP,
  celeryRibP,
  stockPuddleP,
  pastaTangleP,
  mixingBowlP,
  bakingTrayP,
  fryingPanP,
  potWithLidP,
];

// same oven set, pentagon style: outline-only, built from the same rounded-
// pentagon base unit as the recipe pentagon set above
let ovenPentagonFunctions = [
  coilLoopP,
  dotFieldSlabP,
  ribbedTrayP,
  radialVentDiscP,
  pinwheelP,
  hookLatchP,
  tiltedPaneP,
  calloutDotP,
  dashGhostP,
  crossBoltP,
  bentBracketP,
  flaggedProbeP,
];

// swap this to any of the other *ShapeFunctions arrays to go back to those
let shapeFunctions = recipePentagonFunctions;
let gridDims = { oven: [4, 3], recipe: [6, 3], recipePentagon: [6, 3], ovenPentagon: [4, 3] };

// 'grid' = the one-of-each layout used everywhere above; 'scatter' = many
// random instances at random positions/sizes/rotations, to see them cluster
let sceneMode = 'scatter';
let scatterCount = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  rectMode(CENTER);
  bgColour = color(40, 8, 96);
  if (shapeFunctions === ovenShapeFunctions) [cols, rows] = gridDims.oven;
  else if (shapeFunctions === recipeShapeFunctions) [cols, rows] = gridDims.recipe;
  else if (shapeFunctions === recipePentagonFunctions) [cols, rows] = gridDims.recipePentagon;
  else [cols, rows] = gridDims.ovenPentagon;
}

function computeLayout() {
  cellW = width / cols;
  cellH = height / rows;
  screenStrokeWeight = min(width, height) * 0.014; // scales with the window, recomputed on resize
}

function draw() {
  randomSeed(20); // keep the 'rough' jitter stable across redraws/resizes
  computeLayout();

  background(bgColour);

  if (sceneMode === 'scatter') drawScatter();
  else drawGridLayout();

  noLoop();
}

function drawGridLayout() {
  let s = min(cellW, cellH) * 0.32;

  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = cellW * (col + 0.5);
      let y = cellH * (row + 0.5);
      push();
      translate(x, y);
      shapeFunctions[index](s, color(...shapeColour));
      pop();
      index++;
    }
  }
}

function drawScatter() {
  let baseS = min(width, height) * 0.02;
  let cx = width / 2;
  let cy = height / 2;
  let maxR = min(width, height) * 0.45;

  // items per ring scale with the ring's radius, so spacing along the
  // circumference stays roughly even from the inner rings to the outer ones
  let ringCount = 6;
  let radii = [];
  for (let i = 0; i < ringCount; i++) radii.push((maxR * (i + 1)) / ringCount);
  let totalRadius = radii.reduce((a, b) => a + b, 0);

  let placed = 0;
  for (let i = 0; i < ringCount; i++) {
    let itemsThisRing =
      i < ringCount - 1
        ? round(scatterCount * (radii[i] / totalRadius))
        : scatterCount - placed; // last ring takes the remainder so the total always matches scatterCount
    let angleOffset = random(TWO_PI);

    for (let j = 0; j < itemsThisRing; j++) {
      let a = angleOffset + (j / itemsThisRing) * TWO_PI;
      let x = cx + cos(a) * radii[i];
      let y = cy + sin(a) * radii[i];

      let fn = shapeFunctions[floor(random(shapeFunctions.length))];
      let s = baseS * random(0.6, 1.5);

      push();
      translate(x, y);
      rotate(a + HALF_PI); // tangent to the ring, so shapes trail around it
      fn(s, color(...shapeColour));
      pop();
    }
    placed += itemsThisRing;
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  redraw();
}

// ---- helpers -------------------------------------------------------------

// the pentagon style's base unit: a 5-sided shape with rounded corners
// (curveVertex smooths through the 5 points), stretched/squashed/rotated
// per call so the same primitive can stand in for very different things
function pentagon(x, y, r, rot, sx, sy, col) {
  push();
  translate(x, y);
  rotate(rot);
  // sx/sy are baked into each point directly (not via scale()) so the
  // coordinate system stroke() draws in stays unscaled — otherwise a
  // non-uniform scale() would stretch the line thickness unevenly per axis
  stroke(col)
  strokeWeight(screenStrokeWeight)
  noFill()

  let n = 5;
  let pts = [];
  for (let i = 0; i < n; i++) {
    let a = (i / n) * TWO_PI - HALF_PI;
    let rr = r + random(-r * 0.06, r * 0.06);
    pts.push([cos(a) * rr * sx, sin(a) * rr * sy]);
  }

  beginShape();
  curveVertex(pts[n - 1][0], pts[n - 1][1]);
  for (let p of pts) curveVertex(p[0], p[1]);
  curveVertex(pts[0][0], pts[0][1]);
  curveVertex(pts[1][0], pts[1][1]);
  endShape(CLOSE);
  pop();
}

function roughPolygon(pts, jitterAmt, closeIt) {
  beginShape();
  for (let p of pts) {
    vertex(p[0] + random(-jitterAmt, jitterAmt), p[1] + random(-jitterAmt, jitterAmt));
  }
  if (closeIt) endShape(CLOSE);
  else endShape();
}

function roughCirclePts(r, n, jitterAmt) {
  let pts = [];
  for (let i = 0; i < n; i++) {
    let a = (i / n) * TWO_PI;
    let rr = r + random(-jitterAmt, jitterAmt);
    pts.push([cos(a) * rr, sin(a) * rr]);
  }
  return pts;
}

// dashed line between two points, used for the 'ghost' hidden-line motif
function dashedLine(x1, y1, x2, y2, dashLen) {
  let d = dist(x1, y1, x2, y2);
  let steps = max(2, floor(d / dashLen));
  for (let i = 0; i < steps; i += 2) {
    let t1 = i / steps;
    let t2 = min(1, (i + 1) / steps);
    line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
  }
}

// ---- 1. coil-loop: the bake element, unwound into a wandering open path --
function coilLoop(s, col) {
  noFill();
  stroke(col);
  strokeWeight(s * 0.18);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  let pts = [
    [-0.8 * s, -0.6 * s],
    [0.8 * s, -0.6 * s],
    [0.8 * s, 0.6 * s],
    [0.35 * s, 0.6 * s],
    [0.35 * s, -0.15 * s],
    [-0.35 * s, -0.15 * s],
    [-0.35 * s, 0.6 * s],
    [-0.8 * s, 0.6 * s],
  ];
  roughPolygon(pts, s * 0.05, false);
}

// ---- 2. dot-field slab: insulation panel, stipple as the shape itself ----
function dotFieldSlab(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.9 * s, -0.55 * s],
    [0.9 * s, -0.55 * s],
    [0.9 * s, 0.55 * s],
    [-0.9 * s, 0.55 * s],
  ];
  roughPolygon(pts, s * 0.05, true);

  fill(bgColour);
  for (let gy = -0.35; gy <= 0.35; gy += 0.23) {
    for (let gx = -0.7; gx <= 0.7; gx += 0.24) {
      let dx = gx * s + random(-s * 0.05, s * 0.05);
      let dy = gy * s + random(-s * 0.05, s * 0.05);
      circle(dx, dy, s * (0.09 + random(0, 0.04)));
    }
  }
}

// ---- 3. ribbed tray: a shallow trapezoid, pressed with rough ridges ------
function ribbedTray(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.65 * s, -0.5 * s],
    [0.65 * s, -0.5 * s],
    [0.85 * s, 0.55 * s],
    [-0.85 * s, 0.55 * s],
  ];
  roughPolygon(pts, s * 0.05, true);

  stroke(bgColour);
  strokeWeight(s * 0.05);
  let ribYs = [-0.15, 0.1, 0.35];
  for (let ry of ribYs) {
    let y = ry * s;
    let xSpread = 0.55 + ry * 0.3;
    line(
      -xSpread * s + random(-s * 0.05, s * 0.05), y + random(-s * 0.03, s * 0.03),
      xSpread * s + random(-s * 0.05, s * 0.05), y + random(-s * 0.03, s * 0.03)
    );
  }
}

// ---- 4. radial vent disc: round grille, holes biased to one side --------
function radialVentDisc(s, col) {
  noStroke();
  fill(col);
  roughPolygon(roughCirclePts(0.8 * s, 16, s * 0.05), 0, true);

  fill(bgColour);
  for (let i = 0; i < 11; i++) {
    let a = random(TWO_PI);
    let r = random(0.15, 0.6) * s + (cos(a) > 0 ? s * 0.1 : 0); // biased outward on one side
    let dx = cos(a) * r;
    let dy = sin(a) * r;
    circle(dx, dy, s * random(0.06, 0.15));
  }
}

// ---- 5. pinwheel: lopsided convection fan ---------------------------------
function pinwheel(s, col) {
  noStroke();
  fill(col);

  let baseAngles = [0, HALF_PI, PI, PI + HALF_PI];
  for (let a of baseAngles) {
    let jitterA = a + random(-0.25, 0.25);
    let len = s * random(0.65, 0.95);
    let wid = s * random(0.25, 0.4);
    let tipA = jitterA + random(-0.3, 0.1);

    let base1 = [cos(jitterA + HALF_PI) * wid * 0.3, sin(jitterA + HALF_PI) * wid * 0.3];
    let base2 = [cos(jitterA - HALF_PI) * wid * 0.3, sin(jitterA - HALF_PI) * wid * 0.3];
    let mid = [cos(jitterA) * len * 0.6 + cos(jitterA + HALF_PI) * wid * 0.5, sin(jitterA) * len * 0.6 + sin(jitterA + HALF_PI) * wid * 0.5];
    let tip = [cos(tipA) * len, sin(tipA) * len];

    roughPolygon([base1, mid, tip, base2], s * 0.04, true);
  }

  circle(0, 0, s * 0.32);
}

// ---- 6. hook-latch: the door-hinge catch, blunt and comma-shaped --------
function hookLatch(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.18 * s, -0.9 * s],
    [0.18 * s, -0.9 * s],
    [0.18 * s, 0.15 * s],
    [0.6 * s, 0.3 * s],
    [0.65 * s, 0.65 * s],
    [0.3 * s, 0.8 * s],
    [-0.1 * s, 0.55 * s],
    [-0.18 * s, 0.15 * s],
  ];
  roughPolygon(pts, s * 0.05, true);
}

// ---- 7. tilted pane: door held at ~15 degrees, off its baseline ----------
function tiltedPane(s, col) {
  push();
  rotate(radians(15));
  noStroke();
  fill(col);
  let pts = [
    [-0.65 * s, -0.9 * s],
    [0.65 * s, -0.9 * s],
    [0.65 * s, 0.9 * s],
    [-0.65 * s, 0.9 * s],
  ];
  roughPolygon(pts, s * 0.05, true);
  pop();
}

// ---- 8. callout dot: the manual's numbered marker, made monumental ------
function calloutDot(s, col) {
  noStroke();
  fill(col);

  let n = 18;
  let pts = [];
  for (let i = 0; i < n; i++) {
    let a = (i / n) * TWO_PI;
    let r = 0.8 * s + random(-s * 0.05, s * 0.05);
    // bite a notch out of one arc of the circle
    if (i >= 3 && i <= 5) {
      r *= 0.45;
    }
    pts.push([cos(a) * r, sin(a) * r]);
  }
  roughPolygon(pts, 0, true);
}

// ---- 9. dash-ghost: a solid shape with its hidden-line twin -------------
function dashGhost(s, col) {
  noStroke();
  fill(col);
  let solidPts = [
    [-0.15 * s, -0.15 * s],
    [0.55 * s, -0.15 * s],
    [0.55 * s, 0.55 * s],
    [-0.15 * s, 0.55 * s],
  ];
  roughPolygon(solidPts.map((p) => [p[0] + 0.1 * s, p[1] + 0.1 * s]), s * 0.04, true);

  noFill();
  stroke(col);
  strokeWeight(s * 0.05);
  let ghostPts = [
    [-0.55 * s, -0.55 * s],
    [0.15 * s, -0.55 * s],
    [0.15 * s, 0.15 * s],
    [-0.55 * s, 0.15 * s],
  ];
  for (let i = 0; i < ghostPts.length; i++) {
    let a = ghostPts[i];
    let b = ghostPts[(i + 1) % ghostPts.length];
    dashedLine(a[0], a[1], b[0], b[1], s * 0.14);
  }
}

// ---- 10. cross-bolt: the screw glyph, almost an asterisk ------------------
function crossBolt(s, col) {
  noStroke();
  fill(col);
  roughPolygon(roughCirclePts(0.7 * s, 14, s * 0.05), 0, true);

  push();
  rotate(random(-0.2, 0.2));
  fill(bgColour);
  rect(0, 0, s * 0.95, s * 0.22);
  rect(0, 0, s * 0.22, s * 0.95);
  pop();
}

// ---- 11. bent bracket: a single strip folded at two right angles --------
function bentBracket(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.75 * s, -0.75 * s],
    [-0.4 * s, -0.75 * s],
    [-0.4 * s, 0.4 * s],
    [0.75 * s, 0.4 * s],
    [0.75 * s, 0.75 * s],
    [-0.75 * s, 0.75 * s],
  ];
  roughPolygon(pts, s * 0.04, true);
}

// ---- 12. flagged probe: temperature sensor, a wavering wire with a flag -
function flaggedProbe(s, col) {
  noFill();
  stroke(col);
  strokeWeight(s * 0.08);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  let pts = [
    [-0.7 * s, 0.85 * s],
    [-0.5 * s, 0.4 * s],
    [-0.6 * s, -0.05 * s],
    [-0.3 * s, -0.4 * s],
    [0.05 * s, -0.7 * s],
  ];
  roughPolygon(pts, s * 0.05, false);

  noStroke();
  fill(col);
  let tip = pts[pts.length - 1];
  let flagPts = [
    [tip[0], tip[1]],
    [tip[0] + 0.45 * s, tip[1] + 0.05 * s],
    [tip[0] + 0.1 * s, tip[1] + 0.3 * s],
  ];
  roughPolygon(flagPts, s * 0.03, true);
}

// ============================================================================
// chicken meatball soup — ingredients + equipment
// ============================================================================

// ---- 1. chicken mince: a beak, not a bird ---------------------------------
function chickenBeak(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.65 * s, 0],
    [0.1 * s, -0.35 * s],
    [0.75 * s, 0],
    [0.1 * s, 0.35 * s],
  ];
  roughPolygon(pts, s * 0.05, true);
}

// ---- 2. herb sprig: stem + alternating leaves -----------------------------
function herbSprig(s, col) {
  stroke(col);
  strokeWeight(s * 0.06);
  strokeCap(ROUND);
  line(0, 0.75 * s, 0, -0.75 * s);

  noStroke();
  fill(col);
  for (let i = 0; i < 5; i++) {
    let y = lerp(0.55, -0.65, i / 4) * s;
    let side = i % 2 === 0 ? 1 : -1;
    let leafPts = [
      [0, y],
      [side * 0.35 * s, y - 0.12 * s],
      [side * 0.05 * s, y + 0.15 * s],
    ];
    roughPolygon(leafPts, s * 0.02, true);
  }
}

// ---- 3. egg yolk: a wobbly blob -------------------------------------------
function eggYolk(s, col) {
  noStroke();
  fill(col);
  roughPolygon(roughCirclePts(0.55 * s, 12, s * 0.08), 0, true);
}

// ---- 4. ricotta: a soft lumpy scoop ---------------------------------------
function ricottaScoop(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.7 * s, 0.35 * s],
    [-0.55 * s, -0.25 * s],
    [-0.15 * s, -0.6 * s],
    [0.25 * s, -0.5 * s],
    [0.6 * s, -0.1 * s],
    [0.6 * s, 0.35 * s],
    [0.15 * s, 0.5 * s],
    [-0.3 * s, 0.5 * s],
  ];
  roughPolygon(pts, s * 0.05, true);
}

// ---- 5. breadcrumbs: a loose scatter, texture as the whole shape ---------
function breadcrumbScatter(s, col) {
  noStroke();
  fill(col);
  for (let i = 0; i < 12; i++) {
    let a = random(TWO_PI);
    let r = random(0.1, 0.65) * s;
    let cx = cos(a) * r;
    let cy = sin(a) * r;
    let cs = s * random(0.08, 0.16);
    let crumbPts = [
      [cx - cs, cy],
      [cx, cy - cs],
      [cx + cs, cy],
      [cx, cy + cs],
    ];
    roughPolygon(crumbPts, s * 0.02, true);
  }
}

// ---- 6. lemon: a wedge, rounded rind edge ---------------------------------
function lemonWedge(s, col) {
  noStroke();
  fill(col);
  let pts = [[0, 0]];
  for (let a = -45; a <= 45; a += 15) {
    let rad = radians(a);
    pts.push([sin(rad) * 0.75 * s, -cos(rad) * 0.75 * s]);
  }
  roughPolygon(pts, s * 0.04, true);
}

// ---- 7. salt & pepper: a pinch, tapering to a pour --------------------
function pinchSalt(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.35 * s, -0.6 * s],
    [0.35 * s, -0.6 * s],
    [0.06 * s, 0.55 * s],
    [-0.06 * s, 0.55 * s],
  ];
  roughPolygon(pts, s * 0.04, true);

  for (let i = 0; i < 3; i++) {
    circle(random(-0.1, 0.1) * s, (0.75 + i * 0.1) * s, s * 0.06);
  }
}

// ---- 8. leek: banded cylinder with a frilly top ---------------------------
function leek(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.25 * s, -0.55 * s],
    [0.25 * s, -0.55 * s],
    [0.25 * s, 0.6 * s],
    [-0.25 * s, 0.6 * s],
  ];
  roughPolygon(pts, s * 0.04, true);

  stroke(bgColour);
  strokeWeight(s * 0.04);
  for (let ry of [-0.15, 0.1, 0.35]) {
    line(-0.22 * s, ry * s, 0.22 * s, ry * s);
  }

  stroke(col);
  strokeWeight(s * 0.05);
  strokeCap(ROUND);
  line(-0.1 * s, -0.55 * s, -0.3 * s, -0.95 * s);
  line(0, -0.55 * s, 0, -0.98 * s);
  line(0.1 * s, -0.55 * s, 0.3 * s, -0.95 * s);
}

// ---- 9. fennel bulb: rounded bulb with wispy fronds -----------------------
function fennelBulb(s, col) {
  noStroke();
  fill(col);
  let pts = roughCirclePts(0.55 * s, 12, s * 0.06).map((p) => [p[0], p[1] * 0.85 + 0.1 * s]);
  roughPolygon(pts, 0, true);

  stroke(col);
  strokeWeight(s * 0.04);
  strokeCap(ROUND);
  line(-0.2 * s, -0.4 * s, -0.4 * s, -0.9 * s);
  line(0, -0.45 * s, 0.05 * s, -0.95 * s);
  line(0.2 * s, -0.4 * s, 0.4 * s, -0.85 * s);
}

// ---- 10. garlic: a single pointed teardrop clove --------------------------
function garlicClove(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [0, -0.8 * s],
    [0.35 * s, -0.1 * s],
    [0.3 * s, 0.5 * s],
    [0, 0.65 * s],
    [-0.3 * s, 0.5 * s],
    [-0.35 * s, -0.1 * s],
  ];
  roughPolygon(pts, s * 0.04, true);
}

// ---- 11. carrot: a tapered cone with greens at the wide end ---------------
function carrotCone(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.3 * s, -0.65 * s],
    [0.3 * s, -0.65 * s],
    [0.06 * s, 0.65 * s],
    [-0.06 * s, 0.65 * s],
  ];
  roughPolygon(pts, s * 0.04, true);

  stroke(col);
  strokeWeight(s * 0.04);
  strokeCap(ROUND);
  line(-0.05 * s, -0.6 * s, -0.25 * s, -0.95 * s);
  line(0.05 * s, -0.6 * s, 0.25 * s, -0.95 * s);
}

// ---- 12. celery: a curved rib with a channel groove -----------------------
function celeryRib(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.15 * s, -0.75 * s],
    [0.15 * s, -0.7 * s],
    [0.3 * s, 0.7 * s],
    [0, 0.75 * s],
    [-0.3 * s, 0.7 * s],
  ];
  roughPolygon(pts, s * 0.04, true);

  stroke(bgColour);
  strokeWeight(s * 0.04);
  strokeCap(ROUND);
  line(0, -0.55 * s, 0, 0.5 * s);
}

// ---- 13. chicken stock: a flattened wavy-edged puddle ---------------------
function stockPuddle(s, col) {
  noStroke();
  fill(col);
  let pts = roughCirclePts(0.75 * s, 14, s * 0.08).map((p) => [p[0], p[1] * 0.55]);
  roughPolygon(pts, 0, true);
}

// ---- 14. orzo/pasta: a loose tangle of short wavy strokes ------------------
function pastaTangle(s, col) {
  noFill();
  stroke(col);
  strokeWeight(s * 0.09);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  // one continuous looping/overlapping strand, rather than several separate
  // short strokes (which kept accidentally reading as a little figure)
  let pts = [
    [-0.55 * s, 0.15 * s],
    [-0.15 * s, -0.45 * s],
    [0.35 * s, 0.35 * s],
    [-0.25 * s, 0.5 * s],
    [0.45 * s, -0.15 * s],
    [0.5 * s, 0.2 * s],
  ];

  beginShape();
  curveVertex(pts[0][0], pts[0][1]);
  for (let p of pts) {
    curveVertex(p[0] + random(-s * 0.03, s * 0.03), p[1] + random(-s * 0.03, s * 0.03));
  }
  curveVertex(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  endShape();
}

// ---- 15. mixing bowl: a shallow arc, open at the top ----------------------
function mixingBowl(s, col) {
  noStroke();
  fill(col);
  let pts = [];
  for (let a = 20; a <= 160; a += 20) {
    let rad = radians(a);
    pts.push([cos(rad) * 0.85 * s, sin(rad) * 0.85 * s]);
  }
  roughPolygon(pts, s * 0.04, true);
}

// ---- 16. baking tray: a rectangle with a crinkled paper line --------------
function bakingTray(s, col) {
  noStroke();
  fill(col);
  let pts = [
    [-0.8 * s, -0.5 * s],
    [0.8 * s, -0.5 * s],
    [0.8 * s, 0.5 * s],
    [-0.8 * s, 0.5 * s],
  ];
  roughPolygon(pts, s * 0.04, true);

  stroke(bgColour);
  strokeWeight(s * 0.04);
  noFill();
  beginShape();
  for (let x = -0.65; x <= 0.65; x += 0.15) {
    vertex(x * s, -0.15 * s + sin(x * 10) * 0.08 * s);
  }
  endShape();
}

// ---- 17. frying pan: circle + stick handle ---------------------------------
function fryingPan(s, col) {
  noStroke();
  fill(col);
  roughPolygon(roughCirclePts(0.55 * s, 14, s * 0.05), 0, true);

  stroke(col);
  strokeWeight(s * 0.12);
  strokeCap(ROUND);
  line(0.5 * s, 0, 1.0 * s, -0.15 * s);
}

// ---- 18. pot with lid: rounded body + lid + knob ---------------------------
function potWithLid(s, col) {
  noStroke();
  fill(col);
  let potPts = [
    [-0.55 * s, -0.1 * s],
    [0.55 * s, -0.1 * s],
    [0.45 * s, 0.7 * s],
    [-0.45 * s, 0.7 * s],
  ];
  roughPolygon(potPts, s * 0.04, true);

  let lidPts = roughCirclePts(0.6 * s, 12, s * 0.03).map((p) => [p[0], p[1] * 0.35 - 0.15 * s]);
  roughPolygon(lidPts, 0, true);

  circle(0, -0.4 * s, s * 0.12);
}

// ============================================================================
// chicken meatball soup — same 18 elements, pentagon style: every shape is
// one or more calls to pentagon(x, y, r, rotation, squashX, squashY, col)
// ============================================================================

// ---- 1. chicken mince: one pentagon, elongated and rotated into a beak ---
function chickenBeakP(s, col) {
  pentagon(0, 0, s * 0.55, HALF_PI, 0.5, 1.7, col);
}

// ---- 2. herb sprig: a stack of tiny stem-pentagons + leaf-pentagons ------
function herbSprigP(s, col) {
  for (let i = 0; i < 5; i++) {
    let y = lerp(0.7, -0.7, i / 4) * s;
    pentagon(0, y, s * 0.13, 0, 0.4, 1, col);
  }
  for (let i = 0; i < 4; i++) {
    let y = lerp(0.5, -0.6, i / 3) * s;
    let side = i % 2 === 0 ? 1 : -1;
    pentagon(side * 0.32 * s, y, s * 0.18, side * 0.7, 0.55, 1.3, col);
  }
}

// ---- 3. egg yolk: a single near-round pentagon ----------------------------
function eggYolkP(s, col) {
  pentagon(0, 0, s * 0.6, 0.15, 1, 1, col);
}

// ---- 4. ricotta: a cluster of overlapping pentagons, one lumpy mound -----
function ricottaScoopP(s, col) {
  pentagon(-0.25 * s, 0.1 * s, s * 0.4, 0.3, 1, 1, col);
  pentagon(0.2 * s, 0.15 * s, s * 0.42, -0.2, 1, 1, col);
  pentagon(0, -0.25 * s, s * 0.38, 0.5, 1, 1, col);
  pentagon(0.05 * s, 0.35 * s, s * 0.3, 0, 1, 1, col);
}

// ---- 5. breadcrumbs: a scatter of tiny pentagons --------------------------
function breadcrumbScatterP(s, col) {
  for (let i = 0; i < 12; i++) {
    let a = random(TWO_PI);
    let r = random(0.1, 0.65) * s;
    pentagon(cos(a) * r, sin(a) * r, s * random(0.09, 0.15), random(TWO_PI), 1, 1, col);
  }
}

// ---- 6. lemon: one pentagon, apex down, into a wedge ----------------------
function lemonWedgeP(s, col) {
  pentagon(0, 0.05 * s, s * 0.65, PI, 0.7, 1, col);
}

// ---- 7. salt & pepper: a tapered pinch + two falling-grain pentagons -----
function pinchSaltP(s, col) {
  pentagon(0, -0.1 * s, s * 0.5, PI, 0.55, 1.4, col);
  pentagon(0.05 * s, 0.7 * s, s * 0.08, 0, 1, 1, col);
  pentagon(-0.04 * s, 0.85 * s, s * 0.06, 0, 1, 1, col);
}

// ---- 8. leek: a stack of flattened band-pentagons + frilly top -----------
function leekP(s, col) {
  for (let i = 0; i < 4; i++) {
    let y = lerp(0.55, -0.35, i / 3) * s;
    pentagon(0, y, s * 0.3, 0, 1, 0.5, col);
  }
  for (let i = 0; i < 3; i++) {
    let side = i - 1; // -1, 0, 1
    pentagon(side * 0.18 * s, -0.75 * s, s * 0.16, side * 0.5, 0.4, 1.4, col);
  }
}

// ---- 9. fennel bulb: one bulb-pentagon + thin frond-pentagons ------------
function fennelBulbP(s, col) {
  pentagon(0, 0.15 * s, s * 0.55, 0, 1, 0.85, col);
  for (let i = 0; i < 3; i++) {
    let side = i - 1;
    pentagon(side * 0.22 * s, -0.55 * s, s * 0.14, side * 0.4, 0.35, 1.5, col);
  }
}

// ---- 10. garlic: one elongated, upright pentagon --------------------------
function garlicCloveP(s, col) {
  pentagon(0, 0, s * 0.5, 0, 0.75, 1.3, col);
}

// ---- 11. carrot: one tapered pentagon (apex down) + two frond-pentagons --
function carrotConeP(s, col) {
  pentagon(0, 0.1 * s, s * 0.55, PI, 0.5, 1.5, col);
  pentagon(-0.12 * s, -0.75 * s, s * 0.12, -0.3, 0.4, 1.3, col);
  pentagon(0.12 * s, -0.75 * s, s * 0.12, 0.3, 0.4, 1.3, col);
}

// ---- 12. celery: one long narrow pentagon + a lighter groove-pentagon ----
function celeryRibP(s, col) {
  pentagon(0, 0, s * 0.5, 0, 0.4, 1.6, col);
  stroke(bgColour);
  strokeWeight(s * 0.04);
  strokeCap(ROUND);
  line(0, -0.6 * s, 0, 0.55 * s);
}

// ---- 13. chicken stock: 3 overlapping flattened pentagons, one puddle ---
function stockPuddleP(s, col) {
  pentagon(-0.3 * s, 0, s * 0.4, 0.3, 1.3, 0.4, col);
  pentagon(0.15 * s, 0.05 * s, s * 0.45, -0.2, 1.3, 0.4, col);
  pentagon(0.4 * s, -0.05 * s, s * 0.3, 0.1, 1.2, 0.4, col);
}

// ---- 14. orzo/pasta: a jumble of small elongated pentagons ---------------
function pastaTangleP(s, col) {
  for (let i = 0; i < 6; i++) {
    let x = random(-0.45, 0.45) * s;
    let y = random(-0.45, 0.45) * s;
    pentagon(x, y, s * random(0.18, 0.26), random(TWO_PI), 0.35, 1.3, col);
  }
}

// ---- 15. mixing bowl: one wide pentagon, apex down and squashed ----------
function mixingBowlP(s, col) {
  pentagon(0, 0.1 * s, s * 0.75, PI, 1.15, 0.7, col);
}

// ---- 16. baking tray: one pentagon squashed flat and wide ----------------
function bakingTrayP(s, col) {
  pentagon(0, 0, s * 0.6, 0, 1.6, 0.55, col);
}

// ---- 17. frying pan: one round-ish pentagon body + a handle-pentagon ----
function fryingPanP(s, col) {
  pentagon(-0.05 * s, 0, s * 0.5, 0.2, 1, 1, col);
  pentagon(0.65 * s, -0.05 * s, s * 0.18, HALF_PI, 2.2, 0.4, col);
}

// ---- 18. pot with lid: body-pentagon + lid-pentagon + knob-pentagon -----
function potWithLidP(s, col) {
  pentagon(0, 0.15 * s, s * 0.55, PI, 1, 0.9, col);
  pentagon(0, -0.35 * s, s * 0.5, 0, 1, 0.35, col);
  pentagon(0, -0.52 * s, s * 0.09, 0, 1, 1, col);
}

// ============================================================================
// oven set, pentagon style: same 12 elements as the top of the file, rebuilt
// as calls to pentagon() only — outline, screenStrokeWeight, no fill
// ============================================================================

// ---- 1. coil-loop: a zigzag chain of elongated pentagons ------------------
function coilLoopP(s, col) {
  pentagon(-0.55 * s, -0.45 * s, s * 0.32, radians(20), 1.4, 0.35, col);
  pentagon(-0.15 * s, 0.05 * s, s * 0.32, radians(-70), 1.4, 0.35, col);
  pentagon(0.25 * s, -0.35 * s, s * 0.32, radians(20), 1.4, 0.35, col);
  pentagon(0.55 * s, 0.1 * s, s * 0.32, radians(-70), 1.4, 0.35, col);
}

// ---- 2. dot-field slab: one flat pentagon + scattered tiny pentagons -----
function dotFieldSlabP(s, col) {
  pentagon(0, 0, s * 0.7, 0, 1.25, 0.75, col);
  for (let i = 0; i < 9; i++) {
    let x = random(-0.55, 0.55) * s;
    let y = random(-0.35, 0.35) * s;
    pentagon(x, y, s * 0.08, random(TWO_PI), 1, 1, col);
  }
}

// ---- 3. ribbed tray: one tray-pentagon + thin rib-pentagons --------------
function ribbedTrayP(s, col) {
  pentagon(0, 0.05 * s, s * 0.65, 0, 1.15, 0.8, col);
  for (let i = 0; i < 3; i++) {
    let y = lerp(-0.25, 0.35, i / 2) * s;
    pentagon(0, y, s * 0.4, 0, 1.1, 0.12, col);
  }
}

// ---- 4. radial vent disc: one disc-pentagon + scattered tiny holes ------
function radialVentDiscP(s, col) {
  pentagon(0, 0, s * 0.7, 0, 1, 1, col);
  for (let i = 0; i < 10; i++) {
    let a = random(TWO_PI);
    let r = random(0.15, 0.55) * s + (cos(a) > 0 ? s * 0.08 : 0);
    pentagon(cos(a) * r, sin(a) * r, s * random(0.06, 0.12), random(TWO_PI), 1, 1, col);
  }
}

// ---- 5. pinwheel: 4 blade-pentagons radiating from a hub-pentagon -------
function pinwheelP(s, col) {
  let baseAngles = [0, HALF_PI, PI, PI + HALF_PI];
  for (let a of baseAngles) {
    let jitterA = a + random(-0.2, 0.2);
    pentagon(cos(jitterA) * 0.35 * s, sin(jitterA) * 0.35 * s, s * 0.4, jitterA, 1.5, 0.35, col);
  }
  pentagon(0, 0, s * 0.18, 0, 1, 1, col);
}

// ---- 6. hook-latch: a stem-pentagon + an angled foot-pentagon -----------
function hookLatchP(s, col) {
  pentagon(0, -0.35 * s, s * 0.4, 0, 0.5, 1.3, col);
  pentagon(0.3 * s, 0.4 * s, s * 0.35, radians(50), 1.1, 0.6, col);
}

// ---- 7. tilted pane: one pentagon, squashed into a rectangle and rotated -
function tiltedPaneP(s, col) {
  pentagon(0, 0, s * 0.75, radians(15), 1, 1.25, col);
}

// ---- 8. callout dot: a big pentagon + a small tab-pentagon on its edge --
function calloutDotP(s, col) {
  pentagon(0, 0, s * 0.72, 0, 1, 1, col);
  pentagon(0.55 * s, 0.1 * s, s * 0.22, 0, 1, 1, col);
}

// ---- 9. dash-ghost: a solid pentagon + its dashed hidden-line twin ------
function dashGhostP(s, col) {
  pentagon(0.28 * s, 0.28 * s, s * 0.28, 0, 1, 1, col);

  // pentagon() resets stroke/weight on pop(), so set them again for the
  // dashed twin (drawn by hand since pentagon() only offers a solid stroke)
  stroke(col);
  strokeWeight(screenStrokeWeight);
  let n = 5;
  let gpts = [];
  for (let i = 0; i < n; i++) {
    let a = (i / n) * TWO_PI - HALF_PI;
    gpts.push([cos(a) * s * 0.4 - 0.28 * s, sin(a) * s * 0.4 - 0.28 * s]);
  }
  for (let i = 0; i < n; i++) {
    let p1 = gpts[i];
    let p2 = gpts[(i + 1) % n];
    dashedLine(p1[0], p1[1], p2[0], p2[1], s * 0.12);
  }
}

// ---- 10. cross-bolt: a head-pentagon + two crossed bar-pentagons -------
function crossBoltP(s, col) {
  pentagon(0, 0, s * 0.65, 0, 1, 1, col);
  pentagon(0, 0, s * 0.5, 0, 1.3, 0.22, col);
  pentagon(0, 0, s * 0.5, HALF_PI, 1.3, 0.22, col);
}

// ---- 11. bent bracket: two elongated pentagons meeting at a right angle -
function bentBracketP(s, col) {
  pentagon(-0.25 * s, -0.3 * s, s * 0.45, 0, 0.45, 1.35, col);
  pentagon(0.2 * s, 0.35 * s, s * 0.45, HALF_PI, 0.45, 1.35, col);
}

// ---- 12. flagged probe: a chain of small pentagons + a flag-pentagon ----
function flaggedProbeP(s, col) {
  pentagon(-0.5 * s, 0.65 * s, s * 0.18, radians(20), 0.4, 1.3, col);
  pentagon(-0.25 * s, 0.15 * s, s * 0.18, radians(-20), 0.4, 1.3, col);
  pentagon(0, -0.35 * s, s * 0.18, radians(15), 0.4, 1.3, col);
  pentagon(0.25 * s, -0.65 * s, s * 0.2, radians(30), 0.7, 0.9, col);
}
