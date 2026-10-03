// grid
let cols = 4
let rows = 3
let cellW, cellH
let extraColW // far-right column's width — set equal to headerH in computeLayout()

// header row above the main grid, one quarter the height of a grid cell
let headerH, gridTop

// unit: one tenth of a grid cell, used as the base measurement for drawing
let unit

// shared stroke style used throughout the sketch
let strokeColour
let baseStrokeWeight

// master traits
let traits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

// the trait (and therefore palette) for this whole generation of the drawing —
// one trait, one palette, used consistently across every element in the sketch
let currentTrait

// colour palettes (12 palettes x 5 colours), one palette per trait
// each colour is [hue, saturation, brightness] — fill these in manually
let paletteData = [
  [
    [40, 8, 96],
    [40, 80, 96],
    [40, 80, 76],
    [40, 88, 96],
    [40, 80, 96],
  ], // A
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // B
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // C
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // D
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // E
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // F
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // G
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // H
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // I
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // J
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // K
  [
    [0, 0, 90],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
    [220, 80, 70],
  ], // L
]

let palettes = []

// fan(): per-ring rotation offset, and per-segment colour choice (0 or 1),
// both chosen once per generation so they stay fixed across frames/resizes
// rather than jittering every draw() call
let fanRingOffsets = []
let fanSegmentColours = []
let fanEdgeSquareCounts = []

// food(): irregular 5-sided proportions for each of the 6 shapes, chosen
// once per generation (one set of 5 radius multipliers per shape)
let foodShapes = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB, 360, 100, 100, 100)
  rectMode(CENTER)

  strokeColour = color(20,80,90)

  computeLayout()

  for (let i = 0; i < paletteData.length; i++) {
    let palette = []
    for (let j = 0; j < paletteData[i].length; j++) {
      let [h, s, b, a] = paletteData[i][j]
      palette.push(color(h, s, b, a === undefined ? 100 : a))
    }
    palettes.push(palette)
  }

  // pick one of the 12 traits/palettes for this generation of the drawing
  // currentTrait = floor(random(traits.length))
  currentTrait = 0 // pinned to trait A while working

  // more rings' worth of offsets/colours than fan() could ever need
  for (let i = 0; i < 20; i++) {
    fanRingOffsets.push(random(TWO_PI))

    let ringColours = []
    for (let j = 0; j < 3; j++) {
      ringColours.push(random() < 0.5 ? 1 : 2)
    }
    fanSegmentColours.push(ringColours)

    fanEdgeSquareCounts.push(floor(random(8, 16))) // 2-5 inclusive
  }

  // 6 irregular pentagons for food(), each with its own random proportions
  for (let i = 0; i < 6; i++) {
    let radii = []
    for (let v = 0; v < 5; v++) {
      radii.push(random(0.6, 1.0))
    }
    foodShapes.push(radii)
  }
}

function computeLayout() {
  // cellH first, since headerH (and therefore the extra column's width and
  // cellW) depends on it
  cellH = height / (rows + 0.25)
  headerH = cellH / 4
  extraColW = headerH // far-right column: same width as the header row's height
  cellW = (width - extraColW) / cols
  gridTop = headerH
  unit = min(cellW, cellH) / 10
  baseStrokeWeight = unit * 0
}

function draw() {
  background(40, 8, 96)

  drawHeaderRow()
  drawGrid()
  drawExtraColumn()
  drawTabs()
  drawFoodEchoes()

  // test: place a saucepan in the centre of grid cell (col 1, row 1)
  let x = cellW * 2.8
  let y = gridTop + cellH * 2.5
  saucepan(x, y)

  // test: place a metal spike, base-centred in grid cell (col 2, row 0)
  let spikeX = cellW * 2.5
  let spikeY = gridTop + cellH * 1
  metalSpike(spikeX, spikeY, unit * 3, unit * 4, unit * 0.5, unit * 1.5)
}

let filledHeaderCols = [1] // column above grid 2

// designs for individual header slots
let headerFunctions = {
  0: paletteSwatch,
  1: controls,
}

function drawHeaderRow() {
  for (let col = 0; col < cols; col++) {
    let x = cellW * (col + 0.5)
    let y = headerH / 2

    if (filledHeaderCols.includes(col)) {
      noStroke()
      fill(palettes[currentTrait][0])
      rect(x, y, cellW, headerH)
    }

    if (headerFunctions[col]) {
      headerFunctions[col](x, y)
    }

    noFill()
    stroke(strokeColour)
    strokeWeight(baseStrokeWeight)
    rect(x, y, cellW, headerH)
  }
}

// grids that get the solid background fill
let filledGrids = [2, 5, 6, 7, 8]

// designs drawn on top of individual grid slots
let gridFunctions = {
  2: fan,
  4: stoveTop,
  6: food,
  8: grill,
  10: door,
}

let crossGrids = [1, 3, 9, 11, 12]

function drawGrid() {
  let index = 1

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = cellW * (col + 0.5)
      let y = gridTop + cellH * (row + 0.5)

      if (filledGrids.includes(index)) {
        noStroke()
        fill(palettes[currentTrait][0])
        rect(x, y, cellW, cellH)
      }

      if (gridFunctions[index]) {
        gridFunctions[index](x, y)
      }

      noFill()
      stroke(strokeColour)
      strokeWeight(baseStrokeWeight)
      rect(x, y, cellW, cellH)

      if (crossGrids.includes(index)) {
        let left = x - cellW / 2
        let right = x + cellW / 2
        let top = y - cellH / 2
        let bottom = y + cellH / 2
        stroke(strokeColour)
        strokeWeight(baseStrokeWeight)
        line(left, top, right, bottom)
        line(right, top, left, bottom)
      }

      noStroke()
      fill(0, 0, 0)
      textAlign(CENTER, CENTER)
      textSize(12)
      text(index, x, y)

      index++
    }
  }
}

// far-right column, added beyond the original 4: 3 empty square cells
// (extraColW === cellH, so each cell here is a square, unlike the
// rectangular cells in the main grid)
function drawExtraColumn() {
  let x = cellW * cols + extraColW / 2

  for (let row = 0; row < rows; row++) {
    let y = gridTop + cellH * (row + 0.5)
    noFill()
    stroke(strokeColour)
    strokeWeight(baseStrokeWeight)
    rect(x, y, extraColW, cellH)
  }
}

function paletteSwatch(x, y) {
  // just the current palette's 5 colours, contained within this header cell
  let colsCount = 5
  let colW = cellW / colsCount
  let rowH = headerH
  let rowGap = rowH * 0.2

  let left = x - cellW / 2
  let top = y - headerH / 2

  for (let c = 0; c < colsCount; c++) {
    let sx = left + colW * (c + 0.5)
    let sy = top + rowH * 0.5

    noStroke()
    fill(palettes[currentTrait][c])
    rect(sx, sy, colW, rowH - rowGap)
  }
}

function stoveTop(x, y) {
  push()
  translate(x, y)

  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  fill(palettes[currentTrait][1]) // circles: colour #2

  let topZoneH = cellH * 0.2
  let lowerZoneH = cellH * 0.8
  let zoneTop = -cellH / 2
  let lowerZoneTop = zoneTop + topZoneH

  // lower 80%: 2x2 grid of evenly spaced circles
  let subCols = 2
  let subRows = 2
  let subW = cellW / subCols
  let subH = lowerZoneH / subRows
  let bigDia = min(subW, subH) * 0.7

  for (let r = 0; r < subRows; r++) {
    for (let c = 0; c < subCols; c++) {
      let cx = -cellW / 2 + subW * (c + 0.5)
      let cy = lowerZoneTop + subH * (r + 0.5)
      circle(cx, cy, bigDia)
    }
  }

  // top 20%: 4 smaller circles in a row
  let smallCount = 4
  let smallW = cellW / smallCount
  let smallDia = min(smallW, topZoneH) * 0.6

  for (let i = 0; i < smallCount; i++) {
    let cx = -cellW / 2 + smallW * (i + 0.5)
    let cy = zoneTop + topZoneH / 2
    circle(cx, cy, smallDia)
  }

  pop()
}

function grill(x, y) {
  push()
  translate(x, y)
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  // snaking line, zigzagging top/bottom for the full width of the grid
  let margin = cellH * 0.15
  let topY = -cellH / 2 + margin
  let bottomY = cellH / 2 - margin
  let leftX = -cellW / 2
  let rightX = cellW / 2
  let turns = 6

  beginShape()
  for (let i = 0; i <= turns; i++) {
    let xPos = lerp(leftX, rightX, i / turns)
    let yPos = i % 2 === 0 ? topY : bottomY
    vertex(xPos, yPos)
  }
  endShape()

  pop()
}

function door(x, y) {
  push()
  translate(x, y)

  let innerW = cellW * 0.6
  let innerH = cellH * 0.6

  // solid colour frame: the full cell minus the inset rectangle, which is
  // left empty rather than filled
  noStroke()
  fill(palettes[currentTrait][0])
  beginShape()
  vertex(-cellW / 2, -cellH / 2)
  vertex(cellW / 2, -cellH / 2)
  vertex(cellW / 2, cellH / 2)
  vertex(-cellW / 2, cellH / 2)
  beginContour()
  vertex(-innerW / 2, -innerH / 2)
  vertex(-innerW / 2, innerH / 2)
  vertex(innerW / 2, innerH / 2)
  vertex(innerW / 2, -innerH / 2)
  endContour()
  endShape(CLOSE)

  // inset rectangle's outline
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  rect(0, 0, innerW, innerH)

  pop()
}

function controls(x, y) {
  push()
  translate(x, y)
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  // this grid is cellW x headerH (much shorter than a regular grid cell),
  // so elements are sized off headerH, not cellH
  let segW = cellW / 3
  let leftX = -cellW / 2 + segW * 0.5
  let midX = -cellW / 2 + segW * 1.5
  let rightX = -cellW / 2 + segW * 2.5
  let dia = headerH * 0.6

  circle(leftX, 0, dia)
  circle(midX, 0, dia)
  rect(rightX, 0, segW * 0.5, headerH * 0.6)

  pop()
}

function chicken() {}

function fan(x, y) {
  push()
  translate(x, y)
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  // concentric rings of 3 arc shapes each, working inward from the outermost
  // ring; each ring is the same thickness, separated by the same gap, and
  // rotated by its own fixed random offset
  let thickness = unit * 0.3
  let ringGap = unit * 0.3
  let outerR = unit * 3.5
  let furthestR = outerR // outer radius of the furthest (outermost) ring, fixed before the loop mutates outerR
  let segments = 3
  let gapAngle = radians(15)
  let segAngle = (TWO_PI - segments * gapAngle) / segments

  let ring = 0
  while (outerR - thickness >= 0) {
    let innerR = outerR - thickness
    let offset = fanRingOffsets[ring % fanRingOffsets.length]
    let ringColours = fanSegmentColours[ring % fanSegmentColours.length]

    // the innermost ring skips the decorations on its inner edge
    let isInnermostRing = outerR - thickness - ringGap - thickness < 0

    for (let i = 0; i < segments; i++) {
      let startAngle = offset + i * (segAngle + gapAngle)
      let endAngle = startAngle + segAngle

      // solid fill, colour 1 or colour 2 of the palette, fixed per generation
      stroke(strokeColour)
      strokeWeight(baseStrokeWeight)
      fill(palettes[currentTrait][ringColours[i]])
      drawArcSegment(startAngle, endAngle, innerR, outerR, !isInnermostRing)
    }

    // small solid squares along the ring's outer edge, aligned with the
    // arc's angle at each point (2-5 per full circuit, fixed per generation)
    let squareCount = fanEdgeSquareCounts[ring % fanEdgeSquareCounts.length]
    for (let i = 0; i < squareCount; i++) {
      let squareAngle = offset + (i / squareCount) * TWO_PI
      drawArcEdgeSquare(squareAngle, outerR)
    }

    outerR -= thickness + ringGap
    ring++
  }

  // two rectangles running from the furthest ring's inner edge out to
  // the grid's top/bottom edge, solid colour #2
  let vRectW = unit * 0.3
  let furthestInnerR = furthestR - thickness
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  fill(palettes[currentTrait][1])

  let bottomRectH = cellH / 2 - furthestInnerR
  rect(0, (furthestInnerR + cellH / 2) / 2, vRectW, bottomRectH)
  rect(0, -(furthestInnerR + cellH / 2) / 2, vRectW, bottomRectH)

  // two metal spikes, based on the grid's left/right edges and pointing
  // inward, ending 0.5*unit short of the furthest ring on each side
  let spikeGap = unit * 0.5
  let spikeLength = cellW / 2 - furthestR - spikeGap
  let spikeW = unit * 0.8
  let spikeRaise = spikeLength * 0.3
  let spikeRectH = spikeLength * 0.5
  let spikeTipOverhang = spikeLength * 0.2

  push()
  translate(-cellW / 2, 0)
  rotate(HALF_PI) // wide edge (base) becomes vertical, parallel to the grid's left edge
  metalSpike(0, 0, spikeW, spikeRectH, spikeTipOverhang, spikeRaise)
  pop()

  push()
  translate(cellW / 2, 0)
  rotate(-HALF_PI) // wide edge (base) becomes vertical, parallel to the grid's right edge
  metalSpike(0, 0, spikeW, spikeRectH, spikeTipOverhang, spikeRaise)
  pop()

  drawChamferedFrame()

  pop()
}

// a rectangle matching the grid's proportions, inset 3*unit from the left
// and right sides and 6*unit from the top; every corner is chamfered, except
// the top-right corner, whose chamfer is 3x the size of the others
function drawChamferedFrame() {
  let left = -cellW / 2 + unit * 0.5
  let right = cellW / 2 - unit * 0.5
  let top = -cellH / 2 + unit * 1
  let bottom = cellH / 2 - unit * 1

  let chamfer = unit * 1
  let chamferTR = chamfer * 3

  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  beginShape()
  vertex(left + chamfer, top)
  vertex(right - chamferTR, top)
  vertex(right, top + chamferTR)
  vertex(right, bottom - chamfer)
  vertex(right - chamfer, bottom)
  vertex(left + chamfer, bottom)
  vertex(left, bottom - chamfer)
  vertex(left, top + chamfer)
  endShape(CLOSE)
}

// a 4-sided 'solid' shape: outer arc, then inner arc walked backwards,
// closed so the two straight radial edges connect them
function drawArcSegment(startAngle, endAngle, innerR, outerR, showInnerDecoration = true) {
  let steps = 12
  beginShape()
  for (let i = 0; i <= steps; i++) {
    let a = lerp(startAngle, endAngle, i / steps)
    vertex(cos(a) * outerR, sin(a) * outerR)
  }
  for (let i = steps; i >= 0; i--) {
    let a = lerp(startAngle, endAngle, i / steps)
    vertex(cos(a) * innerR, sin(a) * innerR)
  }
  endShape(CLOSE)

  // three equally spaced points (both ends + centre) on each arc get a
  // triangle+bridge decoration: outward on the outer arc, inward on the inner
  let positions = [0, 0.5, 1]
  // for (let t of positions) {
  //   let a = lerp(startAngle, endAngle, t)
  //   drawArcDecoration(a, outerR, 1)
  //   if (showInnerDecoration) {
  //     drawArcDecoration(a, innerR, -1)
  //   }
  // }
}

// small equilateral triangle whose near side is tangent to the arc, held off
// the arc by a gap and reconnected to it with a bridging rectangle.
// direction: 1 = away from centre (outer arc), -1 = towards centre (inner arc)
function drawArcDecoration(angle, radius, direction) {
  push()
  rotate(angle) // local x becomes the radial direction, local y the tangent

  let triSide = unit * 0.2
  let triHeight = (triSide * sqrt(3)) / 2
  let gap = unit * 0.05
  let overlap = unit * 0.02

  let baseX = radius + direction * gap
  let apexX = baseX + direction * triHeight

  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  beginShape()
  vertex(baseX, -triSide / 2)
  vertex(baseX, triSide / 2)
  vertex(apexX, 0)
  endShape(CLOSE)

  // bridge: spans from the arc out to just past the triangle's base, so it
  // overlaps the triangle edge instead of leaving a visible seam
  let rectFar = baseX + direction * overlap
  let rectX = (radius + rectFar) / 2
  let rectLen = abs(rectFar - radius)
  rect(rectX, 0, rectLen, triSide * 2)

  pop()
}

// small solid square sitting on the ring's outer edge, rotated so its sides
// align with the radial/tangential directions of the arc at that angle
function drawArcEdgeSquare(angle, radius) {
  push()
  rotate(angle) // local x becomes the radial direction, local y the tangent
  translate(radius, 0)

  let side1 = unit * 0.2
  let side2 = unit * 0.4

  // stroke(strokeColour)
  // strokeWeight(baseStrokeWeight)
  // fill(palettes[currentTrait][1]) // colour #2
  noStroke()
  fill(220,80,70)
  fill(palettes[currentTrait][1])

  rect(0, 0, side1, side2, unit)

  pop()
}

function saucepan(x, y) {
  push()
  translate(x, y)
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  // pan body: circle of 1 unit diameter
  circle(0, 0, unit)

  // handle: diagonal line of 1 unit length, starting at the pan's edge
  let angle = -QUARTER_PI
  let startX = cos(angle) * (unit / 2)
  let startY = sin(angle) * (unit / 2)
  let endX = cos(angle) * (unit / 2 + unit)
  let endY = sin(angle) * (unit / 2 + unit)
  line(startX, startY, endX, endY)

  pop()
}

function herbs() {}

function metalSpike(x, y, w, rectH, tipOverhang, raise) {
  push()
  translate(x, y) // (x, y) is the base (bottom edge) of the solid spike shape

  // the rectangle is raised up off the spike's base, exposing the base beneath it
  let rectBottomY = -raise
  let rectTopY = -raise - rectH

  // 1. hatched rectangle: black outline, no fill
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  rect(0, (rectBottomY + rectTopY) / 2, w, rectH)

  let hatchCount = 6
  for (let i = 1; i < hatchCount; i++) {
    let hy = lerp(rectBottomY, rectTopY, i / hatchCount)
    line(-w / 2, hy, w / 2, hy)
  }

  // 2. cap: 4-sided shape drawn on top of the rectangle. Its bottom edge meets the
  // spike's base (0), and its narrow tip pokes 'tipOverhang' past the rectangle's raised top edge
  let baseW = w
  let topW = w / 2
  let capBottomY = 0
  let capTopY = rectTopY - tipOverhang

  stroke(strokeColour)
  fill(palettes[currentTrait][1]) // colour #2 in the current trait's palette
  beginShape()
  vertex(-baseW / 2, capBottomY)
  vertex(baseW / 2, capBottomY)
  vertex(topW / 2, capTopY)
  vertex(-topW / 2, capTopY)
  endShape(CLOSE)

  pop()
}

// tabs along the shared edges of grid 5 and grid 7: a trapezoid protruding
// from the edge into the neighbouring cell, tapering at the same angle as
// the grid's 'X' diagonals, with a row of triangle+bridge decorations
// (echoing fan()'s) straddling the shared edge on both sides
function drawTabs() {
  let x5 = cellW * 0.5
  let x7 = cellW * 2.5
  let topY = gridTop + cellH * 1
  let bottomY = gridTop + cellH * 2

  tab(x5, topY, -1) // grid 5's top edge, extending up into grid 1
  tab(x5, bottomY, 1) // grid 5's bottom edge, extending down into grid 9
  tab(x7, topY, -1) // grid 7's top edge, extending up into grid 3
  tab(x7, bottomY, 1) // grid 7's bottom edge, extending down into grid 11

  // grid 8's right edge, extending right into the new far-right column
  tabVertical(cellW * cols, gridTop + cellH * 1.5, 1)
}

function tab(x, y, extendDirection) {
  push()
  translate(x, y)

  let tabHeight = cellH * 0.2
  let xAngle = atan2(cellH, cellW) // the grid's 'X'-diagonal angle
  let inset = tabHeight / tan(xAngle)

  let baseHalfW = cellW / 2
  let topHalfW = baseHalfW - inset
  let tipY = extendDirection * tabHeight

  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  fill(palettes[currentTrait][2]) // third colour in the palette
//noFill()
  beginShape()
  vertex(-baseHalfW, 0)
  vertex(baseHalfW, 0)
  vertex(topHalfW, tipY)
  vertex(-topHalfW, tipY)
  endShape(CLOSE)

  // one row of decorations pointing into the tab (toward its narrow edge),
  // one flipped row pointing inboard into the neighbouring grid cell —
  // both rows share the same base line: the edge itself
  let decorCount = 10
  for (let i = 0; i < decorCount; i++) {
    let dx = -baseHalfW + (cellW * (i + 0.5)) / decorCount
    drawEdgeDecoration(dx, 0, extendDirection)
    drawEdgeDecoration(dx, 0, -extendDirection)
  }

  pop()
}

// linear counterpart to drawArcDecoration(), for a straight horizontal edge:
// local x runs along the edge, local y is the direction the apex points
function drawEdgeDecoration(x, y, direction) {
  push()
  translate(x, y)

  let triSide = unit * 0.2
  let triHeight = (triSide * sqrt(3)) / 2
  let gap = unit * 0.05
  let overlap = unit * 0.02

  let baseY = direction * gap
  let apexY = baseY + direction * triHeight

  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  beginShape()
  vertex(-triSide / 2, baseY)
  vertex(triSide / 2, baseY)
  vertex(0, apexY)
  endShape(CLOSE)

  // bridge: spans from the edge out to just past the triangle's base
  let rectFar = baseY + direction * overlap
  let rectY = rectFar / 2
  let rectLen = abs(rectFar)
  rect(0, rectY, triSide * 2, rectLen)

  pop()
}

// vertical counterpart to tab(): same trapezoid-tapered-at-the-X-angle idea,
// but for a vertical shared edge (base runs along y, extends along x)
function tabVertical(x, y, extendDirection) {
  push()
  translate(x, y)

  let tabWidth = extraColW // fills the full width of the far-right column
  let xAngle = atan2(cellH, cellW) // the grid's 'X'-diagonal angle
  let inset = tabWidth * tan(xAngle)

  let baseHalfH = cellH / 2
  let topHalfH = baseHalfH - inset
  let tipX = extendDirection * tabWidth

  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  noFill()
  fill(palettes[currentTrait][4]) 
  beginShape()
  vertex(0, -baseHalfH)
  vertex(0, baseHalfH)
  vertex(tipX, topHalfH)
  vertex(tipX, -topHalfH)
  endShape(CLOSE)

  let decorCount = 10
  for (let i = 0; i < decorCount; i++) {
    let dy = -baseHalfH + (cellH * (i + 0.5)) / decorCount
    drawEdgeDecorationVertical(0, dy, extendDirection)
    drawEdgeDecorationVertical(0, dy, -extendDirection)
  }

  pop()
}

// vertical counterpart to drawEdgeDecoration(): local y runs along the edge,
// local x is the direction the apex points
function drawEdgeDecorationVertical(x, y, direction) {
  push()
  translate(x, y)

  let triSide = unit * 0.2
  let triHeight = (triSide * sqrt(3)) / 2
  let gap = unit * 0.05
  let overlap = unit * 0.02

  let baseX = direction * gap
  let apexX = baseX + direction * triHeight

  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)

  beginShape()
  vertex(baseX, -triSide / 2)
  vertex(baseX, triSide / 2)
  vertex(apexX, 0)
  endShape(CLOSE)

  let rectFar = baseX + direction * overlap
  let rectX = rectFar / 2
  let rectLen = abs(rectFar)
  rect(rectX, 0, rectLen, triSide * 2)

  pop()
}

// shared geometry for food()'s rounded rectangle and its 3x2 grid of
// pentagons, so drawFoodEchoes() can reproduce matching positions/sizes
function foodLayout() {
  let rectW = cellW * 0.7
  let rectH = cellH * 0.45
  let subCols = 3
  let subRows = 2
  let colW = rectW / subCols
  let rowH = rectH / subRows
  let pentagonR = min(colW, rowH) * 0.35
  return { rectW, rectH, subCols, subRows, colW, rowH, pentagonR }
}

function rack(x, y) {
  push()
  translate(x, y)

  let rackW = cellW * 0.9
  let rackH = cellH * 0.9
  let frameWeight = unit * 0.3
  let cornerR = unit * 1
  let innerW = rackW - frameWeight * 2
  let innerH = rackH - frameWeight * 2
  let innerCornerR = max(0, cornerR - frameWeight)

  // solid colour #2 frame: outer rounded rect, with a matching inner rounded
  // rect punched out using the grid's own background colour
  noStroke()
  fill(palettes[currentTrait][1]) // colour #2
  rect(0, 0, rackW, rackH, cornerR)
  fill(palettes[currentTrait][0])
  rect(0, 0, innerW, innerH, innerCornerR)

  // stroke outline on both edges of the frame
  noFill()
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  rect(0, 0, rackW, rackH, cornerR)
  rect(0, 0, innerW, innerH, innerCornerR)

  // vertical hatch within the frame
  let hatchCount = 10
  for (let i = 1; i < hatchCount; i++) {
    let hx = -innerW / 2 + (innerW * i) / hatchCount
    line(hx, -innerH / 2, hx, innerH / 2)
  }

  // solid circle (colour #2) with a smaller solid black circle inside,
  // centred on the rack's top and bottom edges
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  for (let edgeY of [-rackH / 2, rackH / 2]) {
    fill(palettes[currentTrait][1]) // colour #2
    circle(0, edgeY, unit * 0.8)
    fill(0, 0, 0)
    circle(0, edgeY, unit * 0.2)
  }

  pop()
}

function food(x, y) {
  push()
  translate(x, y)

  rack(0, 0)

  let L = foodLayout()

  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  fill(palettes[currentTrait][2]) // colour #3
  rect(0, 0, L.rectW, L.rectH, unit)

  // 6 pentagons in 2 rows of 3, each with its own random proportions
  let idx = 0
  for (let row = 0; row < L.subRows; row++) {
    for (let col = 0; col < L.subCols; col++) {
      let dx = -L.rectW / 2 + L.colW * (col + 0.5)
      let dy = -L.rectH / 2 + L.rowH * (row + 0.5)
      drawPentagon(dx, dy, L.pentagonR, foodShapes[idx])
      idx++
    }
  }

  pop()
}

// irregular pentagon: 5 vertices at regular 72-degree angles, but each at
// its own random radius (radii), giving organic 'random proportions'
function drawPentagon(x, y, r, radii) {
  push()
  translate(x, y)
  stroke(strokeColour)
  strokeWeight(baseStrokeWeight)
  fill(palettes[currentTrait][3]) // colour #4

  beginShape()
  for (let v = 0; v < 5; v++) {
    let angle = -HALF_PI + (v * TWO_PI) / 5
    let vr = r * radii[v]
    vertex(cos(angle) * vr, sin(angle) * vr)
  }
  endShape(CLOSE)

  // quick test: two translucent inset copies of the same shape
  noStroke()
  fill(0, 0, 100, 20)
  drawPentagonOutline(r, radii, unit * 0.2)
  drawPentagonOutline(r, radii, unit * 0.3)

  pop()
}

// same vertices as drawPentagon(), each pulled in by 'inset' along its own
// radial line — used to draw inset copies of the pentagon in place
function drawPentagonOutline(r, radii, inset) {
  beginShape()
  for (let v = 0; v < 5; v++) {
    let angle = -HALF_PI + (v * TWO_PI) / 5
    let vr = max(0, r * radii[v] - inset)
    vertex(cos(angle) * vr, sin(angle) * vr)
  }
  endShape(CLOSE)
}

// echoes food()'s pentagons onto the 4 grids surrounding grid 6, as if those
// grids were capturing the elevation of the shapes closest to their shared
// edge: top row -> grid 2, bottom row -> grid 10, left column -> grid 5,
// right column -> grid 7
function drawFoodEchoes() {
  let L = foodLayout()

  // how far along the path from the shared edge to the neighbouring grid's
  // opposite edge each echo is raised (1/3 of that grid's full dimension)
  let alongFraction = 1 / 3

  let x2 = cellW * 1.5,
    y2 = gridTop + cellH * 0.5
  let x5 = cellW * 0.5,
    y5 = gridTop + cellH * 1.5
  let x7 = cellW * 2.5,
    y7 = gridTop + cellH * 1.5
  let x10 = cellW * 1.5,
    y10 = gridTop + cellH * 2.5

  // top row (indices 0,1,2) -> grid 2, raised in from its bottom edge
  let dyTop = cellH / 2 - alongFraction * cellH
  for (let col = 0; col < L.subCols; col++) {
    let dx = -L.rectW / 2 + L.colW * (col + 0.5)
    drawPentagon(x2 + dx, y2 + dyTop, L.pentagonR, foodShapes[col])
  }

  // bottom row (indices 3,4,5) -> grid 10, raised in from its top edge
  let dyBottom = -(cellH / 2 - alongFraction * cellH)
  for (let col = 0; col < L.subCols; col++) {
    let dx = -L.rectW / 2 + L.colW * (col + 0.5)
    drawPentagon(
      x10 + dx,
      y10 + dyBottom,
      L.pentagonR,
      foodShapes[L.subCols + col],
    )
  }

  // left column (indices 0,3) -> grid 5, raised in from its right edge
  let dxLeft = cellW / 2 - alongFraction * cellW
  for (let row = 0; row < L.subRows; row++) {
    let dy = -L.rectH / 2 + L.rowH * (row + 0.5)
    drawPentagon(x5 + dxLeft, y5 + dy, L.pentagonR, foodShapes[row * L.subCols])
  }

  // right column (indices 2,5) -> grid 7, raised in from its left edge
  let dxRight = -(cellW / 2 - alongFraction * cellW)
  for (let row = 0; row < L.subRows; row++) {
    let dy = -L.rectH / 2 + L.rowH * (row + 0.5)
    drawPentagon(
      x7 + dxRight,
      y7 + dy,
      L.pentagonR,
      foodShapes[row * L.subCols + (L.subCols - 1)],
    )
  }
}

function windowResized() {
  createCanvas(windowWidth, windowHeight)
  computeLayout()
}
