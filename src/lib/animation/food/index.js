import { init } from "./logic"
import { draw } from "./draw"

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
