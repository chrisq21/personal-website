export const setupCanvas = () => {
  if (document) {
    const container = document.querySelector("#container")
    const canvas = document.getElementById("#food-canvas")
    // TODO update canvas width after resize
    canvas.width = container.offsetWidth
    canvas.height = 500
    const context = canvas.getContext("2d")
    context.fillStyle = "green"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
}
