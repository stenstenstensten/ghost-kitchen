let unit

//panel array
let panelList = []
let tileList = []

///pastel-type
// let colorPalette = [
//   [234, 17, 95, 255], // main tone dark
//   [223, 76, 38, 255], // main tone mid
//   [0, 36, 82, 255], // main tone light
//   [49, 4, 91, 255], // main tone shadow
//   [16, 46, 68, 255], // contrast highlight
//   [229, 7, 31, 255], // contrast lowlight
//   [38, 83, 95, 255], // line dark
//   [20, 100, 40, 255], // line light
//   [347, 43, 73, 255], // water
//   [3, 70, 65, 255], // main tone light2
//   [227, 5, 55, 255], // main tone light3
//   [238, 10, 65, 255], // main tone light4
//   [200, 50, 82, 255], // main tone light5
// ]

//mono tone blue
// let colorPalette = [
//   [214, 37, 90, 255], // main tone dark
//   [223, 76, 38, 255], // main tone mid
//   [210, 86, 52, 255], // main tone light
//   [229, 74, 71, 255], // main tone shadow
//   [216, 66, 100, 255], // contrast highlight
//   [229, 77, 41, 255], // contrast lowlight
//   [38, 83, 95, 255], // line dark
//   [215, 87, 43, 255], // line light
//   [210, 100, 73, 255], // water
//   [3, 70, 65, 255], // main tone light2
//   [227, 95, 35, 255], // main tone light3
//   [218, 90, 45, 255], // main tone light4
//   [230, 100, 30, 255], // main tone light5
// ]

//mono tone orange
// let colorPalette = [
//   [21, 100, 95, 255], // main tone dark
//   [23, 76, 38, 255], // main tone mid
//   [20, 36, 82, 255], // main tone light
//   [9, 74, 91, 255], // main tone shadow
//   [10, 76, 68, 255], // contrast highlight
//   [22, 77, 61, 255], // contrast lowlight
//   [23, 83, 95, 255], // line dark
//   [21, 67, 93, 255], // line light
//   [12, 100, 73, 255], // water
//   [20, 100, 80, 255], // main tone light2
//   [22, 85, 65, 255], // main tone light3
//   [21, 60, 100, 255], // main tone light4
//   [10, 100, 70, 255], // main tone light5
// ]

// ///pastel 240630
// let colorPalette = [
//   [214, 17, 95, 255], // main tone dark
//   [223, 56, 38, 255], // main tone mid
//   [200, 26, 82, 255], // main tone light
//   [229, 64, 91, 255], // main tone shadow
//   [216, 36, 68, 255], // contrast highlight
//   [229, 67, 61, 255], // contrast lowlight
//   [238, 73, 95, 255], // line dark
//   [215, 57, 93, 255], // line light
//   [40, 100, 73, 255], // water
//   [330, 40, 80, 255], // main tone light2
//   [227, 35, 65, 255], // main tone light3
//   [218, 40, 65, 255], // main tone light4
//   [210, 20, 70, 255], // main tone light5
// ]

let colorPalette = [
  [10, 60, 95, 255], // main tone dark
  [18, 10, 38, 255], // main tone mid
  [10, 26, 82, 255], // main tone light
  [0, 5, 91, 255], // main tone shadow
  [9, 16, 68, 255], // contrast highlight
  [7, 7, 91, 255], // contrast lowlight
  [9, 3, 95, 255], // line dark ////
  [15, 17, 93, 255], // line light
  [30, 80, 73, 255], // water
  [0, 0, 80, 255], // main tone light2
  [8, 25, 95, 255], // main tone light3
  [9, 20, 65, 255], // main tone light4
  [8, 10, 90, 255], // main tone light5
]

function setup() {
  noLoop()
  //frameRate(3)
  //createCanvas(1000, 1250)
  createCanvas(2000, 2500)
  //createCanvas(windowWidth, windowHeight)

  //random at mint check
  randomSeed(700)

  rectMode(CENTER)
  imageMode(CENTER)
  angleMode(DEGREES)
  textAlign(CENTER, CENTER)
  colorMode(HSB, 360, 100, 100, 255)
  textFont('sans-serif')

  //////////////////////SET UP UNITS AND CANVAS SPACE
  unit = width / 4.5 //4.5

  strokeWeightThin = unit * 0.005

  ////panel sizes LIQUID DEATH EDITION

  //ROTATIONS
  east = 270
  west = 90
  north = 0
  south = 180

  backgroundColor = [0, 0, 15, 255] //356, 4, 16, 255

  //create a number of panel modules
  widthLow = unit * 0.5
  widthHigh = unit * 0.9

  heightLow = unit * 0.5
  heightHigh = unit * 0.9

  //play with these to change size of hole in centre
  flexLow = unit * 0.0005
  flexHigh = unit * 0.002

  //create a number of panels
  for (let i = 0; i < 300; i++) {
    let w = random(widthLow, widthHigh)
    let h = random(heightLow, heightHigh)
    let flexL = random(flexLow, flexHigh)
    let flexR = random(flexLow, flexHigh)
    let flexT = random(flexLow, flexHigh)
    let flexB = random(flexLow, flexHigh)
    let tileColor1 = colorPalette[floor(random(colorPalette.length))]
    let tileColor2 = colorPalette[floor(random(colorPalette.length))]
    let tileColor3 = colorPalette[floor(random(colorPalette.length))]
    let tileColor4 = colorPalette[floor(random(colorPalette.length))]
    let tileColor5 = colorPalette[floor(random(colorPalette.length))]
    let tileColor6 = colorPalette[floor(random(colorPalette.length))]
    let tileColor7 = colorPalette[floor(random(colorPalette.length))]
    let tileColor8 = colorPalette[floor(random(colorPalette.length))]
    let tileColor9 = colorPalette[floor(random(colorPalette.length))]
    let tileColor10 = colorPalette[floor(random(colorPalette.length))]
    let tileColor11 = colorPalette[floor(random(colorPalette.length))]
    let tileColor12 = colorPalette[floor(random(colorPalette.length))]
    let connectRandomiser = random(1)

    let panelInstance = new panelMaster01(
      w,
      h,
      flexL,
      flexR,
      flexT,
      flexB,
      tileColor1,
      tileColor2,
      tileColor3,
      tileColor4,
      tileColor5,
      tileColor6,
      tileColor7,
      tileColor8,
      tileColor9,
      tileColor10,
      tileColor11,
      tileColor12,
      connectRandomiser
    )
    panelList.push(panelInstance)
  }

  //create a number of panels
  for (let i = 0; i < 50; i++) {
    let w = random(widthLow / 4, widthHigh / 4)
    let h = random(heightLow / 4, heightHigh / 4)
    let flexL = random(flexLow / 4, flexHigh / 4)
    let flexR = random(flexLow / 4, flexHigh / 4)
    let flexT = random(flexLow / 4, flexHigh / 4)
    let flexB = random(flexLow / 4, flexHigh / 4)
    let tileColor1 = colorPalette[floor(random(colorPalette.length))]
    let tileColor2 = colorPalette[floor(random(colorPalette.length))]
    let tileColor3 = colorPalette[floor(random(colorPalette.length))]
    let tileColor4 = colorPalette[floor(random(colorPalette.length))]
    let tileColor5 = colorPalette[floor(random(colorPalette.length))]
    let tileColor6 = colorPalette[floor(random(colorPalette.length))]
    let tileColor7 = colorPalette[floor(random(colorPalette.length))]
    let tileColor8 = colorPalette[floor(random(colorPalette.length))]
    let tileColor9 = colorPalette[floor(random(colorPalette.length))]
    let tileColor10 = colorPalette[floor(random(colorPalette.length))]
    let tileColor11 = colorPalette[floor(random(colorPalette.length))]
    let tileColor12 = colorPalette[floor(random(colorPalette.length))]
    let connectRandomiser = random(1)

    let tileInstance = new tileMaster01(
      w,
      h,
      flexL,
      flexR,
      flexT,
      flexB,
      tileColor1,
      tileColor2,
      tileColor3,
      tileColor4,
      tileColor5,
      tileColor6,
      tileColor7,
      tileColor8,
      tileColor9,
      tileColor10,
      tileColor11,
      tileColor12,
      connectRandomiser
    )
    tileList.push(tileInstance)
  }
}

/////////////////////////////////////////////////////////

function draw() {
  background(backgroundColor)

  for (let i = 0; i < 13; i += 1) {
    fill(colorPalette[0 + i])
    rect(10 + i * 12, 10, 10)
  }

  //   for (let i = 0; i < width/16; i += 1) {
  //     for (let j = 0; j < height/20; j += 1) {
  //     //fill(colorPalette[0 + i])
  //     push()
  //     translate(0+width/16*i,unit*0.05+height/20*j)
  //     poleQuatro(unit*0.25, unit*0.25)
  //     poleQuatro(unit*0.2, unit*0.22)
  //     poleQuatro(unit*0.17, unit*0.15)
  //     poleQuatro(unit*0.1, unit*0.09)
  //     //scale(2,0.5)
  //     //tileList[0+i].tileMaster01Draw()
  //     pop()
  //   }
  // }

  // fill(0,0,0,200)
  // rect(width/2, height/2, width, height)

  // push()
  // translate(100,100)
  // panelList[1].panelMaster01Draw()
  // pop()

  translate(0, -unit * 0.1)

  //pole soloush
  push()
  translate(width / 2, height / 2 - unit * 2.39)
  poleSolo(unit * 2.6, unit * 0.1)
  pop()

  //centre main
  push()
  translate(width / 2, height / 2 - unit)
  rotate(east)
  panelList[1].panelMaster01Draw()
  panelList[2].panelMaster01Draw()
  rotate(west)
  scale(0.5)
  panelList[3].panelMaster01Draw()
  panelList[4].panelMaster01Draw()
  pop()

  //centre right
  push()
  translate(width / 2 + unit, height / 2 - unit)
  rotate(north)
  panelList[5].panelMaster01Draw()
  panelList[6].panelMaster01Draw()
  rotate(west)
  scale(0.5)
  panelList[7].panelMaster01Draw()
  panelList[8].panelMaster01Draw()
  //added lower
  translate(-unit * 0.5, 0)
  scale(0.5)
  panelList[90].panelMaster01Draw()
  panelList[91].panelMaster01Draw()
  // //added upper
  // translate(0,unit*2)
  // panelList[145].panelMaster01Draw()
  // panelList[146].panelMaster01Draw()
  pop()

  //centre left
  push()
  translate(width / 2 - unit, height / 2 - unit)
  rotate(west)
  panelList[9].panelMaster01Draw()
  panelList[10].panelMaster01Draw()
  rotate(west)
  scale(0.5)
  panelList[11].panelMaster01Draw()
  panelList[12].panelMaster01Draw()
  scale(0.5)
  panelList[92].panelMaster01Draw()
  panelList[93].panelMaster01Draw()
  //added lower
  translate(0, -unit * 0.8)
  panelList[90].panelMaster01Draw()
  panelList[91].panelMaster01Draw()
  // //added upper
  // translate(0,unit*2)
  // panelList[145].panelMaster01Draw()
  // panelList[146].panelMaster01Draw()
  pop()

  //top top
  push()
  translate(width / 2, height / 2 - unit * 2)
  rotate(south)
  panelList[13].panelMaster01Draw()
  panelList[14].panelMaster01Draw()
  rotate(east)
  scale(0.5)
  panelList[15].panelMaster01Draw()
  panelList[16].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 2)
  rotate(north)
  scale(0.4)
  panelList[160].panelMaster01Draw()
  panelList[161].panelMaster01Draw()
  scale(0.5)
  panelList[162].panelMaster01Draw()
  panelList[163].panelMaster01Draw()
  pop()

  push()
  translate(width / 2, height / 2 - unit * 2)
  rotate(west)
  scale(0.4)
  panelList[168].panelMaster01Draw()
  panelList[169].panelMaster01Draw()
  scale(0.5)
  panelList[170].panelMaster01Draw()
  panelList[171].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 2)
  rotate(north)
  scale(0.2, 0.6)
  panelList[164].panelMaster01Draw()
  panelList[165].panelMaster01Draw()
  scale(0.5)
  panelList[166].panelMaster01Draw()
  panelList[167].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit*0.8, height / 2 - unit * 2)
  rotate(north)
  scale(0.4)
  //rect(0,0,600,800)
  panelList[296].panelMaster01Draw()
  panelList[297].panelMaster01Draw()
  scale(0.5, 0.7)
  panelList[288].panelMaster01Draw()
  panelList[276].panelMaster01Draw()
  scale(0.5, 0.3)
  translate(0,-unit*0.6)
  panelList[253].panelMaster01Draw()
  panelList[278].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit*0.82, height / 2 - unit * 2)
  rotate(north)
  scale(0.35)
  //rect(0,0,600,800)
  panelList[222].panelMaster01Draw()
  panelList[224].panelMaster01Draw()
  scale(0.7, 0.6)
  panelList[288].panelMaster01Draw()
  panelList[276].panelMaster01Draw()
  scale(0.3, 0.5)
  translate(0,0)
  panelList[253].panelMaster01Draw()
  panelList[278].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit*1, height / 2 - unit * 2)
poleQuatro(unit*0.1, unit*0.1)
scale(0.5)
poleQuatro(unit*0.1, unit*0.1)
  pop()

  push()
  translate(width / 2 + unit*1, height / 2 - unit * 2)
poleQuatro(unit*0.1, unit*0.1)
scale(0.5)
poleQuatro(unit*0.1, unit*0.1)
  pop()


  //centre lower
  push()
  translate(width / 2, height / 2)
  rotate(north)
  panelList[17].panelMaster01Draw()
  panelList[18].panelMaster01Draw()
  rotate(west)
  scale(0.5)
  panelList[19].panelMaster01Draw()
  panelList[20].panelMaster01Draw()
  scale(0.5)
  translate(unit * 1.2, 0)
  panelList[190].panelMaster01Draw()
  panelList[191].panelMaster01Draw()
  pop()

  //second from bottom
  push()
  translate(width / 2, height / 2 + unit)
  rotate(west)
  panelList[21].panelMaster01Draw()
  panelList[22].panelMaster01Draw()
  rotate(south)
  scale(0.6)
  panelList[23].panelMaster01Draw()
  panelList[24].panelMaster01Draw()
  scale(0.6)
  panelList[250].panelMaster01Draw()
  panelList[251].panelMaster01Draw()
  scale(0.6)
  panelList[252].panelMaster01Draw()
  panelList[253].panelMaster01Draw()
  pop()

  //bottom
  push()
  translate(width / 2, height / 2 + unit * 2)
  rotate(north)
  panelList[25].panelMaster01Draw()
  panelList[26].panelMaster01Draw()
  rotate(south)
  scale(0.6)
  panelList[27].panelMaster01Draw()
  panelList[28].panelMaster01Draw()
  scale(0.6)
  panelList[254].panelMaster01Draw()
  panelList[255].panelMaster01Draw()
  pop()

  //////////////////////////////
  //tabs
  //tab bottom
  push()
  translate(width / 2, height / 2 + unit * 2.6)
  rotate(south)
  scale(0.6, 0.3)
  panelList[29].panelMaster01Draw()
  panelList[30].panelMaster01Draw()
  scale(0.5)
  panelList[31].panelMaster01Draw()
  panelList[32].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.8, height / 2 + unit * 2)
  rotate(south)
  scale(0.3, 0.9)
  panelList[33].panelMaster01Draw()
  panelList[34].panelMaster01Draw()
  scale(0.5)
  panelList[35].panelMaster01Draw()
  panelList[36].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.7, height / 2 + unit * 2)
  rotate(south)
  scale(0.3, 0.9)
  panelList[37].panelMaster01Draw()
  panelList[38].panelMaster01Draw()
  scale(0.5)
  panelList[39].panelMaster01Draw()
  panelList[40].panelMaster01Draw()
  pop()

  //tabs middle
  push()
  translate(width / 2 + unit * 1, height / 2)
  rotate(south)
  scale(0.3, 0.9)
  panelList[41].panelMaster01Draw()
  panelList[42].panelMaster01Draw()
  scale(0.5)
  panelList[43].panelMaster01Draw()
  panelList[44].panelMaster01Draw()
  pop()
  //added double right
  // push()
  // translate(width / 2 + unit * 0.75, height / 2 - unit * 0.25)
  // rotate(south)
  // scale(0.4)
  // panelList[120].panelMaster01Draw()
  // panelList[121].panelMaster01Draw()
  // scale(0.5)
  // panelList[122].panelMaster01Draw()
  // panelList[123].panelMaster01Draw()
  // pop()
  // push()
  // translate(width / 2 + unit * 0.75, height / 2 + unit * 0.25)
  // rotate(south)
  // scale(0.4)
  // panelList[124].panelMaster01Draw()
  // panelList[125].panelMaster01Draw()
  // scale(0.5)
  // panelList[126].panelMaster01Draw()
  // panelList[127].panelMaster01Draw()
  // pop()

  //added double left
  push()
  translate(width / 2 - unit * 0.75, height / 2 - unit * 0.25)
  rotate(north)
  scale(0.4)
  panelList[128].panelMaster01Draw()
  panelList[129].panelMaster01Draw()
  scale(0.5)
  panelList[130].panelMaster01Draw()
  panelList[131].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.75, height / 2 + unit * 0.25)
  rotate(south)
  scale(0.4)
  panelList[132].panelMaster01Draw()
  panelList[133].panelMaster01Draw()
  scale(0.5)
  panelList[134].panelMaster01Draw()
  panelList[135].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.75, height / 2)
  rotate(north)
  scale(0.6, 0.15)
  panelList[45].panelMaster01Draw()
  panelList[46].panelMaster01Draw()
  scale(0.5)
  panelList[47].panelMaster01Draw()
  panelList[48].panelMaster01Draw()
  pop()

  //tabs top

  //link centre tab right (off-set double)
  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 1)
  rotate(south)
  scale(0.2, 0.9)
  panelList[65].panelMaster01Draw()
  panelList[66].panelMaster01Draw()
  scale(0.6)
  panelList[67].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 1.2)
  rotate(south)
  scale(0.2, 0.2)
  panelList[80].panelMaster01Draw()
  panelList[81].panelMaster01Draw()
  scale(0.6)
  panelList[82].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.8)
  rotate(east)
  scale(0.2, 0.2)
  panelList[83].panelMaster01Draw()
  panelList[84].panelMaster01Draw()
  scale(0.6)
  panelList[85].panelMaster01Draw()
  pop()

  push()
  translate(width / 2, height / 2 - unit * 0.8)
  rotate(east)
  scale(0.3, 0.3)
  panelList[97].panelMaster01Draw()
  panelList[98].panelMaster01Draw()
  scale(0.7)
  panelList[99].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.32, height / 2 - unit * 1.2)
  rotate(east)
  scale(0.2, 0.2)
  panelList[100].panelMaster01Draw()
  panelList[101].panelMaster01Draw()
  scale(0.7)
  panelList[102].panelMaster01Draw()
  pop()

  //link centre tab left (triple)
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 1)
  rotate(south)
  scale(0.2, 0.9)
  panelList[68].panelMaster01Draw()
  panelList[69].panelMaster01Draw()
  scale(0.6)
  panelList[70].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 1.2)
  rotate(south)
  scale(0.2, 0.2)
  panelList[71].panelMaster01Draw()
  panelList[72].panelMaster01Draw()
  scale(0.6)
  panelList[73].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.8)
  rotate(east)
  scale(0.2, 0.2)
  panelList[74].panelMaster01Draw()
  panelList[75].panelMaster01Draw()
  scale(0.6)
  panelList[76].panelMaster01Draw()
  pop()

  //link centre tab top
  push()
  translate(width / 2, height / 2 - unit * 1.5)
  rotate(south)
  scale(0.9, 0.2)
  panelList[71].panelMaster01Draw()
  panelList[72].panelMaster01Draw()
  scale(0.6)
  panelList[73].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.25, height / 2 - unit * 1.5)
  rotate(south)
  scale(0.25)
  panelList[150].panelMaster01Draw()
  panelList[151].panelMaster01Draw()
  scale(0.6)
  panelList[152].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.25, height / 2 - unit * 1.5)
  rotate(south)
  scale(0.25)
  panelList[153].panelMaster01Draw()
  panelList[154].panelMaster01Draw()
  scale(0.6)
  panelList[155].panelMaster01Draw()
  pop()

  //link centre tab bottom
  push()
  translate(width / 2, height / 2 - unit * 0.5)
  rotate(south)
  scale(0.9, 0.2)
  panelList[74].panelMaster01Draw()
  panelList[75].panelMaster01Draw()
  scale(0.6)
  panelList[76].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.25, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.2, 0.2)
  panelList[103].panelMaster01Draw()
  panelList[104].panelMaster01Draw()
  scale(0.7)
  panelList[105].panelMaster01Draw()
  pop()
  push()
  translate(width / 2, height / 2 - unit * 1.2)
  rotate(north)
  scale(0.3, 0.3)
  panelList[106].panelMaster01Draw()
  panelList[107].panelMaster01Draw()
  scale(0.7)
  panelList[108].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.2, 0.2)
  panelList[109].panelMaster01Draw()
  panelList[110].panelMaster01Draw()
  scale(0.7)
  panelList[111].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.2, 0.2)
  panelList[180].panelMaster01Draw()
  panelList[181].panelMaster01Draw()
  scale(0.7)
  panelList[182].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.2, 0.2)
  panelList[183].panelMaster01Draw()
  panelList[184].panelMaster01Draw()
  scale(0.7)
  panelList[185].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.2, 0.2)
  panelList[186].panelMaster01Draw()
  panelList[187].panelMaster01Draw()
  scale(0.7)
  panelList[188].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.5)
  rotate(north)
  scale(0.15, 0.15)
  panelList[112].panelMaster01Draw()
  scale(0.7)
  panelList[113].panelMaster01Draw()
  pop()

  //double tabs right
  push()
  translate(width / 2 + unit * 1.6, height / 2 - unit * 0.8)
  rotate(south)
  scale(0.4)
  panelList[49].panelMaster01Draw()
  panelList[50].panelMaster01Draw()
  scale(0.7)
  panelList[51].panelMaster01Draw()
  panelList[52].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 1.6, height / 2 - unit * 1.2)
  rotate(west)
  scale(0.4)
  panelList[53].panelMaster01Draw()
  panelList[54].panelMaster01Draw()
  scale(0.7)
  panelList[55].panelMaster01Draw()
  panelList[56].panelMaster01Draw()
  pop()

  //double tabs left
  push()
  translate(width / 2 - unit * 1.6, height / 2 - unit * 0.8)
  rotate(east)
  scale(0.4)
  panelList[57].panelMaster01Draw()
  panelList[58].panelMaster01Draw()
  scale(0.7)
  panelList[59].panelMaster01Draw()
  panelList[60].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 - unit * 1.6, height / 2 - unit * 1.2)
  rotate(south)
  scale(0.4)
  panelList[61].panelMaster01Draw()
  panelList[62].panelMaster01Draw()
  scale(0.7)
  panelList[63].panelMaster01Draw()
  panelList[64].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 1.6, height / 2 - unit * 1)
  poleSolo(unit * 1, unit * 0.2)
  pop()

  push()
  translate(width / 2 + unit * 1.6, height / 2 - unit * 1)
  rotate(south)
  poleSolo(unit * 1, unit * 0.2)
  pop()

  push()
  translate(width / 2 + unit * 0.5, height / 2 + unit * 1)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  translate(-unit * 1, 0)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  pop()

  //middle repeat
  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.25)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  translate(-unit * 1, 0)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  pop()
  push()
  translate(width / 2 + unit * 0.5, height / 2 + unit * 0.25)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  translate(-unit * 1, 0)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  pop()

  //extras mid centre
  push()
  translate(width / 2 - unit * 0.5, height / 2 + unit * 0.25)
  rotate(west)
  scale(0.2)
  panelList[200].panelMaster01Draw()
  scale(0.7)
  panelList[201].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.25)
  rotate(south)
  scale(0.2)
  panelList[202].panelMaster01Draw()
  scale(0.7)
  panelList[203].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.5, height / 2)
  rotate(south)
  scale(0.4, 0.15)
  panelList[212].panelMaster01Draw()
  scale(0.7)
  panelList[213].panelMaster01Draw()
  pop()

  //right
  push()
  translate(width / 2 + unit * 0.5, height / 2 + unit * 0.25)
  rotate(north)
  scale(0.2)
  panelList[204].panelMaster01Draw()
  scale(0.7)
  panelList[205].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.25)
  rotate(east)
  scale(0.2)
  panelList[206].panelMaster01Draw()
  scale(0.7)
  panelList[207].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.6, height / 2)
  rotate(west)
  scale(0.2, 0.8)
  panelList[208].panelMaster01Draw()
  scale(0.7)
  panelList[209].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.6, height / 2)
  rotate(west)
  scale(0.6, 0.1)
  panelList[210].panelMaster01Draw()
  scale(0.7)
  panelList[211].panelMaster01Draw()
  pop()

  //bottom repeat
  push()
  translate(0, unit * 2)
  push()

  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.25)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  translate(-unit * 1, 0)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  pop()
  push()
  translate(width / 2 + unit * 0.5, height / 2 + unit * 0.25)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  translate(-unit * 1, 0)
  poleQuatro(unit * 0.2, unit * 0.25)
  poleQuatro(unit * 0.15, unit * 0.2)
  poleQuatro(unit * 0.1, unit * 0.15)
  pop()

  //extras mid centre
  push()
  translate(width / 2 - unit * 0.5, height / 2 + unit * 0.25)
  rotate(west)
  scale(0.2)
  panelList[230].panelMaster01Draw()
  scale(0.7)
  panelList[231].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.5, height / 2 - unit * 0.25)
  rotate(south)
  scale(0.2)
  panelList[232].panelMaster01Draw()
  scale(0.7)
  panelList[233].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 - unit * 0.5, height / 2)
  rotate(south)
  scale(0.4, 0.15)
  panelList[234].panelMaster01Draw()
  scale(0.7)
  panelList[235].panelMaster01Draw()
  pop()

  //right
  push()
  translate(width / 2 + unit * 0.5, height / 2 + unit * 0.25)
  rotate(north)
  scale(0.2)
  panelList[236].panelMaster01Draw()
  scale(0.7)
  panelList[237].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.5, height / 2 - unit * 0.25)
  rotate(east)
  scale(0.2)
  panelList[238].panelMaster01Draw()
  scale(0.7)
  panelList[239].panelMaster01Draw()
  pop()

  push()
  translate(width / 2 + unit * 0.6, height / 2)
  rotate(west)
  scale(0.2, 0.8)
  panelList[240].panelMaster01Draw()
  scale(0.7)
  panelList[241].panelMaster01Draw()
  pop()
  push()
  translate(width / 2 + unit * 0.6, height / 2)
  rotate(west)
  scale(0.6, 0.1)
  panelList[242].panelMaster01Draw()
  scale(0.7)
  panelList[243].panelMaster01Draw()
  pop()
  pop()

  // //cord connections
  //   connectorArc(
  //     width / 2 - unit,
  //     height / 2 - unit,
  //     width / 2 - unit*0.5,
  //     height / 2-unit*0.25
  //   )
  //   connectorArc(
  //     width / 2 - unit*1.6,
  //     height / 2 - unit*1.2,
  //     width / 2 - unit*0.5,
  //     height / 2 - unit*2
  //   )
  //   connectorArc(
  //     width / 2 - unit*1.6,
  //     height / 2 - unit*0.8,
  //     width / 2 + unit*0.75,
  //     height / 2 + unit*0.25
  //   )
  //   connectorArc(
  //     width / 2 + unit*0.5,
  //     height / 2 - unit+unit*0.2,
  //     width / 2,
  //     height / 2
  //   )
  //   connectorArc(
  //     width / 2 + unit*0.5,
  //     height / 2 - unit-unit*0.2,
  //     width / 2-unit*0.5,
  //     height / 2-unit*0.5
  //   )

  //translate(width / 2, height / 2)
  noStroke()
  //fill(colorPalette[8])
  // panelSingle(
  //   north,
  //   0.8,
  //   0,
  //   0,
  //   unit,
  //   unit * 0.5,
  //   unit * 0.02,
  //   unit * 0.01,
  //   unit * 0.015,
  //   unit * 0.008
  // )
}

function panelSingle(
  panelW,
  panelH,
  panelflexL,
  panelflexR,
  panelflexT,
  panelflexB
) {
  push()
  stroke(90, 100, 100, 150)
  noStroke()
  //main shape
  //rect(0 + w * 0.05, 0, w * 0.9, h)

  //champhered corner
  beginShape()
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  vertex(0 - panelW * 0.4, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  endShape(CLOSE)

  //non-champhered corner
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.4, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.4, 0 + panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  endShape(CLOSE)

  //left
  rect(
    0 - panelW * 0.4 + panelW * (0.05 * panelflexL),
    0,
    panelW * (0.1 * panelflexL),
    panelH
  )
  //right
  rect(
    0 + panelW * 0.4 - panelW * (0.05 * panelflexR),
    0,
    panelW * (0.1 * panelflexR),
    panelH
  )
  push()

  fill(colorPalette[floor(random(colorPalette.length))])
  //top
  rect(
    0,
    0 - panelH * 0.5 + panelH * (0.05 * panelflexT),
    panelW * 0.8,
    panelH * (0.1 * panelflexT)
  )
  fill(colorPalette[floor(random(colorPalette.length))])
  //stroke(100,0,0,55)
  //bottom
  rect(
    0,
    0 + panelH * 0.5 - panelH * (0.05 * panelflexB),
    panelW * 0.8,
    panelH * (0.1 * panelflexB)
  )
  pop()

  //translucent overlays
  push()
  scale(0.9)
  fill(colorPalette[floor(random(colorPalette.length))])
  fill(0, 0, 100, 20)
  //this was previously white with 20 alpha
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  endShape(CLOSE)
  scale(0.9)
  fill(colorPalette[floor(random(colorPalette.length))])
  fill(0, 0, 100, 20)
  //this was previously white with 20 alpha
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  endShape(CLOSE)
  pop()

  //lines
  //   for (let i = 0; i < panelH; i+=1) {
  //     stroke(backgroundColor)
  //     strokeWeight(3)
  // //line(0-panelW/2, (0-panelH/2)+i, 0+panelW/2, (0-panelH/2)+i)
  // // stroke(0,0,100,255)
  // // strokeWeight(1)
  // // line(0-panelW/2+30, (0-panelH/2-1)+i, 0+panelW/2-30, (0-panelH/2-1)+i)
  // noStroke()
  // fill(colorPalette[floor(random(colorPalette.length))])
  // rect(0-panelW/2+random(60,300), (0-panelH/2-1)+i, 5)
  //   }

  // rect(0, 0 - h / 4 - h * 0.1, w, h / 2 - h * 0.2)
  // rect(0, 0 + h / 4 + h * 0.1, w, h / 2 - h * 0.2)
  // rect(0 + w / 4 + w * 0.1, 0, w / 2 - w * 0.2, h)
  // rect(0 - w / 4 - w * 0.1, 0, w / 2 - w * 0.2, h)
  // //overlays
  // fill(255, 0, 100, 50)
  // rect(0, 0, w * 0.9, h * 0.9)
  // fill(255, 0, 100, 50)
  // rect(0, 0, w * 0.8, h * 0.8)

  // //white line border
  // noFill()
  // push()
  // stroke(backgroundColor)
  // stroke(0,0,100,255)
  // strokeWeight(strokeWeightThin)
  // scale(0.8)
  // beginShape()
  // vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  // vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  // vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  // vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  // vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  // endShape(CLOSE)
  // pop()
  //edge locks
  noStroke()
  fill(backgroundColor) //black / background
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.2, panelH * 0.5)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.2, panelH * 0.5)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.5, panelH * 0.2)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.5, panelH * 0.2)
  fill(220, 76, 98, 255) //highlight //blue is 220
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.1, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.1, panelH * 0.15)
  fill(0, 0, 100, 100) //white
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.07)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.07)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.07, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.07, panelH * 0.15)
  fill(0, 0, 100, 100) //white
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.02)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.02)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.02, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.02, panelH * 0.15)
  fill(0, 0, 100, 150) //white
  rect(
    0 - panelW / 2 - panelW * 0.08,
    panelH * 0.02,
    panelW * 0.1,
    panelH * 0.01
  )
  rect(
    0 + panelW / 2 + panelW * 0.08,
    -panelH * 0.02,
    panelW * 0.1,
    panelH * 0.01
  )
  rect(
    panelH * 0.02,
    0 - panelH / 2 - panelH * 0.08,
    panelW * 0.01,
    panelH * 0.15
  )
  rect(
    -panelH * 0.02,
    0 + panelH / 2 + panelH * 0.08,
    panelW * 0.01,
    panelH * 0.15
  )

  fill(backgroundColor)
  rect(0, 0, unit * 0.2)
  fill(220, 76, 98, 255) //highlight color //blue is 220
  rect(0, 0, unit * 0.06)
  fill(20, 76, 98, 255) //highlight color //orange is 20
  rect(unit * 0.003, 0, unit * 0.03, unit * 0.06)
  pop()
}

function tileSingle(
  panelW,
  panelH,
  panelflexL,
  panelflexR,
  panelflexT,
  panelflexB
) {
  push()
  stroke(90, 100, 100, 150)
  noStroke()
  //main shape
  //rect(0 + w * 0.05, 0, w * 0.9, h)

  //champhered corner
  beginShape()
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  vertex(0 - panelW * 0.4, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  endShape(CLOSE)

  //non-champhered corner
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.4, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.4, 0 + panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  endShape(CLOSE)

  //left
  rect(
    0 - panelW * 0.4 + panelW * (0.05 * panelflexL),
    0,
    panelW * (0.1 * panelflexL),
    panelH
  )
  //right
  rect(
    0 + panelW * 0.4 - panelW * (0.05 * panelflexR),
    0,
    panelW * (0.1 * panelflexR),
    panelH
  )
  //top
  rect(
    0,
    0 - panelH * 0.5 + panelH * (0.05 * panelflexT),
    panelW * 0.8,
    panelH * (0.1 * panelflexT)
  )
  //bottom
  rect(
    0,
    0 + panelH * 0.5 - panelH * (0.05 * panelflexB),
    panelW * 0.8,
    panelH * (0.1 * panelflexB)
  )

  //translucent overlays
  push()
  scale(0.9)
  fill(colorPalette[floor(random(colorPalette.length))])
  fill(backgroundColor)
  //this was previously white with 20 alpha
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  endShape(CLOSE)
  scale(0.9)
  fill(colorPalette[floor(random(colorPalette.length))])
  //fill(backgroundColor)
  //this was previously white with 20 alpha
  beginShape()
  vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  endShape(CLOSE)
  pop()

  // rect(0, 0 - h / 4 - h * 0.1, w, h / 2 - h * 0.2)
  // rect(0, 0 + h / 4 + h * 0.1, w, h / 2 - h * 0.2)
  // rect(0 + w / 4 + w * 0.1, 0, w / 2 - w * 0.2, h)
  // rect(0 - w / 4 - w * 0.1, 0, w / 2 - w * 0.2, h)
  // //overlays
  // fill(255, 0, 100, 50)
  // rect(0, 0, w * 0.9, h * 0.9)
  // fill(255, 0, 100, 50)
  // rect(0, 0, w * 0.8, h * 0.8)

  // //white line border
  // noFill()
  // push()
  // stroke(backgroundColor)
  // stroke(0,0,100,255)
  // strokeWeight(strokeWeightThin)
  // scale(0.8)
  // beginShape()
  // vertex(0 + panelW * 0.5, 0 - panelH * 0.5)
  // vertex(0 + panelW * 0.5, 0 + panelH * 0.5)
  // vertex(0 - panelW * 0.5, 0 + panelH * 0.5)
  // vertex(0 - panelW * 0.5, 0 - panelH * 0.5 + panelH * 0.2)
  // vertex(0 - panelW * 0.4, 0 - panelH * 0.5)
  // endShape(CLOSE)
  // pop()
  //edge locks
  noStroke()
  fill(backgroundColor) //black / background
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.2, panelH * 0.5)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.2, panelH * 0.5)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.5, panelH * 0.2)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.5, panelH * 0.2)
  // fill(220, 76, 98, 255) //highlight //blue is 220
  // rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  // rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  // rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.1, panelH * 0.15)
  // rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.1, panelH * 0.15)
  // fill(0, 0, 100, 100) //white
  // rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.05)
  // rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.05)
  // rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.05, panelH * 0.15)
  // rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.05, panelH * 0.15)
  // fill(0, 0, 100, 50) //white
  // rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.02)
  // rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.02)
  // rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.02, panelH * 0.15)
  // rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.02, panelH * 0.15)

  fill(backgroundColor)
  rect(0, 0, unit * 0.1)
  fill(220, 76, 98, 255) //highlight color //blue is 220
  rect(0, 0, unit * 0.06)
  pop()
}

function poleSolo(panelW, panelH) {
  //edge locks
  noStroke()
  fill(backgroundColor) //black / background
  //fill(0, 76, 98, 255)
  //rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.2, panelH * 0.4)
  //rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.2, panelH * 0.4)
  //rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.4, panelH * 0.2)
  //rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.4, panelH * 0.2)

  fill(220, 76, 98, 255) //highlight //blue is 220
  rect(0 - panelW * 0.15, 0, panelW * 0.1, panelH * 0.25)
  rect(0, 0, panelW * 0.1, panelH * 0.1)
  rect(0 + panelW * 0.15, 0, panelW * 0.1, panelH * 0.25)
  //rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.1, panelH * 0.15)
  //rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.1, panelH * 0.15)
  fill(0, 0, 100, 100) //white
  rect(0 - panelW * 0.15, 0, panelW * 0.1, panelH * 0.15)
  rect(0, 0, panelW * 0.1, panelH * 0.05)
  rect(0 + panelW * 0.15, 0, panelW * 0.1, panelH * 0.15)
  //rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.05, panelH * 0.15)
  //rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.05, panelH * 0.15)
  fill(0, 0, 100, 50) //white
  rect(0 - panelW * 0.15, 0, panelW * 0.1, panelH * 0.05)
  rect(0, 0, panelW * 0.1, panelH * 0.02)
  rect(0 + panelW * 0.15, 0, panelW * 0.1, panelH * 0.05)
  //rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.02, panelH * 0.15)
  //rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.02, panelH * 0.15)
}

function poleQuatro(panelW, panelH) {
  push()
  //edge locks
  noStroke()
  fill(backgroundColor) //black / background
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.2, panelH * 1)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.2, panelH * 1)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 1, panelH * 0.2)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 1, panelH * 0.2)
  fill(220, 76, 98, 255) //highlight //blue is 220
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.2)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.2)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.2, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.2, panelH * 0.15)
  fill(0, 0, 100, 100) //white
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.1)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.1, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.1, panelH * 0.15)
  fill(0, 0, 100, 50) //white
  rect(0 - panelW / 2 - panelW * 0.08, 0, panelW * 0.15, panelH * 0.05)
  rect(0 + panelW / 2 + panelW * 0.08, 0, panelW * 0.15, panelH * 0.05)
  rect(0, 0 - panelH / 2 - panelH * 0.08, panelW * 0.05, panelH * 0.15)
  rect(0, 0 + panelH / 2 + panelH * 0.08, panelW * 0.05, panelH * 0.15)

  // fill(backgroundColor)
  // rect(0, 0, unit * 0.2)
  // fill(220, 76, 98, 255) //highlight color //blue is 220
  // rect(0, 0, unit * 0.06)
  pop()
}

class panelMaster01 {
  constructor(
    w,
    h,
    flexL,
    flexR,
    flexT,
    flexB,
    tileColor1,
    tileColor2,
    tileColor3,
    tileColor4,
    tileColor5,
    tileColor6,
    tileColor7,
    tileColor8,
    tileColor9,
    tileColor10,
    tileColor11,
    tileColor12,
    connectRandomiser
  ) {
    this.w = w
    this.h = h
    this.flexL = flexL
    this.flexR = flexR
    this.flexT = flexT
    this.flexB = flexB
    this.tileColor1 = tileColor1
    this.tileColor2 = tileColor2
    this.tileColor3 = tileColor3
    this.tileColor4 = tileColor4
    this.tileColor5 = tileColor5
    this.tileColor6 = tileColor6
    this.tileColor7 = tileColor7
    this.tileColor8 = tileColor8
    this.tileColor9 = tileColor9
    this.tileColor10 = tileColor10
    this.tileColor11 = tileColor11
    this.tileColor12 = tileColor12
    this.connectRandomiser = connectRandomiser
  }
  panelMaster01Draw() {
    push()
    //translate(panelThird, panelThird / 2)
    //scale(this.scale2)
    fill(this.tileColor2)
    panelSingle(this.w, this.h, this.flexL, this.flexR, this.flexT, this.flexB)

    fill(255)
    textSize(20)
    //text('2', 0, 0)
    pop()
  }
}

class tileMaster01 {
  constructor(
    w,
    h,
    flexL,
    flexR,
    flexT,
    flexB,
    tileColor1,
    tileColor2,
    tileColor3,
    tileColor4,
    tileColor5,
    tileColor6,
    tileColor7,
    tileColor8,
    tileColor9,
    tileColor10,
    tileColor11,
    tileColor12,
    connectRandomiser
  ) {
    this.w = w
    this.h = h
    this.flexL = flexL
    this.flexR = flexR
    this.flexT = flexT
    this.flexB = flexB
    this.tileColor1 = tileColor1
    this.tileColor2 = tileColor2
    this.tileColor3 = tileColor3
    this.tileColor4 = tileColor4
    this.tileColor5 = tileColor5
    this.tileColor6 = tileColor6
    this.tileColor7 = tileColor7
    this.tileColor8 = tileColor8
    this.tileColor9 = tileColor9
    this.tileColor10 = tileColor10
    this.tileColor11 = tileColor11
    this.tileColor12 = tileColor12
    this.connectRandomiser = connectRandomiser
  }
  tileMaster01Draw() {
    push()
    //translate(panelThird, panelThird / 2)
    //scale(this.scale2)
    fill(this.tileColor2)
    tileSingle(this.w, this.h, this.flexL, this.flexR, this.flexT, this.flexB)

    fill(255)
    textSize(20)
    //text('2', 0, 0)
    pop()
  }
}

function connectorArc(p1x, p1y, p2x, p2y) {
  //draw the background elements
  //line(p1.x, p1.y, p2.x, p2.y)
  // Calculate the midpoint between p1 and p2 for the arc control points
  let midX = (p1x + p2x) / 2
  let midY = (p1y + p2y) / 2

  // Calculate the control points for the arcs
  let controlX1 = (p1x + midX) / 2
  let controlY1 = p1y
  let controlX2 = (p2x + midX) / 2
  let controlY2 = p2y

  push()
  noFill()

  // stroke(255)
  // strokeWeight(3)
  // // Draw the first arc
  // beginShape()
  // vertex(p1x, p1y)
  // quadraticVertex(controlX1, controlY1, midX, midY)
  // endShape()

  // // Draw the second arc
  // beginShape()
  // vertex(midX, midY)
  // quadraticVertex(controlX2, controlY2, p2x, p2y)
  // endShape()

  stroke(random(0, 30), 50, 100, 100)
  strokeWeight(unit * 0.015)
  // Draw the first arc
  beginShape()
  vertex(p1x, p1y)
  quadraticVertex(controlX1, controlY1, midX, midY)
  endShape()

  // Draw the second arc
  beginShape()
  vertex(midX, midY)
  quadraticVertex(controlX2, controlY2, p2x, p2y)
  endShape()

  stroke(backgroundColor)
  strokeWeight(unit * 0.004)
  // Draw the first arc
  beginShape()
  vertex(p1x, p1y)
  quadraticVertex(controlX1, controlY1, midX, midY)
  endShape()

  // Draw the second arc
  beginShape()
  vertex(midX, midY)
  quadraticVertex(controlX2, controlY2, p2x, p2y)
  endShape()

  // noStroke()
  // fill(10, 70, 100, 200)
  // rect(p1x, p1y, unit * 0.015)
  // rect(p2x, p2y, unit * 0.015)
  // rect(midX, midY, unit * 0.015)
  // fill(10, 0, 100, 255)
  // rect(p1x, p1y, unit * 0.01)
  // rect(p2x, p2y, unit * 0.01)
  // rect(midX, midY, unit * 0.01)

  pop()
}

function setLineDash(list) {
  drawingContext.setLineDash(list)
}
