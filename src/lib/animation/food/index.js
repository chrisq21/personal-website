import Animator from "./animator"
import Audio from "./audio"
import Cursor from "./cursor"
import Grid from "./grid"

export default class FoodAnimation {
  constructor(foodOptions) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")

    this.foodImages = []
    this.foodOptions = foodOptions
    this.context = context
    this.canvas = canvas
    this.animator = new Animator(canvas)
    this.grid = new Grid(canvas.width, canvas.height, foodOptions)
    this.cursor = new Cursor(canvas.width, canvas.height, this.grid.size)
    this.audio = new Audio()
  }

  startSelectionAnimation() {
    window.requestAnimationFrame(this.drawSelectionAnimation.bind(this))
  }

  drawSelectionAnimation(elapsedTime) {
    this.animator.clearCanvas(
      this.context,
      this.canvas.width,
      this.canvas.height
    )
    this.animator.setCurrentTime(elapsedTime)

    // Set initial action time if not already set
    if (this.animator.actionTime === null) {
      this.animator.actionTime = this.animator.currentTime
    }

    // draw
    this.grid.draw(this.context, this.animator, this.cursor, this.audio)
    this.cursor.drawSelectionMovement(this.context, this.animator, this.grid)

    if (this.animator.travelAnimationDone) {
      const selectedData = this.grid.options[this.cursor.startPointIndex]

      // Start loading selected image
      const selectedImage = new Image()
      selectedImage.src = selectedData.foodData.image_url

      // Start the "Display Selected" animation
      this.animator.startTime = null
      this.animator.setCurrentTime(elapsedTime)
      this.animator.actionTime = this.animator.currentTime
      console.log("Display selected")
      window.requestAnimationFrame(
        this.drawDisplaySelectedAnimation.bind(
          this,
          selectedData,
          selectedImage
        )
      )
    } else {
      window.requestAnimationFrame(this.drawSelectionAnimation.bind(this))
    }
  }

  drawDisplaySelectedAnimation(selectedData, selectedImage, elapsedTime) {
    this.animator.clearCanvas(
      this.context,
      this.canvas.width,
      this.canvas.height
    )
    this.animator.setCurrentTime(elapsedTime)
    if (this.animator.actionTime === null) {
      this.animator.actionTime = this.animator.currentTime
    }

    this.cursor.drawDisplayedSelectedAnimation(
      this.context,
      this.animator,
      selectedData,
      selectedImage
    )

    if (!this.animator.displaySelectedAnimationDone) {
      window.requestAnimationFrame(
        this.drawDisplaySelectedAnimation.bind(
          this,
          selectedData,
          selectedImage
        )
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
