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

let cols = 4
let rows = 3
let cellW, cellH
let headerH, gridTop, gridLeft
let extraColW, bottomRowH

let strokeColour
let bgColour
let seedColour // single dark-blue seed every module's colour is a slight offset of

// every tower gets queued here instead of drawn immediately, so that once
// the whole sketch's set of towers is known, exactly 4 of them (chosen at
// random from the total) can be picked out for the colour treatment below
let towerQueue = []

// grid cells the tower instances sit in
let towerGrids = [2, 4, 5, 6, 7, 8, 10]

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1) // keep the pixels[] buffer 1:1 with logical coordinates for drawSolidEdgeOutline()'s loadPixels() sampling
  colorMode(HSB, 360, 100, 100)
  rectMode(CENTER)
  //randomSeed(10); // keep the random chamfers/lean directions stable across resizes

  strokeColour = color(0, 0, 0)
  bgColour = color(0, 0, 100)
  seedColour = color(240, 75, 60) // dark indigo blue
}

// ported from sketch.js's computeLayout(), extended with a matching column
// on the left (same width as the far-right one) and a row at the bottom
// (triple the header row's height). headerH + bottomRowH (3x headerH) is
// exactly cellH, so the height side reduces to cellH * (rows + 1).
function computeLayout() {
  cellH = height / (rows + 1)
  headerH = cellH / 4
  bottomRowH = headerH * 3
  extraColW = headerH // left/right side columns: same width as the header row's height
  cellW = (width - extraColW * 2) / cols
  gridTop = headerH
  gridLeft = extraColW
}

function draw() {
  computeLayout()
  background(bgColour)

  towerQueue = []

  for (let i = 0; i < towerGrids.length; i++) {
    let index = towerGrids[i]
    let row = floor((index - 1) / cols)
    let col = (index - 1) % cols
    let x = gridLeft + cellW * (col + 0.5)
    let y = gridTop + cellH * (row + 0.5)

    if (index === 2) {
      drawCenterFacingTowers(x, y, cellW, cellH)
      drawEdgeTower(x, y, cellW, cellH, 'top', 0.5)
      drawEdgeTower(x, y, cellW, cellH, 'left', 0.5)
      drawEdgeTower(x, y, cellW, cellH, 'right', 0.5)
    } else if (index === 4) {
      drawMiniGridTowers(x, y, cellW, cellH)
    } else {
      for (let side of ['top', 'bottom', 'left', 'right']) {
        drawEdgeTower(x, y, cellW, cellH, side)
      }
    }
  }

  // grid 1: a single module on its own, no edges/rotation, just centred
  let x1 = gridLeft + cellW * 0.5
  let y1 = gridTop + cellH * 0.5 + cellH * 0.2 // slightly low, so the tower's upward growth has room
  drawTower(x1, y1, cellW * 0.35, cellH * 0.3, 0)

  // grid 1: also add edge-anchored modules on its top and left edges
  // (scaled down to match grid 4's mini-grid modules)
  let y1Centre = gridTop + cellH * 0.5
  drawEdgeTower(x1, y1Centre, cellW, cellH, 'top', 0.5)
  drawEdgeTower(x1, y1Centre, cellW, cellH, 'left', 0.5)

  // grid 3: top edge
  let x3 = gridLeft + cellW * 2.5
  let y3 = gridTop + cellH * 0.5
  drawEdgeTower(x3, y3, cellW, cellH, 'top', 0.5)

  // grid 9: bottom and left edges
  let x9 = gridLeft + cellW * 0.5
  let y9 = gridTop + cellH * 2.5
  drawEdgeTower(x9, y9, cellW, cellH, 'bottom', 0.5)
  drawEdgeTower(x9, y9, cellW, cellH, 'left', 0.5)

  // grid 11: bottom edge
  let x11 = gridLeft + cellW * 2.5
  let y11 = gridTop + cellH * 2.5
  drawEdgeTower(x11, y11, cellW, cellH, 'bottom', 0.5)

  // grid 12: bottom and right edges
  let x12 = gridLeft + cellW * 3.5
  let y12 = gridTop + cellH * 2.5
  drawEdgeTower(x12, y12, cellW, cellH, 'bottom', 0.5)
  drawEdgeTower(x12, y12, cellW, cellH, 'right', 0.5)

  // grid 12: also the top two mini-grids relocated from grid 4, aligned
  // with grid 12's own top edge (same relative offset grid 4 used for its
  // top row, just against grid 12's centre instead)
  let miniW12 = cellW / 2
  let miniH12 = cellH / 2
  for (let qCol = 0; qCol < 2; qCol++) {
    let miniCx12 = x12 - cellW / 4 + qCol * (cellW / 2)
    let miniCy12 = y12 - cellH / 4
    drawMiniGridCell(miniCx12, miniCy12, miniW12, miniH12)
  }

  drawModuleTabs()

  flushTowerQueue()

  // sampled by loadPixels() before the grid borders exist, so those thin
  // lines never register as 'solid' and disrupt the outline tracing
  drawSolidEdgeOutline()

  //drawGridStructure()

  noLoop()
}

// every drawTower() call above just queued itself — now that the whole
// sketch's tower list is known, every tower gets its own colour: a slight
// (10%) random offset of the single dark-blue seedColour, so the whole
// sketch reads as one consistent palette rather than a few colour accents
// against plain black.
function flushTowerQueue() {
  let n = towerQueue.length

  // 15% of all stacks (independent of colour) get the base-level edge comb
  // — see drawEdgeCombLines()
  let combCount = round(n * 0.15)
  let combIndices = new Set()
  while (combIndices.size < min(combCount, n)) {
    combIndices.add(floor(random(n)))
  }

  for (let i = 0; i < n; i++) {
    let t = towerQueue[i]
    let baseColour = randomNearColour(seedColour, 0.1)
    renderTower(
      t.baseCx,
      t.baseCy,
      t.w,
      t.h,
      t.rot,
      baseColour,
      combIndices.has(i),
    )
  }
}

// the single module used as tabs: one pair per grid (5 and 7), each pair
// straddling that grid's top and bottom edges — bottom edge on the shared
// edge, growing outward into the neighbouring grid (1/3 above, 9/11 below)
function drawModuleTabs() {
  let tabW = cellW * 0.35
  let tabH = cellH * 0.3

  for (let gridCol of [0, 2]) {
    // grid 5 (col 0) and grid 7 (col 2), both row 1
    let x = gridLeft + cellW * (gridCol + 0.5)
    let topY = gridTop + cellH * 1 // shared edge with grid 1/3 above
    let bottomY = gridTop + cellH * 2 // shared edge with grid 9/11 below

    // bottom edge of the module on the grid's top edge, growing up
    drawTower(x, topY - tabH / 2, tabW, tabH, 0)

    // top edge of the module on the grid's bottom edge, growing down
    drawTower(x, bottomY + tabH / 2, tabW, tabH, PI)
  }
}

// borders — ported structure from sketch.js, no fill/decoration — plus the
// 1-12 debug numbering on the main grid cells, same as sketch.js's drawGrid().
// Also draws the far-left column and bottom row, both outside the main
// 12-grid structure (same as the pre-existing header row / far-right column).
function drawGridStructure() {
  noFill()
  stroke(strokeColour)
  strokeWeight(1)

  for (let col = 0; col < cols; col++) {
    rect(gridLeft + cellW * (col + 0.5), headerH / 2, cellW, headerH)
  }

  let index = 1
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = gridLeft + cellW * (col + 0.5)
      let y = gridTop + cellH * (row + 0.5)
      //rect(x, y, cellW, cellH);

      noStroke()
      fill(strokeColour)
      textAlign(CENTER, CENTER)
      textSize(12)
      //text(index, x, y)
      noFill()
      stroke(strokeColour)

      index++
    }
  }

  // far-right column
  let rightX = gridLeft + cellW * cols + extraColW / 2
  for (let row = 0; row < rows; row++) {
    rect(rightX, gridTop + cellH * (row + 0.5), extraColW, cellH)
  }

  // far-left column (mirrors the far-right one)
  let leftX = extraColW / 2
  for (let row = 0; row < rows; row++) {
    rect(leftX, gridTop + cellH * (row + 0.5), extraColW, cellH)
  }

  // bottom row (mirrors the header row, at 3x its height)
  let bottomY = gridTop + cellH * rows + bottomRowH / 2
  for (let col = 0; col < cols; col++) {
    rect(gridLeft + cellW * (col + 0.5), bottomY, cellW, bottomRowH)
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight)
}

// places a tower so its flat (local bottom, anchor) edge sits at
// (anchorX, anchorY), facing in whatever direction 'rot' points it —
// the shared math behind both drawCenterFacingTowers() and
// drawQuadrantTowers() below
function drawAnchoredTower(anchorX, anchorY, w, h, rot) {
  let baseCx = anchorX + (h / 2) * sin(rot)
  let baseCy = anchorY - (h / 2) * cos(rot)
  drawTower(baseCx, baseCy, w, h, rot)
}

// grid 2's flipped test: 4 modules whose flat (anchor) edge sits at the
// grid's own centre point, each facing outward — up, down, left, right —
// instead of anchored at the cell's outer edges and growing inward
function drawCenterFacingTowers(cx, cy, cellW, cellH) {
  let wUD = cellW * 0.35
  let hUD = cellH * 0.3
  let wLR = cellH * 0.35 // axes swap once rotated 90 degrees
  let hLR = cellW * 0.3

  drawAnchoredTower(cx, cy, wUD, hUD, 0) // up
  drawAnchoredTower(cx, cy, wUD, hUD, PI) // down
  drawAnchoredTower(cx, cy, wLR, hLR, -HALF_PI) // left
  drawAnchoredTower(cx, cy, wLR, hLR, HALF_PI) // right
}

// grid 4: split into 2 mini-grids (bottom row only — the top row now sits
// at the top of grid 12 instead), each getting exactly one module per edge,
// flat edge against the outer edge, growing inward — 4 edges x 2 mini-grids
// = 8 module stacks total
function drawMiniGridTowers(cx, cy, cellW, cellH) {
  let miniW = cellW / 2
  let miniH = cellH / 2

  for (let qCol = 0; qCol < 2; qCol++) {
    let miniCx = cx - cellW / 4 + qCol * (cellW / 2)
    let miniCy = cy + cellH / 4 // bottom row only
    drawMiniGridCell(miniCx, miniCy, miniW, miniH)
  }
}

// one mini-grid's worth of modules: a single module on each of its 4 edges
// — shared by grid 4's mini-grids and grid 12's relocated top row
function drawMiniGridCell(miniCx, miniCy, miniW, miniH) {
  for (let side of ['top', 'bottom', 'left', 'right']) {
    drawSingleEdgeTower(miniCx, miniCy, miniW, miniH, side)
  }
}

// exactly one module flush against a cell's edge, growing inward — the
// single-module counterpart to drawEdgeTower()'s 1-or-3-module logic,
// reusing drawAnchoredTower()'s anchor-at-a-point math with the anchor
// placed at the edge's own midpoint
function drawSingleEdgeTower(cx, cy, cellW, cellH, side) {
  let edgeLength = side === 'left' || side === 'right' ? cellH : cellW
  let w = random(edgeLength * 0.3, edgeLength)
  let h = cellH * random(0.15, 0.3)

  if (side === 'bottom') {
    drawAnchoredTower(cx, cy + cellH / 2, w, h, 0)
  } else if (side === 'top') {
    drawAnchoredTower(cx, cy - cellH / 2, w, h, PI)
  } else if (side === 'left') {
    drawAnchoredTower(cx - cellW / 2, cy, w, h, HALF_PI)
  } else {
    // right
    drawAnchoredTower(cx + cellW / 2, cy, w, h, -HALF_PI)
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
  let edgeLength = side === 'left' || side === 'right' ? cellH : cellW
  let sizeLength = edgeLength * scale

  // one depth factor per edge (0.6-1x), shared by every module on that
  // edge — so a grid with 4 edges gets 4 independent factors
  let depthFactor = random(0.6, 1)

  // per edge, one of 3 equally likely arrangements: one partial-length
  // module, or three modules (equal or random length)
  let mode = floor(random(3))
  let widths
  if (mode === 0) {
    widths = [random(sizeLength * 0.4, sizeLength)]
  } else if (mode === 1) {
    let w3 = sizeLength / 3
    widths = [w3, w3, w3]
  } else {
    let slot = sizeLength / 3
    widths = [
      random(slot * 0.3, slot),
      random(slot * 0.3, slot),
      random(slot * 0.3, slot),
    ]
  }

  let n = widths.length
  for (let i = 0; i < n; i++) {
    let w = widths[i]
    let h = cellH * random(0.15, 0.3) * scale

    // position along the edge: centred if there's just one, otherwise
    // centred within its own 1/3 slot of the edge
    let along = n === 1 ? 0 : -edgeLength / 2 + (edgeLength / n) * (i + 0.5)

    let baseCx, baseCy, rot
    if (side === 'bottom') {
      rot = 0
      baseCx = cx + along
      baseCy = cy + cellH / 2 - h / 2
    } else if (side === 'top') {
      rot = PI
      baseCx = cx + along
      baseCy = cy - cellH / 2 + h / 2
    } else if (side === 'left') {
      rot = HALF_PI
      baseCx = cx - cellW / 2 + h / 2
      baseCy = cy + along
    } else {
      // right
      rot = -HALF_PI
      baseCx = cx + cellW / 2 - h / 2
      baseCy = cy + along
    }

    drawTower(baseCx, baseCy, w, h, rot)
  }
}

// queues a tower instead of drawing it immediately — see flushTowerQueue()
function drawTower(baseCx, baseCy, w, h, rot) {
  towerQueue.push({ baseCx, baseCy, w, h, rot })
}

// a shade of seedColour: same hue, saturation/brightness each nudged by up
// to +/- pct (clamped 0-100) — reads as the same colour, not a hue shift
function randomNearColour(seedColour, pct) {
  let h = hue(seedColour)
  let range = 100 * pct
  let s = constrain(saturation(seedColour) + random(-range, range), 0, 100)
  let b = constrain(brightness(seedColour) + random(-range, range), 0, 100)
  return color(h, s, b)
}

// the module: 4 chamfered rectangles overlaid from (baseCx, baseCy),
// alternating colour/white, each centred on the top (long) edge of the one
// below — sizes are random fractions of the base shape (0.1-0.6x its width
// and height), not a fixed half of the previous level, so overlay sizes
// and proportions vary independently of each other. rot orients the whole
// tower (base position + growth direction) as one rigid unit. Every tower
// now gets its own baseColour (a slight offset of the shared seedColour,
// picked in flushTowerQueue()) — level 0 uses that colour exactly, and
// every other even level a variation of it (still within 20%).
function renderTower(baseCx, baseCy, w, h, rot, baseColour, addEdgeComb) {
  push()
  translate(baseCx, baseCy)
  rotate(rot)

  let baseW = w
  let baseH = h
  let curCx = 0
  let curCy = 0
  let curW = w
  let curH = h

  let level0ChamferCorner, level0ChamferFrac
  let levelCount = 4

  for (let level = 0; level < levelCount; level++) {
    // white stays white; without a base colour, both black levels are
    // plain black. With one, level 0 is that colour exactly and every
    // other even level is a variation of it.
    let col
    if (level % 2 === 1) {
      col = color(0, 0, 100)
    } else if (!baseColour) {
      col = color(0, 0, 0)
    } else if (level === 0) {
      col = baseColour
    } else {
      col = randomNearColour(baseColour, 0.2)
    }
    let chamferCorner = floor(random(4))
    let chamferFrac = random(0.1, 0.6)

    if (level === 0) {
      level0ChamferCorner = chamferCorner
      level0ChamferFrac = chamferFrac
    }

    drawChamferedRect(curCx, curCy, curW, curH, col, chamferCorner, chamferFrac)

    if (level < levelCount - 1) {
      // next shape's centre lands on the midpoint of this rect's top edge —
      // curCx is unchanged since that midpoint shares the same x
      curCy = curCy - curH / 2
      curW = baseW * random(0.1, 0.6)
      curH = baseH * random(0.1, 0.6)
    }
  }

  // for 1/4 of all stacks (picked in flushTowerQueue()): a comb of
  // perpendicular tick lines around all 5 edges of the base (level 0) shape
  if (addEdgeComb) {
    let basePts = getChamferedRectPoints(
      baseW,
      baseH,
      level0ChamferCorner,
      level0ChamferFrac,
    )
    drawEdgeCombLines(basePts, cellW * 0.025, cellW * 0.025)
  }

  // test: one more overlay on the base module, centred on the edge that's
  // clockwise-next from the top edge (where the first overlay sits) — i.e.
  // the base's right edge (top -> right -> bottom -> left, clockwise).
  // Red for now so it's easy to see; meant to end up white.
  let extraW = baseW * random(0.1, 0.6)
  let extraH = baseH * random(0.1, 0.6)
  drawChamferedRect(
    baseW / 2,
    0,
    extraW,
    extraH,
    color(0, 0, 100),
    floor(random(4)),
    random(0.1, 0.6),
  )

  pop()
}

// the 4 or 5 vertices of a rectangle with exactly one corner chamfered —
// cut inward by the same distance along both edges meeting at that corner,
// that distance being chamferFrac (0.1-0.6x) of the rectangle's short edge.
// Shared by drawChamferedRect() (fill) and drawEdgeCombLines() (base outline).
function getChamferedRectPoints(w, h, chamferCorner, chamferFrac) {
  let hw = w / 2
  let hh = h / 2
  let c = chamferFrac * min(w, h)

  let corners = [
    [-hw, -hh], // top-left
    [hw, -hh], // top-right
    [hw, hh], // bottom-right
    [-hw, hh], // bottom-left
  ]

  let pts = []
  for (let i = 0; i < 4; i++) {
    if (i === chamferCorner) {
      let [x, y] = corners[i]
      let prev = corners[(i + 3) % 4]
      let next = corners[(i + 1) % 4]
      let dPrev = [Math.sign(prev[0] - x), Math.sign(prev[1] - y)]
      let dNext = [Math.sign(next[0] - x), Math.sign(next[1] - y)]
      pts.push([x + dPrev[0] * c, y + dPrev[1] * c])
      pts.push([x + dNext[0] * c, y + dNext[1] * c])
    } else {
      pts.push(corners[i])
    }
  }

  return pts
}

// a rectangle with exactly one corner chamfered — see getChamferedRectPoints()
function drawChamferedRect(cx, cy, w, h, col, chamferCorner, chamferFrac) {
  push()
  translate(cx, cy)
  noStroke()
  fill(col)

  let pts = getChamferedRectPoints(w, h, chamferCorner, chamferFrac)

  beginShape()
  for (let p of pts) vertex(p[0], p[1])
  endShape(CLOSE)

  pop()
}

// a comb of tick marks around every edge of a polygon (here, the base
// shape's 5 edges): one line per 'spacing' interval along each edge,
// starting at that edge's first vertex, each perpendicular to the edge and
// extending outward by 'extend'. Assumes pts are wound consistently (as
// getChamferedRectPoints() produces) so the (uy, -ux) normal always points
// outward regardless of which corner is chamfered.
function drawEdgeCombLines(pts, spacing, extend) {
  stroke(strokeColour)
  strokeWeight(1)

  let n = pts.length
  for (let i = 0; i < n; i++) {
    let p1 = pts[i]
    let p2 = pts[(i + 1) % n]
    let dx = p2[0] - p1[0]
    let dy = p2[1] - p1[1]
    let edgeLen = sqrt(dx * dx + dy * dy)
    if (edgeLen < 0.0001) continue

    let ux = dx / edgeLen
    let uy = dy / edgeLen
    let nx = uy // outward normal
    let ny = -ux

    for (let t = 0; t < edgeLen; t += spacing) {
      let px = p1[0] + ux * t
      let py = p1[1] + uy * t
      line(px, py, px + nx * extend, py + ny * extend)
    }
  }
}

// EXPERIMENTAL — reads the actual rendered canvas (so it automatically
// accounts for every level of every tower and all their overlaps, rather
// than re-deriving geometry) and traces a thin red line just outside every
// solid (non-white) edge, offset 0.06*cellW outward. 'Solid' means anything
// that isn't near-white — black shapes and the 4 random-coloured special
// towers alike. At each boundary sample, the offset point is only marked if
// it's still white itself — i.e. there's an actual white gap to sit in;
// tight corners/narrow gaps with no room are skipped rather than drawn into
// the neighbouring solid shape.
function drawSolidEdgeOutline() {
  loadPixels()

  let step = 3 // sampling grid spacing, in pixels
  let checkRadius = step * 2 // how far out to look for a white neighbour
  let offsetDist = cellW * 0.06
  let whiteThreshold = 240 // r/g/b all above this counts as 'white'

  let dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]

  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      if (!isSolidPixel(x, y, whiteThreshold)) continue

      // outward direction: average of the compass directions that lead to
      // a white neighbour — zero if this point is fully interior (no white
      // nearby), in which case it's not an edge at all
      let dirX = 0,
        dirY = 0
      for (let [dx, dy] of dirs) {
        if (
          !isSolidPixel(
            x + dx * checkRadius,
            y + dy * checkRadius,
            whiteThreshold,
          )
        ) {
          dirX += dx
          dirY += dy
        }
      }

      let len = sqrt(dirX * dirX + dirY * dirY)
      if (len < 0.0001) continue // interior point, or a symmetric pinch — skip

      let nx = dirX / len
      let ny = dirY / len
      let offX = x + nx * offsetDist
      let offY = y + ny * offsetDist

      if (offX < 0 || offX >= width || offY < 0 || offY >= height) continue
      if (isSolidPixel(offX, offY, whiteThreshold)) continue // no white gap here — skip

      // short tangent segment at the offset point, so adjacent samples read
      // as one wrapped line rather than a scatter of dots
      let tx = -ny,
        ty = nx
      let half = step * 0.75

      // three layered passes at the same segment, widest first: black, then
      // white (slightly narrower, so a sliver of black shows as a border),
      // then the red line on top, narrower still
      stroke(0, 0, 0)
      strokeWeight(4)
      line(
        offX - tx * half,
        offY - ty * half,
        offX + tx * half,
        offY + ty * half,
      )

      stroke(0, 0, 100)
      strokeWeight(3)
      line(
        offX - tx * half,
        offY - ty * half,
        offX + tx * half,
        offY + ty * half,
      )

      stroke(0, 100, 100) // red
      strokeWeight(1)
      line(
        offX - tx * half,
        offY - ty * half,
        offX + tx * half,
        offY + ty * half,
      )
    }
  }

  drawEnclosedPocketMarkers(step, whiteThreshold)
}

// finds white space that's fully enclosed by solid shapes on every side —
// i.e. has no path back out to the open background — and marks each
// distinct pocket with a small red circle at its centroid. Placeholder for
// a future drawing element (TBC); for now, just the marker.
function drawEnclosedPocketMarkers(step, whiteThreshold) {
  let gridCols = floor(width / step)
  let gridRows = floor(height / step)

  // classify every sample on the same grid used for the outline pass
  let solid = []
  for (let gy = 0; gy < gridRows; gy++) {
    let row = []
    for (let gx = 0; gx < gridCols; gx++) {
      row.push(isSolidPixel(gx * step, gy * step, whiteThreshold))
    }
    solid.push(row)
  }

  // flood-fill inward from every white cell on the grid's border — anything
  // reached is 'open', i.e. connected to the outer background
  let open = []
  for (let gy = 0; gy < gridRows; gy++) open.push(new Array(gridCols).fill(false))

  let stack = []
  for (let gx = 0; gx < gridCols; gx++) {
    if (!solid[0][gx]) stack.push([gx, 0])
    if (!solid[gridRows - 1][gx]) stack.push([gx, gridRows - 1])
  }
  for (let gy = 0; gy < gridRows; gy++) {
    if (!solid[gy][0]) stack.push([0, gy])
    if (!solid[gy][gridCols - 1]) stack.push([gridCols - 1, gy])
  }

  while (stack.length > 0) {
    let [gx, gy] = stack.pop()
    if (gx < 0 || gy < 0 || gx >= gridCols || gy >= gridRows) continue
    if (open[gy][gx] || solid[gy][gx]) continue
    open[gy][gx] = true
    stack.push([gx + 1, gy], [gx - 1, gy], [gx, gy + 1], [gx, gy - 1])
  }

  // whatever white cells are left (not solid, not reached from the border)
  // are enclosed pockets — group each into its own connected component and
  // mark its centroid
  let visited = []
  for (let gy = 0; gy < gridRows; gy++) visited.push(new Array(gridCols).fill(false))

  noStroke()

  for (let gy = 0; gy < gridRows; gy++) {
    for (let gx = 0; gx < gridCols; gx++) {
      if (solid[gy][gx] || open[gy][gx] || visited[gy][gx]) continue

      let pocket = []
      let fillStack = [[gx, gy]]
      visited[gy][gx] = true
      while (fillStack.length > 0) {
        let [cx, cy] = fillStack.pop()
        pocket.push([cx, cy])
        for (let [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
          if (nx < 0 || ny < 0 || nx >= gridCols || ny >= gridRows) continue
          if (visited[ny][nx] || solid[ny][nx] || open[ny][nx]) continue
          visited[ny][nx] = true
          fillStack.push([nx, ny])
        }
      }

      // blank out any outline lines the earlier pass drew through this
      // pocket (it didn't know yet that this space was enclosed), then
      // stamp the marker on the cleared space
      fill(bgColour)
      for (let [cx, cy] of pocket) {
        rect(cx * step, cy * step, step, step)
      }

      let sumX = 0, sumY = 0
      for (let [cx, cy] of pocket) {
        sumX += cx
        sumY += cy
      }
      let centreX = (sumX / pocket.length) * step
      let centreY = (sumY / pocket.length) * step

      fill(250, 50, 100) // red
      //circle(centreX, centreY, cellW * 0.04)
    }
  }
}

function isSolidPixel(x, y, whiteThreshold) {
  x = constrain(floor(x), 0, width - 1)
  y = constrain(floor(y), 0, height - 1)
  let idx = (y * width + x) * 4
  let r = pixels[idx],
    g = pixels[idx + 1],
    b = pixels[idx + 2]
  return !(r > whiteThreshold && g > whiteThreshold && b > whiteThreshold)
}
