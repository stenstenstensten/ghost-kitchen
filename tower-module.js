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

// EASY CONTROL — set to false to switch off the dashed-outline pass and
// every razor object, leaving just the chamfered-rectangle tower modules
let showRazorAndOutlines = true

// the razor-stack objects placed each draw(), in click order — each
// {x, y, w, h}. A snapshot of the fully-rendered artwork (see the end of
// draw()) plus this list is all the click/tap zoom system needs; it never
// re-runs the generative drawing itself. 12 total: the first batch of 7
// (outlined when they land on white) plus a second, unlined batch of 5.
let razorObjects = []
let artSnapshot = null
let artBounds // non-white extent of artSnapshot — see findContentBounds()

// EXPERIMENT — one dedicated 3-colour palette per razor object (index 0-11,
// matching objects 1-12), white stays the shared alternating background for
// all of them. Hand-picked hues spread around the wheel; each a dark/mid/
// light progression of that hue, echoing the old single-hue steel/paleSteel
// pair but with 3 steps and a distinct colour per object instead of 1 grey
// shared by all. Built in setup() (see below), not here — color() isn't
// available until p5 has initialised, so it can't run at top-level scope.
let razorPalettes = []

// 0 = full view; 1-7 = zoomed to that razorObjects entry. Advanced by a
// click/tap, wrapping back to 0 after the 7th object.
let focusIndex = 0

// frame styling — see renderView() / drawTextBox()
let monoFont = 'IBM Plex Mono' // p5 adds its own quotes, so no fallback list here
let textBlue // dark blue for the box rule and step text, set in setup()
let stripeColours = []
let stripeWidthFrac = 1.3 // stripe width as a multiple of the border thickness

// the recipe shown in the step box: {title, steps: [12 strings]}. Picked
// at random from the recipe repo's ghost-kitchen/index.json, falling back to
// the local recipes/ copy when GitHub can't be reached (or offline).
// Null until loaded — the strip just shows nothing until then.
let recipe = null
let recipeSources = [
  'https://raw.githubusercontent.com/stenstenstensten/recipeRepository/main/ghost-kitchen/',
  'recipes/',
]

async function loadRecipe() {
  for (let base of recipeSources) {
    try {
      let list = await (await fetch(base + 'index.json')).json()
      let file = list[floor(Math.random() * list.length)]
      recipe = await (await fetch(base + file)).json()
      renderView()
      return
    } catch (e) {
      // not there (yet) — try the next source
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1.5) // supersample so the render (and the artSnapshot used for zooming) holds more real detail — isSolidPixel() accounts for this when indexing pixels[]
  colorMode(HSB, 360, 100, 100)
  rectMode(CENTER)
  //randomSeed(10); // keep the random chamfers/lean directions stable across resizes

  strokeColour = color(0, 0, 0)
  bgColour = color(0, 0, 100)
  seedColour = color(240, 75, 60) // dark indigo blue

  razorPalettes = [
    [color(0, 100, 45), color(0, 55, 65), color(0, 35, 85)], // 1: red
    [color(30, 70, 45), color(30, 55, 65), color(30, 35, 85)], // 2: orange
    [color(5, 60, 40), color(5, 50, 60), color(5, 30, 82)], // 3: green
    [color(160, 55, 40), color(160, 45, 60), color(160, 28, 85)], // 4: teal
    [color(215, 60, 45), color(215, 45, 65), color(215, 28, 88)], // 5: blue
    [color(270, 55, 40), color(270, 40, 62), color(270, 25, 85)], // 6: purple
    [color(325, 60, 45), color(325, 45, 68), color(325, 28, 90)], // 7: pink
    // 8-12: the second, unlined batch — 5 more hues interspersed with the
    // ones above so all 12 stay visually distinct
    [color(15, 65, 42), color(15, 50, 63), color(15, 32, 87)], // 8: rust
    [color(60, 55, 45), color(60, 42, 68), color(60, 25, 88)], // 9: olive/yellow
    [color(130, 55, 40), color(130, 42, 62), color(130, 25, 85)], // 10: leaf green
    [color(245, 55, 42), color(245, 42, 64), color(245, 25, 88)], // 11: indigo
    [color(350, 60, 45), color(350, 45, 66), color(350, 28, 90)], // 12: crimson
  ]

  textBlue = color(240, 80, 35)

  loadRecipe()
  // canvas text only uses a web font once it's loaded — redraw when it is
  document.fonts.load('16px "IBM Plex Mono"').then(() => renderView())
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

  razorObjects = []

  if (showRazorAndOutlines) {
    // sampled by loadPixels() before the grid borders exist, so those thin
    // lines never register as 'solid' and disrupt the outline tracing
    drawSolidEdgeOutline()

    //drawGridStructure()

    // composition test: where future recipe elements (chicken, cabbage, stock,
    // herbs etc.) will hover — drawn last, on top of everything, as plain
    // 'hovering disc' placeholders
    //drawRecipeElementTestCircles()

    // EXPERIMENT: razor-inspired base modules for future recipe elements,
    // separate from the oven structure's chamfered-rectangle towers. 12
    // instances, each hunting for a white-or-solid uniform patch wide enough
    // to hold it (shrinking to fit if needed), restricted to the 12 main
    // grids only — not the header row, bottom strip, or left/right columns.
    // Never rotated. Any instance that lands on white gets the same
    // dashed-halo outline treatment as the tower modules, in its own
    // palette colour.
    loadPixels() // fresh snapshot — includes the outline pass drawn just above
    let whiteThreshold = 240
    // both dimensions driven off the same base (the smaller of cellW/cellH),
    // so the objects stay roughly square regardless of the screen's aspect ratio
    let razorBase = min(cellW, cellH)
    let maxRazorW = razorBase * 0.45
    let maxRazorH = razorBase * 0.45
    let minRazorW = razorBase * 0.12
    let minRazorH = razorBase * 0.12
    let mainGridBounds = {
      minX: gridLeft,
      maxX: gridLeft + cellW * cols,
      minY: gridTop,
      maxY: gridTop + cellH * rows,
    }

    for (let i = 0; i < 12; i++) {
      let spot = findOpenSpot(
        maxRazorW,
        maxRazorH,
        minRazorW,
        minRazorH,
        whiteThreshold,
        mainGridBounds,
        razorObjects,
      )
      if (!spot) continue

      // renderRazorRingTower (the circular/capsule one) is on hold — keeping
      // the function defined for later, just not in the current distribution
      renderRazorNotchTower(spot.x, spot.y, spot.w, spot.h, 0, i)
      razorObjects.push({ x: spot.x, y: spot.y, w: spot.w, h: spot.h })
      //drawRazorLabel(spot.x, spot.y, spot.w, spot.h, razorObjects.length)

      loadPixels() // refresh so we can trace this object's own edges, and so the next spot search sees it too

      if (spot.onWhite) {
        drawRazorObjectOutline(
          spot.x,
          spot.y,
          spot.w,
          spot.h,
          razorPalettes[i][0],
        )
        loadPixels() // the outline itself changed pixels — refresh again
      }
    }
  }

  noLoop()

  // freeze the fully-rendered artwork so the click/tap zoom system (see
  // mouseClicked()/renderView()) can pan/scale it without ever re-running
  // the (expensive) generative drawing above
  artSnapshot = get()
  artBounds = findContentBounds()

  // airmail border stripe colours, picked once per generation: half shades
  // of the indigo seed, half the baubles' own dark palette colours
  stripeColours = []
  for (let i = 0; i < 200; i++) {
    // 45% indigo shades, 35% bauble colours, 20% white (an uneven gap)
    let r = random()
    stripeColours.push(
      r < 0.45
        ? randomNearColour(seedColour, 0.1)
        : r < 0.8
          ? random(razorPalettes)[0]
          : color(0, 0, 100),
    )
  }

  focusIndex = 0
  renderView()
}

// small numbered badge identifying a razor object (1-7), sat just above it
function drawRazorLabel(x, y, w, h, number) {
  let dia = min(cellW, cellH) * 0.16
  let labelY = y - h / 2 - dia * 0.7

  noStroke()
  fill(0, 0, 100)
  stroke(strokeColour)
  strokeWeight(1.5)
  circle(x, labelY, dia)

  noStroke()
  fill(0, 0, 0)
  textAlign(CENTER, CENTER)
  textSize(dia * 0.6)
  text(number, x, labelY)
}

// draws the current view: the full artwork (focusIndex 0), or a zoomed
// crop centred on razorObjects[focusIndex - 1] (1-7) — always reading from
// the cached artSnapshot, never re-running the generative drawing.
function renderView() {
  if (!artSnapshot) return

  // the artwork sits inside the frame: within the airmail border, above
  // the text box — never underneath either
  let f = frameLayout()
  background(bgColour)

  if (focusIndex === 0) {
    // the drawn content (its blank margins trimmed off), scaled to fill the
    // art area edge to edge without stretching — whichever axis overflows
    // gets trimmed evenly from both sides
    let ab = artBounds
    let aspect = f.artW / f.artH
    let cropW = ab.w
    let cropH = ab.h
    if (cropW / cropH > aspect) cropW = cropH * aspect
    else cropH = cropW / aspect
    let cropX = ab.x + (ab.w - cropW) / 2
    let cropY = ab.y + (ab.h - cropH) / 2
    image(artSnapshot, f.artX, f.artY, f.artW, f.artH, cropX, cropY, cropW, cropH)
  } else {
    let obj = razorObjects[focusIndex - 1]
    if (!obj) return

    // crop rectangle keeps the art area's aspect ratio (so the zoomed
    // image never looks stretched), sized around the object with margin
    let aspect = f.artW / f.artH
    let cropH = max(obj.w, obj.h) * 2.5
    let cropW = cropH * aspect
    if (cropW < obj.w * 2.5) {
      cropW = obj.w * 2.5
      cropH = cropW / aspect
    }
    cropW = min(cropW, width)
    cropH = min(cropH, height)

    let cropX = constrain(obj.x - cropW / 2, 0, width - cropW)
    let cropY = constrain(obj.y - cropH / 2, 0, height - cropH)

    image(artSnapshot, f.artX, f.artY, f.artW, f.artH, cropX, cropY, cropW, cropH)
  }

  drawAirmailBorder(f.b)
  if (recipe) drawTextBox(f)
  drawStripeTicks(f.b)
}

// bounding box of everything non-white in the finished artwork, so the
// full view can trim the drawing's blank margins before fitting it
function findContentBounds() {
  loadPixels()
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      if (isSolidPixel(x, y, 240)) {
        minX = min(minX, x)
        maxX = max(maxX, x)
        minY = min(minY, y)
        maxY = max(maxY, y)
      }
    }
  }
  if (maxX <= minX) return { x: 0, y: 0, w: width, h: height }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

// frame geometry shared by renderView() and the text box: border thickness,
// the text box along the bottom inside the border, and the art area above it
function frameLayout() {
  let b = min(width, height) * 0.03
  let gap = 0 // artwork runs right up to the border and text box
  let boxH = (height - b * 2) * 0.12
  let boxX = b
  let boxY = height - b - boxH
  let boxW = width - b * 2
  return {
    b,
    boxX,
    boxY,
    boxW,
    boxH,
    artX: b + gap,
    artY: b + gap,
    artW: width - (b + gap) * 2,
    artH: boxY - gap - (b + gap),
  }
}

// white airmail-envelope border of thick diagonal stripes around the canvas
function drawAirmailBorder(b) {
  noStroke()
  fill(bgColour)
  rectMode(CORNER)
  rect(0, 0, width, b)
  rect(0, height - b, width, b)
  rect(0, 0, b, height)
  rect(width - b, 0, b, height)
  rectMode(CENTER)

  // clip to the border ring, then lay full-canvas diagonal stripes across
  // it — colour, white gap, colour, white gap — like an airmail envelope
  let ctx = drawingContext
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.rect(b, b, width - b * 2, height - b * 2)
  ctx.clip('evenodd')

  // each stripe is a central shape plus 4 translucent copies of it, nudged
  // up, down, left and right — the overlaps build up solid colour in the
  // middle and fade out at the edges, softening them
  let s = b * stripeWidthFrac // stripe width, measured along the edge
  let d = s * 0.15 // how far each copy is nudged
  let offsets = [
    [0, 0],
    [0, -d],
    [0, d],
    [-d, 0],
    [d, 0],
  ]
  let n = ceil((width + height) / s) + 2
  ctx.globalAlpha = 0.35
  for (let i = 0; i < n; i += 2) {
    let c = i * s
    fill(stripeColours[(i / 2) % stripeColours.length])
    for (let [ox, oy] of offsets) {
      quad(
        c + ox, oy,
        c + s + ox, oy,
        c + s - height + ox, height + oy,
        c - height + ox, height + oy,
      )
    }
  }
  ctx.restore() // also resets globalAlpha
}

// a tiny razor-outline-style line (black edge, white body, red core, round
// ends — same layering as traceOutlinePoint()) down the centre of every
// coloured stripe, wherever it crosses the border: from the middle of the
// border to its inside edge, poking a little way into the sketch
function drawStripeTicks(b) {
  let s = b * stripeWidthFrac
  let over = b * 0.35 // how far past the inside edge it pokes
  let n = ceil((width + height) / s) + 2

  // each stripe's centre line is x + y = k; points on it are (x, k - x)
  let segs = []
  for (let i = 0; i < n; i += 2) {
    let k = i * s + s / 2
    // top and bottom bands: run along y
    for (let [y1, y2] of [
      [b / 2, b + over],
      [height - b / 2, height - b - over],
    ]) {
      let x1 = k - y1
      if (x1 > b && x1 < width - b) segs.push([x1, y1, k - y2, y2])
    }
    // left and right bands: run along x
    for (let [x1, x2] of [
      [b / 2, b + over],
      [width - b / 2, width - b - over],
    ]) {
      let y1 = k - x1
      if (y1 > b && y1 < height - b) segs.push([x1, y1, x2, k - x2])
    }
  }

  strokeCap(ROUND)
  for (let [weight, col] of [
    [b * 0.26, color(0, 0, 0)],
    [b * 0.19, color(0, 0, 100)],
    [b * 0.08, color(0, 100, 100)],
  ]) {
    stroke(col)
    strokeWeight(weight)
    for (let [x1, y1, x2, y2] of segs) line(x1, y1, x2, y2)
  }
  noStroke()
}

// the text box, full width inside the border along the bottom: white band,
// then a dark blue rule, then the text — a mono drop cap the full height of
// the text block, then the recipe title (full view) or the zoomed object's
// step
function drawTextBox(f) {
  let isTitle = focusIndex === 0
  let body = isTitle ? recipe.title : recipe.steps[focusIndex - 1]
  if (!body) return

  let x = f.boxX
  let y = f.boxY
  let w = f.boxW
  let boxH = f.boxH

  let whiteBand = f.b * 0.3
  let rule = max(2, f.b * 0.12)

  rectMode(CORNER)
  noStroke()
  fill(bgColour)
  rect(x, y, w, boxH)
  noFill()
  stroke(textBlue)
  strokeWeight(rule)
  rect(x + whiteBand, y + whiteBand, w - whiteBand * 2, boxH - whiteBand * 2)
  rectMode(CENTER)

  let pad = boxH * 0.16
  let left = x + whiteBand + rule + pad
  let top = y + whiteBand + rule + pad
  let right = x + w - whiteBand - rule - pad
  let bottom = y + boxH - whiteBand - rule - pad
  let innerH = bottom - top

  noStroke()
  textFont(monoFont)
  textStyle(NORMAL)

  // drop cap: cap height (~0.7 of the font size) fills the text block
  let capSize = innerH / 0.7
  textSize(capSize)
  textAlign(LEFT, BASELINE)
  fill(textBlue)
  text(body.charAt(0), left, bottom)
  let capW = textWidth(body.charAt(0))

  let textLeft = left + capW + pad * 0.6
  let textW = right - textLeft

  // body text: the title on one line, a step split into two balanced lines.
  // Sized so the lines' cap heights (plus the gaps between them) fill the
  // text block top to bottom, then each line stretched or squeezed
  // horizontally to run the full width of the box
  let lines = isTitle ? [body.slice(1)] : splitBalanced(body.slice(1))
  let n = lines.length
  let size = innerH / (n * 0.7 + (n - 1) * 0.35)
  let capH = size * 0.7
  textSize(size)
  for (let i = 0; i < n; i++) {
    push()
    translate(textLeft, top + capH + i * (capH + size * 0.35))
    scale(textW / textWidth(lines[i]), 1)
    text(lines[i], 0, 0)
    pop()
  }
}

// splits text into two lines at the space nearest its middle
function splitBalanced(str) {
  let mid = str.length / 2
  let best = -1
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ' && (best < 0 || abs(i - mid) < abs(best - mid))) best = i
  }
  if (best < 0) return [str]
  return [str.slice(0, best), str.slice(best + 1)]
}

// click/tap cycles: full view -> object 1 -> object 2 -> ... -> object 7
// -> back to full view. touchStarted() returns false to stop the browser
// from also synthesising a mouseClicked() for the same tap — belt-and-
// braces backed by the debounce in advanceFocus(), since some environments
// fire both handlers for a single click/tap regardless.
function mouseClicked() {
  advanceFocus()
}

function touchStarted() {
  advanceFocus()
  return false
}

let lastAdvanceTime = -1000

function advanceFocus() {
  if (!artSnapshot) return

  let now = millis()
  if (now - lastAdvanceTime < 200) return // collapse duplicate click+touch firings
  lastAdvanceTime = now

  focusIndex = (focusIndex + 1) % (razorObjects.length + 1)
  renderView()
}

// one circle per grid slot in recipeTestGrids, centred in that grid (with a
// vertical nudge — see below), at 40% of the grid's (shorter) dimension —
// a stand-in for where an illustrated recipe element will eventually sit
let recipeTestGrids = [1, 3, 9, 11, 12]

function drawRecipeElementTestCircles() {
  let dia = min(cellW, cellH) * 0.4
  let shift = dia * 0.5 // 50% of the circle's height

  fill(bgColour)
  stroke(strokeColour)
  strokeWeight(2)

  for (let index of recipeTestGrids) {
    let row = floor((index - 1) / cols)
    let col = (index - 1) % cols
    let x = gridLeft + cellW * (col + 0.5)
    let y = gridTop + cellH * (row + 0.5)

    if (index === 1 || index === 3) {
      y -= shift // top row: push up, closer to the top of the grid
    } else {
      y += shift // bottom row (9, 11, 12): push down, closer to the bottom
    }

    circle(x, y, dia)
  }
}

// shared overlay skeleton: sizes are random 0.1-0.6x fractions of the base
// level's w/h, same as before. Levels no longer march upward — each stays
// centred on the base position, nudged a random amount (0 to 25% of the
// base width) in one of the 4 cardinal directions, computed fresh from
// centre each time rather than drifting cumulatively. drawShape(cx, cy, w,
// h, col) draws one level's shape; colourForLevel(level) picks its fill.
function renderOverlayTower(
  baseCx,
  baseCy,
  w,
  h,
  rot,
  levelCount,
  colourForLevel,
  drawShape,
) {
  push()
  translate(baseCx, baseCy)
  rotate(rot)

  let baseW = w
  let baseH = h
  let curCx = 0
  let curCy = 0
  let curW = w
  let curH = h

  let cardinalDirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  for (let level = 0; level < levelCount; level++) {
    drawShape(curCx, curCy, curW, curH, colourForLevel(level))

    if (level < levelCount - 1) {
      curW = baseW * random(0.1, 0.6)
      curH = baseH * random(0.1, 0.6)

      let [dx, dy] = random(cardinalDirs)
      let mag = random(0, baseW * 0.25)
      curCx = dx * mag
      curCy = dy * mag
    }
  }

  pop()
}

// EXPERIMENT — razor blade #1: a rounded capsule with a circular hole
// punched through the middle via erase()/noErase(), which reveals whatever
// was drawn earlier (background, or previous levels of this same stack) —
// echoing the razor's central hole. Colour alternates with white, same as
// the original chamfered-rect tower. EXPERIMENT: 7 levels now (was 5) — one
// more solid, one more white — and paletteIndex picks this object's own
// 3-colour palette from razorPalettes, cycling across the 4 solid levels.
function renderRazorRingTower(baseCx, baseCy, w, h, rot, paletteIndex) {
  let colourForLevel = razorColourForLevel(paletteIndex)
  renderOverlayTower(
    baseCx,
    baseCy,
    w,
    h,
    rot,
    7,
    colourForLevel,
    drawRazorRing,
  )
}

// white on odd levels; the 4 solid (even) levels cycle through this
// object's 3-colour palette (0, 2, 4, 6 -> palette[0, 1, 2, 0])
function razorColourForLevel(paletteIndex) {
  let palette = razorPalettes[paletteIndex % razorPalettes.length]
  return (level) => {
    if (level % 2 === 1) return color(0, 0, 100)
    let solidIndex = level / 2
    return palette[solidIndex % palette.length]
  }
}

function drawRazorRing(cx, cy, w, h, col) {
  push()
  translate(cx, cy)
  noStroke()
  fill(col)
  rect(0, 0, w, h, min(w, h) / 2)

  erase()
  circle(0, 0, min(w, h) * 0.55)
  noErase()

  pop()
}

// EXPERIMENT — razor blade #2: a rectangle with a small step-notch cut into
// each of its 4 corners (rather than one big diagonal chamfer) — echoing
// the razor outline's clipped/tabbed corners. Same 7-level / palette-per-
// object treatment as renderRazorRingTower() above.
function renderRazorNotchTower(baseCx, baseCy, w, h, rot, paletteIndex) {
  let colourForLevel = razorColourForLevel(paletteIndex)
  renderOverlayTower(
    baseCx,
    baseCy,
    w,
    h,
    rot,
    7,
    colourForLevel,
    drawRazorNotch,
  )
}

function drawRazorNotch(cx, cy, w, h, col) {
  push()
  translate(cx, cy)
  noStroke()
  fill(col)

  let pts = getRazorNotchPoints(w, h)
  beginShape()
  for (let p of pts) vertex(p[0], p[1])
  endShape(CLOSE)

  pop()
}

function getRazorNotchPoints(w, h) {
  let hw = w / 2
  let hh = h / 2
  let n = min(w, h) * 0.15 // notch size

  return [
    [-hw + n, -hh],
    [hw - n, -hh],
    [hw - n, -hh + n],
    [hw, -hh + n],
    [hw, hh - n],
    [hw - n, hh - n],
    [hw - n, hh],
    [-hw + n, hh],
    [-hw + n, hh - n],
    [-hw, hh - n],
    [-hw, -hh + n],
    [-hw + n, -hh + n],
  ]
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
  redraw() // draw() calls computeLayout() itself; redraw() re-runs draw() once despite noLoop()
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
let compassDirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

// the per-point half of the outline trace, factored out so both the
// full-canvas pass (drawSolidEdgeOutline()) and the per-object pass
// (drawRazorObjectOutline()) share it. If (x, y) is a solid boundary point
// with a white gap to sit in, draws the layered black/white/accent tangent
// segment there; otherwise does nothing.
function traceOutlinePoint(
  x,
  y,
  step,
  checkRadius,
  offsetDist,
  whiteThreshold,
  accentColour,
) {
  if (!isSolidPixel(x, y, whiteThreshold)) return

  // outward direction: average of the compass directions that lead to a
  // white neighbour — zero if this point is fully interior (no white
  // nearby), in which case it's not an edge at all
  let dirX = 0,
    dirY = 0
  for (let [dx, dy] of compassDirs) {
    if (
      !isSolidPixel(x + dx * checkRadius, y + dy * checkRadius, whiteThreshold)
    ) {
      dirX += dx
      dirY += dy
    }
  }

  let len = sqrt(dirX * dirX + dirY * dirY)
  if (len < 0.0001) return // interior point, or a symmetric pinch — skip

  let nx = dirX / len
  let ny = dirY / len
  let offX = x + nx * offsetDist
  let offY = y + ny * offsetDist

  if (offX < 0 || offX >= width || offY < 0 || offY >= height) return
  if (isSolidPixel(offX, offY, whiteThreshold)) return // no white gap here — skip

  // short tangent segment at the offset point, so adjacent samples read as
  // one wrapped line rather than a scatter of dots
  let tx = -ny,
    ty = nx
  let half = step * 0.75

  // three layered passes at the same segment, widest first: black, then
  // white (slightly narrower, so a sliver of black shows as a border),
  // then the accent colour on top, narrower still
  stroke(0, 0, 0)
  strokeWeight(4)
  line(offX - tx * half, offY - ty * half, offX + tx * half, offY + ty * half)

  stroke(0, 0, 100)
  strokeWeight(3)
  line(offX - tx * half, offY - ty * half, offX + tx * half, offY + ty * half)

  stroke(accentColour)
  strokeWeight(1)
  line(offX - tx * half, offY - ty * half, offX + tx * half, offY + ty * half)
}

function drawSolidEdgeOutline() {
  loadPixels()

  let step = 3 // sampling grid spacing, in pixels
  let checkRadius = step * 2 // how far out to look for a white neighbour
  let offsetDist = cellW * 0.06
  let whiteThreshold = 240 // r/g/b all above this counts as 'white'
  let accentColour = color(0, 100, 100) // red

  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      traceOutlinePoint(
        x,
        y,
        step,
        checkRadius,
        offsetDist,
        whiteThreshold,
        accentColour,
      )
    }
  }

  drawEnclosedPocketMarkers(step, whiteThreshold)
}

// EXPERIMENT — repeats drawSolidEdgeOutline()'s dashed halo effect around a
// single razor object that landed on white (not the whole canvas), using
// that object's own palette colour as the accent instead of red. Scoped to
// a local box around the object (with margin) rather than a full-canvas
// scan, since only this one object's edges need tracing.
function drawRazorObjectOutline(cx, cy, w, h, accentColour) {
  let step = 3
  let checkRadius = step * 2
  let offsetDist = min(cellW, cellH) * 0.06
  let whiteThreshold = 240
  // just enough reach for the trace itself (checkRadius to sense the
  // boundary direction, offsetDist to place the dash, a little slack) —
  // NOT proportional to the object's own size. A margin sized off the
  // object was scanning (and outlining, in this object's colour) whatever
  // unrelated tower-module edges happened to be nearby, not just this
  // object's own boundary.
  let margin = checkRadius + offsetDist + step * 2

  let minX = max(step, cx - w / 2 - margin)
  let maxX = min(width - step, cx + w / 2 + margin)
  let minY = max(step, cy - h / 2 - margin)
  let maxY = min(height - step, cy + h / 2 + margin)

  for (let y = minY; y < maxY; y += step) {
    for (let x = minX; x < maxX; x += step) {
      traceOutlinePoint(
        x,
        y,
        step,
        checkRadius,
        offsetDist,
        whiteThreshold,
        accentColour,
      )
    }
  }
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
  for (let gy = 0; gy < gridRows; gy++)
    open.push(new Array(gridCols).fill(false))

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
  for (let gy = 0; gy < gridRows; gy++)
    visited.push(new Array(gridCols).fill(false))

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
        for (let [nx, ny] of [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ]) {
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

      let sumX = 0,
        sumY = 0
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

  // pixels[] is (width*density) x (height*density) — but truncated, not
  // rounded, to a whole pixel count: the browser floors (not rounds) when
  // JS assigns canvas.width = width*density, since that's an unsigned-long
  // coercion. round() here was wrong and only happened to work when
  // width*density was already a whole number — otherwise the stride is off
  // by one, and that error compounds down the image into a diagonal shear.
  // p5's pixelWidth/pixelHeight would be the safer source for this, but
  // they aren't bound as globals in this p5 version's global mode. floor()
  // the scaled coords too: at a fractional density, x*density/y*density
  // aren't guaranteed integers, and a fractional array index silently
  // reads as undefined, not a nearby pixel.
  let d = pixelDensity()
  let stride = floor(width * d)
  let px = floor(x * d)
  let py = floor(y * d)
  let idx = 4 * (py * stride + px)
  let r = pixels[idx],
    g = pixels[idx + 1],
    b = pixels[idx + 2]
  return !(r > whiteThreshold && g > whiteThreshold && b > whiteThreshold)
}

// checks every sampled point within a w x h box centred at (cx, cy): if the
// whole box stays inside bounds (defaults to the canvas edges) AND every
// sampled point is the SAME (all white, or all solid — never a mix), returns
// {ok: true, isSolid}; otherwise {ok: false}. EXPERIMENT: previously only
// accepted all-white boxes — now a uniform solid patch (i.e. fully inside a
// tower module, no white showing) counts too.
function isAreaUniform(cx, cy, w, h, whiteThreshold, bounds) {
  let minX = bounds ? bounds.minX : 0
  let maxX = bounds ? bounds.maxX : width
  let minY = bounds ? bounds.minY : 0
  let maxY = bounds ? bounds.maxY : height

  let step = 5
  if (
    cx - w / 2 < minX ||
    cy - h / 2 < minY ||
    cx + w / 2 > maxX ||
    cy + h / 2 > maxY
  ) {
    return { ok: false }
  }

  let firstIsSolid = null
  for (let y = cy - h / 2; y <= cy + h / 2; y += step) {
    for (let x = cx - w / 2; x <= cx + w / 2; x += step) {
      let solid = isSolidPixel(x, y, whiteThreshold)
      if (firstIsSolid === null) {
        firstIsSolid = solid
      } else if (solid !== firstIsSolid) {
        return { ok: false }
      }
    }
  }
  return { ok: true, isSolid: firstIsSolid }
}

// true if two centre-anchored boxes overlap at all
function boxesOverlap(cx1, cy1, w1, h1, cx2, cy2, w2, h2) {
  return (
    Math.abs(cx1 - cx2) < (w1 + w2) / 2 && Math.abs(cy1 - cy2) < (h1 + h2) / 2
  )
}

// searches random points within bounds (defaults to the whole canvas) for
// one with a uniform area (either all white, or all solid) at least
// maxW x maxH that doesn't overlap any box already in placedObjects (each
// {x, y, w, h}) — the white/solid pixel check alone can't tell an empty
// solid patch from one that already has an object sitting on it, so this
// catches that case explicitly. Shrinks the tested box (down to minW x
// minH) before giving up on a point and trying another. Returns
// {x, y, w, h, onWhite} for the first fit found, or null.
function findOpenSpot(
  maxW,
  maxH,
  minW,
  minH,
  whiteThreshold,
  bounds,
  placedObjects,
) {
  let minX = bounds ? bounds.minX : 0
  let maxX = bounds ? bounds.maxX : width
  let minY = bounds ? bounds.minY : 0
  let maxY = bounds ? bounds.maxY : height

  let attempts = 0
  while (attempts < 400) {
    attempts++
    let cx = random(minX, maxX)
    let cy = random(minY, maxY)

    for (let frac = 1; frac >= minW / maxW; frac -= 0.15) {
      let w = maxW * frac
      let h = maxH * frac

      let overlapsPlaced = false
      if (placedObjects) {
        for (let obj of placedObjects) {
          if (boxesOverlap(cx, cy, w, h, obj.x, obj.y, obj.w, obj.h)) {
            overlapsPlaced = true
            break
          }
        }
      }
      if (overlapsPlaced) continue

      let result = isAreaUniform(cx, cy, w, h, whiteThreshold, bounds)
      if (result.ok) {
        return { x: cx, y: cy, w, h, onWhite: !result.isSolid }
      }
    }
  }
  return null
}
