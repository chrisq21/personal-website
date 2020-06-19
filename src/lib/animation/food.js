import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"
import BezierEasing from "bezier-easing"

/* Variables */

/* Canvas */
let canvas
let context

/* Grid */
let margin
let gridData = []
let gridSize
let gridOrbRadius
const palette = [
  "rgb(185,211,176)",
  "rgb(129,189,164)",
  "rgb(178,135,116)",
  "rgb(248,143,121)",
  "rgb(246,170,147)",
]

/* Cursor */
const mainLineMvmtEaseFn = BezierEasing(0.76, 0.02, 0.73, 0.93)
const lastLineMvmtEaseFn = BezierEasing(0.7, 0.01, 0, 0.49)
const mainCursorEaseFn = BezierEasing(1, 0.09, 0.55, 0.91)
let cursor

/* Animation controls */
let totalAnimationTime
let startTime = null
let currentTime = 0
let foundFood = false
let newLineTime = 0 // The time that a new line was selected for the cursor to travel
let lineTravelSpeed = 1 // The length of time in seconds to move from point A to point B
let linesToTravel = 5
let linesTraveled = 0

const init = () => {
  /* Grid */
  gridSize = 4 // total size = gridSize x gridSize
  margin = canvas.width / 5
  gridOrbRadius = canvas.width / 25

  /* Cursor */
  cursor = {
    center: {
      x: 0,
      y: 0,
    },
    orbitCenter: {
      x: 0,
      y: 0,
    },
    radius: canvas.width / 30,
    initialDistanceFromOrbitCenter: canvas.width / 3,
    distanceFromOrbitCenter: canvas.width / 3,
    initialRotationScalar: 5,
    rotationScalar: 5,
    startingPointIndex: Math.round((gridSize * gridSize) / 2),
    destinationPointIndex: random.rangeFloor(0, gridSize * gridSize - 1),
  }

  /* Animation controls*/
  totalAnimationTime = lineTravelSpeed * linesToTravel
}

const getGridData = (foodOptions, width, height) => {
  const options = []
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

const updateMvmtLine = () => {
  cursor.startingPointIndex = cursor.destinationPointIndex
  cursor.destinationPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  newLineTime = currentTime
  linesTraveled++
  if (linesTraveled >= linesToTravel && !foundFood) {
    foundFood = true
  }
}

/* Cursor */
const drawCursor = () => {
  const rotation = Math.PI * currentTime * cursor.rotationScalar
  cursor.center.x =
    cursor.orbitCenter.x + cursor.distanceFromOrbitCenter * Math.sin(rotation)
  cursor.center.y =
    cursor.orbitCenter.y + cursor.distanceFromOrbitCenter * Math.cos(rotation)
  context.beginPath()
  context.fillStyle = "rgb(185,211,176)"
  context.arc(cursor.center.x, cursor.center.y, cursor.radius, 0, Math.PI * 2)
  context.fill()
}

const moveCursor = () => {
  /* Move cursor across a specified line */
  const [startX, startY] = gridData[cursor.startingPointIndex].point
  const [endX, endY] = gridData[cursor.destinationPointIndex].point
  const lineMvmtEaseFn =
    linesTraveled === linesToTravel - 1
      ? lastLineMvmtEaseFn
      : mainLineMvmtEaseFn
  const lineCompletePercentage = (currentTime - newLineTime) / lineTravelSpeed
  if (lineCompletePercentage <= 1) {
    cursor.orbitCenter.x = lerp(
      startX,
      endX,
      lineMvmtEaseFn(lineCompletePercentage)
    )
    cursor.orbitCenter.y = lerp(
      startY,
      endY,
      lineMvmtEaseFn(lineCompletePercentage)
    )
  } else {
    updateMvmtLine()
  }

  /* Update the cursors rotation speed and orbit distance based off of animation timing */
  const animCompletePercentage =
    (totalAnimationTime + currentTime) / totalAnimationTime - 1

  if (animCompletePercentage <= 1) {
    cursor.rotationScalar = lerp(
      cursor.initialRotationScalar,
      0,
      mainCursorEaseFn(animCompletePercentage)
    )
    cursor.distanceFromOrbitCenter = lerp(
      cursor.initialDistanceFromOrbitCenter,
      0,
      mainCursorEaseFn(animCompletePercentage)
    )
  }
}

/* Grid */
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
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)

  /* Calculate global time in seconds */
  if (startTime === null) {
    startTime = time
  }
  currentTime = (time - startTime) / 1000

  drawGrid()
  drawCursor()
  moveCursor()

  if (!foundFood) {
    window.requestAnimationFrame(draw)
  } else {
    console.log("Animation done.")
  }
}

// TODO Add draw function
export const setupCanvas = foodOptions => {
  if (document && window) {
    canvas = document.getElementById("#food-canvas")
    init()

    context = canvas.getContext("2d")
    gridData = getGridData(foodOptions, canvas.width, canvas.height)
    window.requestAnimationFrame(draw)
  }
}
