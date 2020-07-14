import Audio from "./audio"
import Cursor from "./cursor"
import Grid from "./grid"

export default class Animator {
  constructor(foodOptions) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")

    this.foodImages = []
    this.foodOptions = foodOptions
    this.context = context
    this.canvas = canvas

    // Object instances
    this.grid = new Grid(canvas.width, canvas.height, foodOptions)
    this.cursor = new Cursor(canvas.width, canvas.height, this.grid.size)
    this.audio = new Audio()

    // animation timing
    this.actionTime = null
    this.currentTime = null
    this.startTime = null
  }

  clearCanvas() {
    this.context.fillStyle = "white"
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  setCurrentTime(elapsedTime) {
    if (this.startTime === null) {
      this.startTime = elapsedTime
    }
    // calculate global time in seconds
    this.currentTime = (elapsedTime - this.startTime) / 1000
  }

  updateActionTime() {
    this.actionTime = this.currentTime
  }

  startSearchingAnimation() {
    window.requestAnimationFrame(this.drawSearchingAnimation.bind(this))
  }

  startFoundAnimation(selectedData, elapsedTime) {
    // start loading selected image
    const selectedImage = new Image()
    selectedImage.src = selectedData.foodData.image_url
    // start the "Display Selected" animation
    this.startTime = null
    this.setCurrentTime(elapsedTime)
    this.updateActionTime()
    window.requestAnimationFrame(
      this.drawFoundAnimation.bind(this, selectedData, selectedImage)
    )
  }

  updateDrawSettings(elapsedTime) {
    this.clearCanvas(this.context, this.canvas.width, this.canvas.height)
    this.setCurrentTime(elapsedTime)
    if (this.actionTime === null) {
      this.updateActionTime()
    }
  }

  drawSearchingAnimation(elapsedTime) {
    this.updateDrawSettings(elapsedTime)

    // draw
    this.grid.draw(this.context, this, this.cursor, this.audio)
    this.cursor.drawSearchingAnimation(this.context, this, this.grid)

    if (this.cursor.searchingAnimationDone) {
      const selectedData = this.grid.options[this.cursor.startPointIndex]
      this.startFoundAnimation(selectedData, elapsedTime)
    } else {
      window.requestAnimationFrame(this.drawSearchingAnimation.bind(this))
    }
  }

  drawFoundAnimation(selectedData, selectedImage, elapsedTime) {
    this.updateDrawSettings(elapsedTime)

    this.cursor.drawFoundAnimation(
      this.context,
      this,
      selectedData,
      selectedImage
    )

    if (!this.cursor.foundAnimationDone) {
      window.requestAnimationFrame(
        this.drawFoundAnimation.bind(this, selectedData, selectedImage)
      )
    } else {
      console.log("DONE WITH DISPLAY ANIMATION")
    }
  }
}

// TODO document
/**
 *
 * @param {*} foodOptions
 * @param {*} setSelectedFoodOption
 */

// //  TODO document
// /**
//  *
//  * @param {*} foodOptions
//  */
// const fetchImages = foodOptions => {
//   foodImages = foodOptions.map(({ node }) => {
//     const image = new Image()
//     image.src = node.image_url
//     return image
//   })
// }

// export const startIdleAnimation = foodOptions => {
//   if (document && window) {
//     const canvas = document.getElementById("#food-canvas")
//     const context = canvas.getContext("2d")
//     const animator = new Animator(canvas)
//     animator.idleAnimationActive = true
//     // TODO wait for images to load before starting
//     if (foodImages.length <= 0) fetchImages(foodOptions)

//     const grid = new Grid(canvas.width, canvas.height, foodOptions, foodImages)
//     const cursor = new Cursor(canvas.width, canvas.height, grid.size)
//     const audio = new Audio()
//     setTimeout(() => {
//       window.requestAnimationFrame(
//         drawIdleAnimation.bind(
//           null,
//           canvas,
//           context,
//           animator,
//           cursor,
//           grid,
//           audio
//         )
//       )
//     }, 1000)

//     // TODO draw cursor orbiting whole grid
//   }
// }

// export const drawIdleAnimation = (
//   canvas,
//   context,
//   animator,
//   cursor,
//   grid,
//   elapsedTime
// ) => {
//   grid.drawGrid(context, animator, cursor)
//   if (animator.idleAnimationActive) {
//     window.requestAnimationFrame(
//       drawIdleAnimation.bind(null, canvas, context, animator, cursor, grid)
//     )
//   }
// }
