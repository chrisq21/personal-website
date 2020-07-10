import Animator from "./animator"
import Audio from "./audio"
import Cursor from "./cursor"
import Grid from "./grid"

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
    const cursor = new Cursor(canvas.width, canvas.height, grid.size)
    const audio = new Audio()
    window.requestAnimationFrame(
      drawSelectionAnimation.bind(
        null,
        canvas,
        context,
        animator,
        cursor,
        grid,
        audio
      )
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
  audio,
  elapsedTime
) => {
  animator.clearCanvas(context, canvas.width, canvas.height)
  animator.setCurrentTime(elapsedTime)

  // Set initial action time if not already set
  if (animator.actionTime === null) {
    animator.actionTime = animator.currentTime
  }

  // draw
  grid.draw(context, animator, cursor, audio)
  cursor.drawSelectionMovement(context, animator, grid)

  if (animator.travelAnimationDone) {
    const selectedData = grid.options[cursor.startPointIndex]

    // Start loading selected image
    const selectedImage = new Image()
    selectedImage.src = selectedData.foodOptionData.image_url

    // Start the "Display Selected" animation
    animator.startTime = null
    animator.setCurrentTime(elapsedTime)
    animator.actionTime = animator.currentTime
    window.requestAnimationFrame(
      drawDisplaySelectedAnimation.bind(
        null,
        canvas,
        context,
        animator,
        cursor,
        selectedData,
        selectedImage
      )
    )
  } else {
    window.requestAnimationFrame(
      drawSelectionAnimation.bind(
        null,
        canvas,
        context,
        animator,
        cursor,
        grid,
        audio
      )
    )
  }
}

const drawDisplaySelectedAnimation = (
  canvas,
  context,
  animator,
  cursor,
  selectedData,
  selectedImage,
  elapsedTime
) => {
  animator.clearCanvas(context, canvas.width, canvas.height)
  animator.setCurrentTime(elapsedTime)
  if (animator.actionTime === null) {
    animator.actionTime = animator.currentTime
  }

  cursor.drawDisplayedSelectedAnimation(
    context,
    animator,
    selectedData,
    selectedImage
  )

  if (!animator.displaySelectedAnimationDone) {
    window.requestAnimationFrame(
      drawDisplaySelectedAnimation.bind(
        null,
        canvas,
        context,
        animator,
        cursor,
        selectedData,
        selectedImage
      )
    )
  } else {
    console.log("DONE WITH DISPLAY ANIMATION")
  }
}
