import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"

export const setupCanvas = foodOptions => {
  if (document) {
    const canvas = document.getElementById("#food-canvas")
    // TODO update canvas width after resize
    canvas.width = 1000
    canvas.height = 1000
    const context = canvas.getContext("2d")
    const options = getGridOptions(foodOptions, canvas.width, canvas.height)
    context.fillStyle = "red"
    options.forEach(([x, y]) => {
      context.fillRect(x, y, 10, 10)
    })
  }
}

const getGridOptions = (foodOptions, width, height) => {
  const options = []
  const margin = 100
  const shuffledFoodOptions = random.shuffle(foodOptions)
  // TODO Set grid size based on desktop vs mobile
  const gridSize = 4 // total size = gridSize x gridSize
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

  return points
}
