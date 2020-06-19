import { init, updateCursorPosition } from "./setup"

/* Cursor */
const drawCursor = (cursor, animation, context) => {
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

/* Grid */
const drawGrid = (grid, context) => {
  grid.options.forEach((data, index) => {
    const color = grid.palette[index % grid.palette.length]
    context.fillStyle = color

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, grid.orbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

/* Main drawing function */
const draw = (grid, cursor, animation, context, canvas, time) => {
  /* Clear the canvas */
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)

  /* Calculate global time in seconds */
  if (animation.startTime === null) {
    animation.startTime = time
  }
  animation.currentTime = (time - animation.startTime) / 1000

  drawGrid(grid, context)
  drawCursor(cursor, animation, context)
  updateCursorPosition(cursor, grid, animation)

  if (!animation.done) {
    window.requestAnimationFrame(
      draw.bind(null, grid, cursor, animation, context, canvas)
    )
  } else {
    console.log("Animation done.")
  }
}

// TODO Add draw function
export const setupCanvas = foodOptions => {
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")
    const { cursor, grid, animation } = init(foodOptions, canvas)

    window.requestAnimationFrame(
      draw.bind(null, grid, cursor, animation, context, canvas)
    )
  }
}
