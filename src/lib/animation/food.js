import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"
import BezierEasing from "bezier-easing"

/* Global vars */
let canvas
let context
let grid
let cursor
let animation

const updateMvmtLine = () => {
  cursor.startingPointIndex = cursor.destinationPointIndex
  cursor.destinationPointIndex = random.rangeFloor(0, grid.size * grid.size - 1)
  animation.newLineTime = animation.currentTime
  animation.linesTraveled = animation.linesTraveled + 1
  if (
    animation.linesTraveled >= animation.linesToTravel &&
    !animation.foundFood
  ) {
    animation.foundFood = true
  }
}

/* Cursor */
const drawCursor = () => {
  const rotation = Math.PI * animation.currentTime * cursor.rotationScalar
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
  const [startX, startY] = grid.options[cursor.startingPointIndex].point
  const [endX, endY] = grid.options[cursor.destinationPointIndex].point
  const lineMvmtEaseFn =
    animation.linesTraveled === animation.linesToTravel - 1
      ? cursor.easingFns.lastLineMvmt
      : cursor.easingFns.mainLineMvmt
  const lineCompletePercentage =
    (animation.currentTime - animation.newLineTime) / animation.lineTravelSpeed
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
    (animation.totalTime + animation.currentTime) / animation.totalTime - 1
  if (animCompletePercentage <= 1) {
    cursor.rotationScalar = lerp(
      cursor.initialRotationScalar,
      0,
      cursor.easingFns.main(animCompletePercentage)
    )
    cursor.distanceFromOrbitCenter = lerp(
      cursor.initialDistanceFromOrbitCenter,
      0,
      cursor.easingFns.main(animCompletePercentage)
    )
  }
}

/* Grid */
const drawGrid = () => {
  grid.options.forEach((data, index) => {
    const color = grid.palette[index % grid.palette.length]
    context.fillStyle = color

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, grid.orbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

const draw = time => {
  /* Clear the canvas */
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)

  /* Calculate global time in seconds */
  if (animation.startTime === null) {
    animation.startTime = time
  }
  animation.currentTime = (time - animation.startTime) / 1000

  drawGrid()
  drawCursor()
  moveCursor()

  if (!animation.foundFood) {
    window.requestAnimationFrame(draw)
  } else {
    console.log("Animation done.")
  }
}

const getGridOptions = (foodOptions, grid) => {
  const options = []
  const shuffledFoodOptions = random.shuffle(foodOptions)
  // TODO Set grid size based on desktop vs mobile
  let counter = 0
  for (let i = 0; i < grid.size; i++) {
    for (let j = 0; j < grid.size; j++) {
      const u = i / (grid.size - 1)
      const x = lerp(grid.margin, canvas.width - grid.margin, u)
      const v = j / (grid.size - 1)
      const y = lerp(grid.margin, canvas.height - grid.margin, v)
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

const init = foodOptions => {
  /* Grid */
  grid = {
    size: 4, // total size = grid.size x grid.size
    margin: canvas.width / 5,
    orbRadius: canvas.width / 25,
    palette: [
      "rgb(185,211,176)",
      "rgb(129,189,164)",
      "rgb(178,135,116)",
      "rgb(248,143,121)",
      "rgb(246,170,147)",
    ],
  }
  grid.options = getGridOptions(foodOptions, grid)

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

    easingFns: {
      mainLineMvmt: BezierEasing(0.76, 0.02, 0.73, 0.93),
      lastLineMvmt: BezierEasing(0.7, 0.01, 0, 0.49),
      main: BezierEasing(1, 0.09, 0.55, 0.91),
    },

    radius: canvas.width / 30,
    initialDistanceFromOrbitCenter: canvas.width / 3,
    distanceFromOrbitCenter: canvas.width / 3,
    initialRotationScalar: 5,
    rotationScalar: 5,
    startingPointIndex: Math.round((grid.size * grid.size) / 2),
    destinationPointIndex: random.rangeFloor(0, grid.size * grid.size - 1),
  }

  /* Animation controls*/
  const lineTravelSpeed = 1
  const linesToTravel = 5
  animation = {
    startTime: null,
    currentTime: 0,
    newLineTime: 0,
    lineTravelSpeed,
    linesToTravel,
    linesTraveled: 0,
    totalTime: lineTravelSpeed * linesToTravel,
  }

  window.requestAnimationFrame(draw)
}

// TODO Add draw function
export const setupCanvas = foodOptions => {
  if (document && window) {
    canvas = document.getElementById("#food-canvas")
    context = canvas.getContext("2d")
    init(foodOptions)
  }
}
