import { lerp } from "canvas-sketch-util/math"
import random from "canvas-sketch-util/random"

/* Variables */

/* Grid */
const gridOrbRadius = 50
const palette = [
  "rgb(185,211,176)",
  "rgb(129,189,164)",
  "rgb(178,135,116)",
  "rgb(248,143,121)",
  "rgb(246,170,147)",
]

const drawGrid = (gridData, context) => {
  gridData.forEach((data, index) => {
    const color = palette[index % palette.length]
    context.fillStyle = color

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, gridOrbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

const getGridData = (foodOptions, width, height) => {
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

  return options
}

export const setupCanvas = foodOptions => {
  if (document) {
    const canvas = document.getElementById("#food-canvas")
    // TODO update canvas width after resize
    canvas.width = 1000
    canvas.height = 1000
    const context = canvas.getContext("2d")
    const gridData = getGridData(foodOptions, canvas.width, canvas.height)
    drawGrid(gridData, context)
  }
}
