import { init } from "./logic"
import { draw, drawInitial } from "./draw"

export const startAnimation = async foodOptions => {
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")
    const { cursor, grid, animation, audio } = await init(foodOptions, canvas)
    console.log("audio", audio)
    window.requestAnimationFrame(
      draw.bind(null, grid, cursor, animation, audio, context, canvas)
    )
  }
}

export const showCanvas = async foodOptions => {
  if (document && window) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")
    const { cursor, grid, animation, audio } = await init(foodOptions, canvas)
    window.requestAnimationFrame(
      drawInitial.bind(null, grid, cursor, animation, audio, context, canvas)
    )
  }
}
