# Ghost Kitchen

## Project overview

This project has three planned outputs, all built from the same underlying system of **12 master traits (A-L)** and **12 colour palettes** (one per trait). Each generation of a piece picks one trait/palette, used consistently across that whole piece.

1. **Static 2D drawing — this is what `sketch.js` builds.** An intricate, ornate print-ready drawing on a "fold-up oven with flaps" base grid — so detailed the oven form won't be recognisable. 12 variations, each abstractly relating to one of 12 recipes via symbols/geometric objects standing in for ingredients and equipment. Printed on tea towels.
2. **Digital 3D object** (not started, separate codebase planned in Three.js) — the oven folded up, viewable with mouse orbit controls, set in a decorative frame using the same colour palette as its trait. Much less detailed than item 1. **These 3D objects will be minted as NFTs** — keep export format (glTF/GLB) and a static preview render in mind when that work begins.
3. **Website** (not started) — describes the project, and displays the 12 3D ovens in a spatial arrangement styled after competitive cooking reality shows (e.g. Culinary Class Wars), ovens lined up.

`sketch.js` is scoped to item 1 only.

## sketch.js structure (p5.js)

- Canvas: `windowWidth` x `windowHeight`, HSB colour mode, `rectMode(CENTER)`.
- A 4x3 grid (`cols`/`rows`) plus a shorter header row above it (`headerH`, one quarter of a normal cell's height).
- `unit` = base measurement, one tenth of a grid cell.
- `strokeColour` / `baseStrokeWeight` — shared stroke style used throughout.
- `paletteData` (12 x 5 `[h,s,b]` triples, one row per trait) — fill these in manually; `palettes` is the built `color()` version.
- `currentTrait` — chosen once per generation (`setup()`), drives every fill in the sketch via `palettes[currentTrait][...]`.
- `filledGrids` — grid slots that get the solid trait-colour background.
- `gridFunctions` / `headerFunctions` — maps grid index -> design function drawn on top of the fill (e.g. `stoveTop`, `grill`, `door`, `controls`). Functions are named for what they draw, not where they go; placement is decided separately in these maps.
- Build-out functions in progress: `chicken()`, `saucepan()`, `herbs()`, `metalSpike()`.

## oven-shapes.js (exploration, separate from sketch.js)

A freeform p5.js sandbox (`oven-shapes.js` / `oven-shapes.html`, own canvas, not tied to the grid/palette system above) for developing the shape-design language before it moves into `sketch.js` proper. Tests two source lists, each drawn in more than one style:

- **Oven set** (12): inspired by a KitchenAid oven service manual's exploded-view diagrams — literal hardware (coil, racks, brackets, fan, hinge-latch) plus the diagram's own drawing conventions (dashed hidden-line "ghost" shapes, numbered callout circles, a screw glyph). Functions: `coilLoop`, `dotFieldSlab`, `ribbedTray`, `radialVentDisc`, `pinwheel`, `hookLatch`, `tiltedPane`, `calloutDot`, `dashGhost`, `crossBolt`, `bentBracket`, `flaggedProbe`.
- **Recipe set** (18): ingredients + equipment for a chicken meatball soup recipe (fetched from a GitHub gist), rough/not-always-literal by design (e.g. chicken mince → a beak). Functions: `chickenBeak`, `herbSprig`, `eggYolk`, `ricottaScoop`, `breadcrumbScatter`, `lemonWedge`, `pinchSalt`, `leek`, `fennelBulb`, `garlicClove`, `carrotCone`, `celeryRib`, `stockPuddle`, `pastaTangle`, `mixingBowl`, `bakingTray`, `fryingPan`, `potWithLid`.

Each list exists in two styles, each its own array of functions (suffixed `P` for pentagon style):
- **Rough style** (`ovenShapeFunctions`, `recipeShapeFunctions`): solid colour fills, hand-drawn irregularity via `roughPolygon()`/`roughCirclePts()` (jittered vertices).
- **Pentagon style** (`recipePentagonFunctions`, `ovenPentagonFunctions`): every shape built from one base unit, `pentagon(x, y, r, rot, sx, sy, col)` — a 5-point `curveVertex`-rounded outline (no fill), repeated/scaled/squashed/rotated/clustered per element. `sx`/`sy` are baked directly into each point's coordinates rather than via `scale()`, specifically so `strokeWeight` isn't distorted non-uniformly. **The recipe set works well in this style; the oven set did not ("that's not working") — kept in the file (`ovenPentagonFunctions`) but not the active one.**

Which list/style is on screen is controlled by one line: `let shapeFunctions = recipePentagonFunctions;` (swap to `ovenShapeFunctions` / `recipeShapeFunctions` / `ovenPentagonFunctions` to switch — `gridDims` and the `setup()` if-chain size the grid to match automatically).

Two display modes, via `sceneMode` (`'grid'` or `'scatter'`):
- `'grid'` (`drawGridLayout()`): one instance of each shape in the list, in a grid.
- `'scatter'` (`drawScatter()`): `scatterCount` random instances of shapes drawn from the active list. Currently arranged in concentric rings around the canvas centre (radius increasing outward, items-per-ring scaled to ring radius so spacing stays even, each shape tangent-rotated to its ring) rather than fully random x/y — that was the first version and is still in the code's recent history if reverting is wanted. `baseS` controls shape size relative to `min(width, height)`; at high `scatterCount` with large `baseS` shapes overlap into a solid mass rather than showing distinct rings (tune `baseS` down first if that happens).

Other shared plumbing: `screenStrokeWeight` (global, `min(width, height)`-relative line weight, recomputed in `computeLayout()` — deliberately *not* relative to any individual shape's own size); `bgColour`; `randomSeed(20)` at the top of `draw()` keeps jitter/scatter stable across resizes rather than reshuffling every redraw (`draw()` calls `noLoop()` at the end — it's a static render, not an animation loop).
