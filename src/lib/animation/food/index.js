import Animator from "./animator"
import Grid from "./grid"
import Cursor from "./cursor"

// TODO document
/**
 *
 */
export const startAnimation = (foodOptions, setSelectedFoodOption) => {
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")
    const animator = new Animator(canvas)

    const grid = new Grid(canvas.width, canvas.height, foodOptions)
    const cursor = new Cursor(canvas.width / 30, canvas.width / 4, grid.size)
    animator.startSelectionAnimation(canvas, context, grid, cursor)
  }
}
