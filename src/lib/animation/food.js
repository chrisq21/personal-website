import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"

/* Variables */

/* Canvas */
let canvasHeight
let canvasWidth
let context
let startTime = null
let currentTime = 0

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
const cursor = {
  x: 0,
  y: 0,
  radius: 30,
}

/* Animation Timing */
let newLineTime = 0 // The time that a new line was selected for the cursor to travel
let lineTravelSpeed = 1 // The length of time in seconds to move from point A to point B

const drawCursor = () => {
  const [startX, startY] = gridData[cursor.previousPointIndex].point
  const [endX, endY] = gridData[cursor.nextPointIndex].point

  // Value from 0 -> 1 representing the percentage distance completed from startPoint to endPoint
  const lineCompletePercentage = (currentTime - newLineTime) / lineTravelSpeed
  // if (!foundFood) {
  if (lineCompletePercentage <= 1) {
    // Update x and y with custom easing function

    cursor.x = lerp(startX, endX, lineCompletePercentage)
    cursor.y = lerp(startY, endY, lineCompletePercentage)
  }

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

const init = () => {
  /* Canvas */
  canvasHeight = 1000
  canvasWidth = 1000

  /* Cursor */
  const previousPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  const nextPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
  cursor.previousPointIndex = previousPointIndex
  cursor.nextPointIndex = nextPointIndex
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

  window.requestAnimationFrame(draw)
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
