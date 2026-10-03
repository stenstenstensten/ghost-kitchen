# tower-module.js — current logic

Loaded via `tower-module.html` (same p5 CDN pattern as the other sketches). Same grid system as `sketch.js`, but with every decorative function stripped out and replaced by one reusable module: a "tower" of overlaid chamfered rectangles, plus a post-process pass that traces an outline around every solid shape on the finished canvas, plus a second experiment (the "razor objects") that places 12 more shapes into open space and lets you click/tap through zoomed views of them.

**`showRazorAndOutlines`** (top of file) is the easy on/off switch for all of that second experiment — set `false` to fall back to just the bare chamfered-rectangle towers.

## Grid layout

Ported directly from `sketch.js`:

```
cellH = height / (rows + 0.25)
headerH = cellH / 4
extraColW = headerH
cellW = (width - extraColW) / cols
gridTop = headerH
```

`cols = 4`, `rows = 3`. Grid index → row/col: `row = floor((index-1)/cols)`, `col = (index-1) % cols`. `drawGridStructure()` still computes the 1-12 index per cell but the debug number `text()` call is currently commented out (line inside its row/col loop) — grid borders and the far-right column still draw.

## Colour mode

`setup()` sets `colorMode(HSB, 360, 100, 100)` and `pixelDensity(1.5)`. The density was originally locked to `1` because `drawSolidEdgeOutline()` and `drawEnclosedPocketMarkers()` read the canvas back via `loadPixels()` and index `pixels[]` — a non-1:1 buffer silently misaligned that indexing (symptom: the effect appears to "start" partway down the canvas, reading a shifted/wrong sub-region). `isSolidPixel()` ([tower-module.js:1182](tower-module.js#L1182)) now reads `pixelDensity()` dynamically and floors (not rounds) both the stride and the sampled coordinate before indexing, so any density value stays correctly aligned — that's what unblocked raising it.

It was bumped to `1.5` for a second reason: the click/tap zoom system (see below) scales a crop of the frozen `artSnapshot` up to fill the canvas, and more real source pixels means less of that scale-up has to be invented by the browser's smoothing. **This is the open tuning question going into the next session** — see "Next phase" at the bottom.

`strokeColour = color(0,0,0)`, `bgColour = color(0,0,100)` — both explicit HSB triples rather than the single-value `color(0)`/`color(255)` shorthand, to avoid relying on how a bare grayscale value gets scaled under a non-default colour mode.

## The module: chamfered rectangle

`getChamferedRectPoints(w, h, chamferCorner, chamferFrac)` returns the 4-or-5 vertex list for a rectangle with exactly one corner cut — the cut distance `c = chamferFrac * min(w, h)` is applied along both edges meeting that corner, via sign-based direction vectors to the adjacent corners, replacing that one corner point with two new points. `drawChamferedRect(cx, cy, w, h, col, chamferCorner, chamferFrac)` is a thin wrapper: calls the points function, fills the resulting shape. The points function is also reused directly by `drawEdgeCombLines()` (see below) so the comb outline always matches the exact shape that got drawn, not a re-derived approximation.

## The module: tower (level overlay)

`renderTower(baseCx, baseCy, w, h, rot, baseColour, addEdgeComb)` — not called directly; see queue/flush below.

- **Level count**: 4 levels for a plain (uncoloured) tower, **6 for one of the 7 colour-special towers** (`levelCount = baseColour ? 6 : 4`). The extra 2 levels are one more colour-shade level and one more white level — same alternating pattern, just longer.
- Each level's rect is centred at `(0,0)` on level 0, then for each subsequent level the origin moves to the **midpoint of the previous level's top edge**: `curCy -= curH/2` (x unchanged) — that's what makes it an *overlay*, not a stack: each new shape's centre sits on the previous shape's edge midpoint, so it genuinely overlaps.
- Each level's `w`/`h` (levels 1+) is an independent random fraction of the **base** shape's `w`/`h`: `baseW * random(0.1, 0.6)`, `baseH * random(0.1, 0.6)`.
- Each level gets its own random chamfer corner and chamfer fraction. Level 0's chamfer values are captured into `level0ChamferCorner`/`level0ChamferFrac` — needed later by the edge-comb feature, which has to trace the exact same outline that got filled.
- A 5th extra white chamfered rect is added after the main level loop, centred on the base shape's right edge midpoint (`baseW/2, 0`) — same random-fraction/chamfer logic, always white (`color(0,0,100)`), regardless of level count.
- The whole tower is drawn inside `push()/translate(baseCx,baseCy)/rotate(rot)/pop()` — built growing in local `-y`, so `rot` is what actually points a tower up/down/left/right once placed.

## Edge anchoring

`drawAnchoredTower(anchorX, anchorY, w, h, rot)` places a tower so its flat (local bottom) edge sits exactly at `(anchorX, anchorY)`:

```
baseCx = anchorX + (h/2) * sin(rot)
baseCy = anchorY - (h/2) * cos(rot)
```

Used by `drawCenterFacingTowers()` (grid 2) and `drawSingleEdgeTower()` (grid 4's mini-grids).

`drawEdgeTower(cx, cy, cellW, cellH, side, scale = 1)` is the more general edge treatment used everywhere else: picks one of 3 equally-likely arrangements per edge —
- **mode 0**: one module, random length between `0.4×` and `1×` of `sizeLength` (`sizeLength = edgeLength * scale`)
- **mode 1**: three equal-length modules (`sizeLength/3` each)
- **mode 2**: three random-length modules, each between `0.3×` and `1×` of a `sizeLength/3` slot

Each module's height is `cellH * random(0.15, 0.3) * scale`. Modules are centred within their own slot along the edge via `along = -edgeLength/2 + (edgeLength/n)*(i+0.5)`.

There's a `depthFactor = random(0.6, 1)` declared once per edge call but **still not referenced anywhere** — leftover from before the `scale` parameter refactor. Still dead code.

## Per-grid treatment

| Grid | Treatment |
|---|---|
| 1 | One centred tower (`cellW*0.35 × cellH*0.3`, no rotation) + edge towers (scale 0.5) on **top** and **left** |
| 2 | `drawCenterFacingTowers()` — 4 towers anchored at the grid's own centre point, facing outward (up/down/left/right), plus one extra top-edge tower at scale 0.5 |
| 3 | Edge tower (scale 0.5) on **top** only |
| 4 | `drawMiniGridTowers()` — split into a 2×2 of mini-grids; each mini-grid gets one `drawSingleEdgeTower()` per side — 16 module stacks total |
| 5–8, 10 | Full edge-tower treatment: `drawEdgeTower()` on all 4 sides at scale 1 |
| 9 | Edge towers (scale 0.5) on **bottom** and **left** |
| 11 | Edge tower (scale 0.5) on **bottom** |
| 12 | Edge towers (scale 0.5) on **bottom** and **right** |
| 5 & 7 (tabs) | `drawModuleTabs()` — one extra tower pair per grid, straddling the shared edge with the grid above/below |

`towerGrids = [2, 4, 5, 6, 7, 8, 10]` drives the main loop; grids 1, 3, 9, 11, 12 and the tab pairs are handled as one-off calls after that loop.

## Queue / flush (two-pass render)

Every tower call (`drawTower()`) just pushes `{baseCx, baseCy, w, h, rot}` onto `towerQueue` — necessary because both the colour-special selection and the edge-comb selection below can't be decided until the full draw pass has queued everything.

`flushTowerQueue()` (called once, at the end of `draw()`, before `drawSolidEdgeOutline()`):
1. Picks `min(7, n)` distinct random indices as colour-special.
2. Of those 7, picks exactly one (via `random(specialArr)`) as the "vivid" tower; builds a `Map` of index → colour for all 7 (see Colour system below).
3. Separately, picks `round(n * 0.15)` distinct random indices (independent selection, may overlap the colour set) for the edge-comb treatment.
4. Renders the whole queue, passing each tower's colour (or `null`) and comb flag into `renderTower()`.

## Colour system

Of the 7 colour-special towers picked each `flushTowerQueue()` call:
- **One** (`vividIndex`) gets `color(hue, 100, 100)` — full saturation and brightness, a "hero" accent colour.
- The other **six** each get their own independent random hue at `color(hue, random(0, 50), 100)` — saturation capped at 50%, so they read as soft/muted rather than another bright accent.

Within a single special tower's own levels (in `renderTower()`):
- Odd levels are always white (`color(0,0,100)`).
- Even levels, on a plain tower (`baseColour` null): plain black (`color(0,0,0)`).
- Even levels, on a special tower: level 0 uses `baseColour` exactly; every other even level (2, and 4 on a 6-level tower) is `randomNearColour(baseColour, 0.2)` — **same hue**, saturation and brightness each independently nudged by up to ±20% (clamped 0-100). `randomNearColour()` works entirely in HSB (via `hue()`/`saturation()`/`brightness()` accessors, which are colour-mode-independent) — it does not touch RGB channels, so it can't drift the hue the way a per-channel RGB jitter would.

This replaced an earlier RGB-based version (`random(255)` per channel, ±15% per-channel jitter) when the sketch moved to HSB mode — a straight `colorMode` swap without rewriting this function would have fed 0-255-range numbers into `color()` under HSB interpretation and produced broken colours.

## Edge comb

`drawEdgeCombLines(pts, spacing, extend)` — a comb of perpendicular tick marks around every edge of a polygon: one line per `spacing` interval along each edge (starting at that edge's first vertex), each perpendicular to the edge, extending outward by `extend`. The outward normal for edge unit vector `(ux,uy)` is `(uy, -ux)` — verified correct for all 4 rectangle edges *and* the diagonal chamfer-cut edge, regardless of which corner is chamfered, as long as the point winding stays consistent (which `getChamferedRectPoints()` guarantees).

Called from `renderTower()` only for the ~15% of stacks flagged by `flushTowerQueue()`, using `level0ChamferCorner`/`level0ChamferFrac` so the comb traces the base shape's *actual* rendered outline. Current spacing/extend: `cellW * 0.025` each (tuned down from an initial `cellW * 0.05` — half the length, double the frequency).

## Solid-edge outline (EXPERIMENTAL)

`drawSolidEdgeOutline()`, called once at the end of `draw()` (inside the `showRazorAndOutlines` block, before the razor-object loop) — reads the actual rendered canvas via `loadPixels()` rather than re-deriving geometry, so it automatically accounts for every level of every tower and all their overlaps. 'Solid' means anything that isn't near-white (`isSolidPixel()`: true unless r/g/b are all above `whiteThreshold = 240`) — black shapes and the colour-special towers alike.

The actual per-point tracing logic now lives in a shared helper, `traceOutlinePoint(x, y, step, checkRadius, offsetDist, whiteThreshold, accentColour)` ([tower-module.js:963](tower-module.js#L963)): samples the canvas on a `step = 3`px grid, at each solid sample checks 8 compass directions at `checkRadius = step*2` to find which lead to a white neighbour, averages those directions into an outward normal, and offsets the point by `offsetDist` along it. **The offset point is only marked if it's still white itself** — tight corners/narrow gaps with no room are skipped rather than drawing into the neighbouring solid shape. A short tangent segment (perpendicular to the normal, length `step * 1.5`) is drawn at each valid offset point, layered black/white/accent (widest to narrowest) so adjacent samples read as one wrapped line rather than a scatter of dots.

`drawSolidEdgeOutline()` calls this across the whole canvas with `offsetDist = cellW * 0.06` and `accentColour = color(0, 100, 100)` (red — correctly labelled this time; an earlier version of this doc flagged a stale `// red` comment on a different colour value, since fixed). `drawRazorObjectOutline()` (see below) reuses the same helper, scoped to one object.

## Enclosed pocket markers

`drawEnclosedPocketMarkers(step, whiteThreshold)`, called at the end of `drawSolidEdgeOutline()` — reuses the same `step`/`whiteThreshold`. Distinguishes white space that's **fully enclosed** by solid shapes (no path back to the open background) from ordinary open white space:

1. Classifies every sample on the `step`-spaced grid as solid/white (`isSolidPixel()`), building a 2D boolean array.
2. Flood-fills inward from every white cell on the grid's outer border. Anything reached this way is 'open' — connected to the background.
3. Any white cell left unreached is part of an enclosed pocket. A second flood-fill groups these into separate connected components, one per distinct pocket (so two unconnected tiny pockets don't get merged into one marker).
4. For each pocket: **first** blanks the pocket's exact cell area with `bgColour` (the earlier outline pass didn't know yet that this space was enclosed, so it may have drawn tangent segments through it — this erases them), **then** stamps a marker at the pocket's centroid.

The actual marker is still TBC — a `circle(centreX, centreY, cellW * 0.04)` call is present but **currently commented out**, so pockets render as blank/cleared space with no visible marker at the moment. The blanking step still runs regardless. Re-enable or replace that line once the real drawing element for these spaces is decided.

## Razor objects (recipe-element placeholders)

EXPERIMENT, gated by `showRazorAndOutlines`, run once per `draw()` after `drawSolidEdgeOutline()`: 12 shapes placed into open space on the canvas, standing in for where illustrated recipe elements (chicken, herbs, stock, etc.) will eventually sit. Restricted to the 12 main grid cells (not the header row, bottom strip, or side columns); never rotated.

- `findOpenSpot(maxW, maxH, minW, minH, whiteThreshold, bounds, placedObjects)` ([tower-module.js:1259](tower-module.js#L1259)) tries up to 400 random points; at each, shrinks the candidate box from `maxW×maxH` down to `minW×minH` in steps of 15% looking for a fit. A fit requires **both**: no overlap with any box already in `placedObjects` (plain centre/half-extent box check, `boxesOverlap()`), and a *uniform* patch underneath (`isAreaUniform()` — every sampled point the same, all-white or all-solid, never a mix). `isAreaUniform()` accepts either case; the object's `onWhite` flag (`!result.isSolid`) records which one it landed on, since only the white case gets outlined.
- Sizing: `razorBase = min(cellW, cellH)`, max box `0.45×razorBase` square, min box `0.12×razorBase` square.
- Shape choice: `renderRazorRingTower` (a capsule with a punched-out circular hole, via `erase()`/`noErase()`) is **on hold** — defined but not called. The live distribution always calls `renderRazorNotchTower` (a rectangle with a small step-notch cut into each of its 4 corners, via `getRazorNotchPoints()`). Both share the same 7-level overlay treatment via `renderOverlayTower()` and `razorColourForLevel()`.
- `drawRazorLabel()` (a small numbered badge above an object) is defined but its call site is commented out — currently unused.
- Each successfully placed object is pushed onto `razorObjects` as `{x, y, w, h}` — this array (plus the frozen `artSnapshot`, see below) is the entire input to the click/tap zoom system; it never re-runs any of this generative logic.

**Known-stale comment**: the block comment above `razorObjects` (and the one above `drawRazorLabel`) still describes "the first batch of 7 (outlined when they land on white) plus a second, unlined batch of 5" — that split doesn't exist in the current code. `drawRazorObjectOutline()` is called for *any* of the 12 objects that land on white, regardless of index. Worth fixing next time that comment block is touched.

## Razor palette & colour-per-level

`razorPalettes` (built in `setup()`, 12 entries, index 0-11 ↔ object 1-12): each a 3-colour `[dark, mid, light]` progression of one hand-picked hue, spread around the colour wheel so all 12 objects stay visually distinct from each other and from the blue-seeded tower modules elsewhere on the canvas.

`razorColourForLevel(paletteIndex)` returns a `colourForLevel(level)` closure for `renderOverlayTower()`: odd levels are always white; the 4 solid (even) levels cycle through that object's 3-colour palette (`level/2 % 3` → `[0,1,2,0]` across levels 0,2,4,6).

## Per-object outline

`drawRazorObjectOutline(cx, cy, w, h, accentColour)` ([tower-module.js:1052](tower-module.js#L1052)) repeats the solid-edge-outline effect (via the shared `traceOutlinePoint()`) around a single object that landed on white, using that object's own palette dark-shade as the accent instead of red. Scoped to a local box around the object rather than a full-canvas scan — `margin = checkRadius + offsetDist + step*2`, deliberately **not** proportional to the object's own size (an earlier version sized the margin off the object and ended up tracing — and colouring — unrelated nearby tower edges, not just this object's own boundary).

## Click/tap zoom system

`artSnapshot` (a `get()` capture of the fully-rendered canvas, taken once at the end of `draw()` after `noLoop()`) plus `razorObjects` are all this needs — it never re-runs the generative drawing.

- `focusIndex`: `0` = full view; `1..razorObjects.length` = zoomed to that entry. `mouseClicked()`/`touchStarted()` both call `advanceFocus()`, which increments `focusIndex` modulo `razorObjects.length + 1` and re-renders. `touchStarted()` returns `false` to stop the browser from also firing a synthetic `mouseClicked()` for the same tap; a 200ms debounce (`lastAdvanceTime`) in `advanceFocus()` backs that up for environments that fire both anyway.
- `renderView()` ([tower-module.js:275](tower-module.js#L275)): at `focusIndex 0`, just draws `artSnapshot` full-size. Otherwise, crops a region of `artSnapshot` centred on `razorObjects[focusIndex - 1]` — crop size is `max(obj.w, obj.h) * 2.5` on the long side, with the other side derived from the canvas's own aspect ratio (so the zoomed image is never stretched), then clamped to the canvas dimensions. `image(artSnapshot, 0, 0, width, height, cropX, cropY, cropW, cropH)` does the actual scaled draw.
- **Known-stale comments**: the block comment above `renderView()` and the one above `mouseClicked()` both still say the cycle goes "object 1 ... object 7" — accurate when there were 7 razor objects, stale now that there are 12. The code itself (`% (razorObjects.length + 1)`) is already correct for 12; only the prose needs updating.

## Known open items

- **Zoom sharpness/blur balance** — see "Next phase" below; this is where the last session ended.
- `depthFactor` in `drawEdgeTower()` is computed but unused — confirm intent (wire into `h`, or delete) if revisited.
- The pocket marker (`circle()` in `drawEnclosedPocketMarkers()`) is commented out pending a decision on what actually goes in these spaces.
- Stale "7 objects" prose in the comments above `razorObjects`, `drawRazorLabel()`, `renderView()`, and `mouseClicked()` — all describe behaviour from before the 7→12 expansion; the code is correct, only the comments lag.
- `renderRazorRingTower()` is fully defined but dead (not called) — `renderRazorNotchTower()` is the only shape in the live rotation. Decide whether to bring the ring back into the mix (e.g. random per-object choice) or delete it.
- `drawRazorLabel()` is defined but its call is commented out — decide whether numbered badges come back or the function gets removed.
- Stale comments still reference "4 special towers" / RGB-era colour treatment in a couple of docstrings — cosmetic only.

## Verification workflow

`chrome --screenshot=...` (headless CLI flag) is unreliable for this project — it has repeatedly produced blank/near-white PNGs even when the page renders correctly. Use Chrome DevTools Protocol instead:

1. `chrome --headless=new --remote-debugging-port=<port> --user-data-dir=<fresh temp dir> <file-url>` (background).
2. `curl http://127.0.0.1:<port>/json` to find the target's `webSocketDebuggerUrl`. **Use `127.0.0.1`, not `localhost`** — under Node 18 (no native `WebSocket` global, so the `ws` package is needed instead), connecting to `localhost` can resolve to the IPv6 loopback (`::1`) first and get `ECONNREFUSED` even though Chrome's devtools server is listening fine on IPv4.
3. A small Node script (`ws` package if not on Node 22+/24's native `WebSocket`): `Runtime.enable`, wait ~1–1.5s for the sketch to render, then `Page.captureScreenshot` (optionally with a `clip: {x, y, width, height, scale}` for a zoomed-in crop). To check a *zoomed* razor-object view specifically, dispatch a synthetic click (`Input.dispatchMouseEvent`, `type: "mousePressed"` then `"mouseReleased"`) before the screenshot — `focusIndex` only advances through `mouseClicked()`/`touchStarted()`, there's no URL param or other hook to jump straight to a given object.
4. Kill the Chrome process (`pkill -f "remote-debugging-port=<port>"`) once done — each verification run should clean up after itself rather than leaving headless instances running.

## Next phase

Pick up here: **tune the zoom-view sharp/blur balance.** `pixelDensity(1.5)` ([tower-module.js:57](tower-module.js#L57)) is the current value — it was raised from `1` specifically to give `renderView()`'s scaled-up crops more real detail to work with, but it was left mid-tune, not confirmed as the final number.

- The lever: higher `pixelDensity` = more real source pixels in `artSnapshot` = less blur when a crop is scaled up, at the cost of render/memory overhead. Try `2` next if 1.5 still reads soft on a tap-zoomed object.
- Use the verification workflow above (step 3's synthetic-click note) to screenshot an actual zoomed object rather than judging from the full view — the two look very different at this zoom level.
- Once a density value is settled, the two "stale 7 objects" comment blocks (`renderView()`, `mouseClicked()`) and the "first batch of 7 / second batch of 5" comment (`razorObjects`, `drawRazorLabel()`) are quick, low-risk cleanup to fold in alongside it.
