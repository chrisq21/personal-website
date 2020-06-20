import { init } from "./logic"
import { draw } from "./draw"

export const setupCanvas = async foodOptions => {
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
