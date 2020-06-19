import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"
import BezierEasing from "bezier-easing"

/* Variables */

/* Canvas */
let canvasHeight
let canvasWidth
let context

/* Grid */
let gridData = []
const gridSize = 4 // total size = gridSize x gridSize
const gridOrbRadius = 50
const palette = [
  "rgb(185,211,176)",
  "rgb(129,189,164)",
  "rgb(178,135,116)",
  "rgb(248,143,121)",
  "rgb(246,170,147)",
]

/* Cursor */
const lineMvmtEaseFn = BezierEasing(0.76, 0.02, 0.73, 0.93)
const lastLineMvmtEaseFn = BezierEasing(0.7, 0.01, 0, 0.49)
const cursor = {
  x: 0,
  y: 0,
  radius: 30,
}
let orbitCenterX
let orbitCenterY
let distanceFromOrbitCenter
let rotationScalar

/* Animation controls */
let startTime = null
let currentTime = 0
let foundFood = false
let newLineTime = 0 // The time that a new line was selected for the cursor to travel
let lineTravelSpeed = 1 // The length of time in seconds to move from point A to point B
let linesToTravel = 5
let linesTraveled = 0

const init = () => {
  /* Canvas */
  canvasHeight = 1000
  canvasWidth = 1000

  /* Cursor */
  const previousPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  const nextPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  cursor.previousPointIndex = previousPointIndex
  cursor.nextPointIndex = nextPointIndex
  distanceFromOrbitCenter = 100
  rotationScalar = 1
}

const getGridData = (foodOptions, width, height) => {
  const options = []
  const margin = 100
  const shuffledFoodOptions = random.shuffle(foodOptions)
  // TODO Set grid size based on desktop vs mobile
  let counter = 0
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const u = i / (gridSize - 1)
      const x = lerp(margin, width - margin, u)
      const v = j / (gridSize - 1)
      const y = lerp(margin, height - margin, v)
      const index = counter % shuffledFoodOptions.length
      const foodOptionData = shuffledFoodOptions[index].node
      options.push({
        point: [x, y],
        shouldAnimate: false,
        animationStartTime: 0,
        foodOptionData,
      })
      counter++
    }
  }

  return options
}

const moveToNextPoint = () => {
  cursor.previousPointIndex = cursor.nextPointIndex
  cursor.nextPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  newLineTime = currentTime
  linesTraveled++
  if (linesTraveled >= linesToTravel && !foundFood) {
    foundFood = true
  }
}

/* Drawing functions */

const drawCursor = () => {
  const [startX, startY] = gridData[cursor.previousPointIndex].point
  const [endX, endY] = gridData[cursor.nextPointIndex].point

  const easeFn =
    linesTraveled === linesToTravel - 1 ? lastLineMvmtEaseFn : lineMvmtEaseFn
  const lineCompletePercentage = (currentTime - newLineTime) / lineTravelSpeed
  if (lineCompletePercentage <= 1) {
    orbitCenterX = lerp(startX, endX, easeFn(lineCompletePercentage))
    orbitCenterY = lerp(startY, endY, easeFn(lineCompletePercentage))
  } else {
    moveToNextPoint()
  }

  const rotation = ((2 * Math.PI * currentTime) / 2) * rotationScalar

  cursor.x = orbitCenterX + distanceFromOrbitCenter * Math.sin(rotation)
  cursor.y = orbitCenterY + distanceFromOrbitCenter * Math.cos(rotation)

  context.beginPath()
  context.fillStyle = "rgb(185,211,176)"
  context.arc(cursor.x, cursor.y, cursor.radius, 0, Math.PI * 2)
  context.fill()
}

const drawGrid = () => {
  gridData.forEach((data, index) => {
    const color = palette[index % palette.length]
    context.fillStyle = color

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, gridOrbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

const draw = time => {
  /* Clear the canvas */
  context.fillStyle = "black"
  context.fillRect(0, 0, canvasWidth, canvasHeight)
  if (startTime === null) {
    startTime = time
  }
  currentTime = (time - startTime) / 1000 // Calculate global time to seconds

  drawGrid()
  drawCursor()

  if (!foundFood) {
    window.requestAnimationFrame(draw)
  } else {
    console.log("Animation done")
  }
}

// TODO Add draw function
export const setupCanvas = foodOptions => {
  init()
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    // TODO update canvas width after resize
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    context = canvas.getContext("2d")
    gridData = getGridData(foodOptions, canvas.width, canvas.height)
    // draw(context)
    window.requestAnimationFrame(draw)
  }
}
