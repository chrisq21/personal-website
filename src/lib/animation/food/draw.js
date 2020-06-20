import { updateCursorPosition, checkCollisions } from "./logic"
import { lerp } from "canvas-sketch-util/math"

/* Cursor */
const drawCursor = (cursor, animation, context) => {
  context.beginPath()
  context.fillStyle = "rgb(185,211,176)"
  context.arc(cursor.center.x, cursor.center.y, cursor.radius, 0, Math.PI * 2)
  context.fill()
}

/* Grid */
const drawGrid = (grid, context, animation) => {
  grid.options.forEach((data, index) => {
    const color = grid.palette[index % grid.palette.length]
    context.fillStyle = color

    if (data.shouldAnimate) {
      grid.options[index].shouldAnimate = false
      grid.ripples.animations.push({
        startTime: animation.currentTime,
        gridIndex: index,
        deltaTime: 0,
        maxAlpha: grid.ripples.maxAlpha,
        color,
      })
    }

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, grid.orbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

export const drawOrbRipples = (grid, animation, context) => {
  let alpha
  let percUp
  let percDown

  grid.ripples.animations.forEach((rippleAnimation, index) => {
    const { gridIndex, startTime, deltaTime, maxAlpha, color } = rippleAnimation
    const [x, y] = grid.options[gridIndex].point

    const rippleAnimPercentage = deltaTime / grid.ripples.totalTime

    if (rippleAnimPercentage < 0.5) {
      percUp = rippleAnimPercentage * 2
      alpha = lerp(0, maxAlpha, grid.ripples.easeFn(percUp))
    } else {
      percDown = rippleAnimPercentage * 2 - 1
      alpha = lerp(maxAlpha, 0, grid.ripples.easeFn(percDown))
    }

    const colorArray = color.split(")")
    for (let i = 1; i < grid.ripples.count; i++) {
      const newAlpha = alpha / i
      context.beginPath()

      const newColor = `${colorArray[0]},${newAlpha})`
      context.fillStyle = newColor
      context.arc(
        x,
        y,
        grid.orbRadius + grid.ripples.radiusAddition * i,
        0,
        Math.PI * 2
      )
      context.fill()
    }

    // Update values
    grid.ripples.animations[index].deltaTime = animation.currentTime - startTime

    if (rippleAnimPercentage >= 1) {
      delete grid.ripples.animations[index]
    }
  })
}

/* Main drawing function */
export const draw = (grid, cursor, animation, context, canvas, time) => {
  /* Clear the canvas */
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)

  /* Calculate global time in seconds */
  if (animation.startTime === null) {
    animation.startTime = time
  }
  animation.currentTime = (time - animation.startTime) / 1000

  drawGrid(grid, context, animation)
  drawCursor(cursor, animation, context)

  if (!animation.done) {
    updateCursorPosition(cursor, grid, animation)
    checkCollisions(animation, grid, cursor)
  }

  drawOrbRipples(grid, animation, context)

  if (animation.currentTime <= animation.totalTime + grid.ripples.totalTime) {
    window.requestAnimationFrame(
      draw.bind(null, grid, cursor, animation, context, canvas)
    )
  } else {
    console.log("Animation done.")
  }
}
