import Animator from "./animator"
import Grid from "./grid"
import Cursor from "./cursor"

// TODO document
/**
 *
 * @param {*} foodOptions
 * @param {*} setSelectedFoodOption
 */
export const startAnimation = (foodOptions, setSelectedFoodOption) => {
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")
    const animator = new Animator(canvas)
    const grid = new Grid(canvas.width, canvas.height, foodOptions)
    const cursor = new Cursor(canvas.width / 30, canvas.width / 4, grid.size)
    window.requestAnimationFrame(
      drawSelectionAnimation.bind(null, canvas, context, animator, cursor, grid)
    )
  }
}

// TODO document
/**
 *
 * @param {*} canvas
 * @param {*} context
 * @param {*} animator
 * @param {*} cursor
 * @param {*} grid
 * @param {*} elapsedTime
 */
const drawSelectionAnimation = (
  canvas,
  context,
  animator,
  cursor,
  grid,
  elapsedTime
) => {
  animator.clearCanvas(context, canvas.width, canvas.height)
  animator.setCurrentTime(elapsedTime)
  if (animator.actionTime === null) {
    animator.actionTime = animator.currentTime
  }

  grid.draw(context, animator, cursor)
  cursor.drawSelectionMovement(context, animator, grid)

  if (animator.travelAnimationDone) {
    console.log("DONE")
  } else {
    window.requestAnimationFrame(
      drawSelectionAnimation.bind(null, canvas, context, animator, cursor, grid)
    )
  }
}
