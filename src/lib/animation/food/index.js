import Audio from "./audio"
import Cursor from "./cursor"
import Grid from "./grid"

export default class Animator {
  constructor(foodOptions, setSelectedFood) {
    const canvas = document.getElementById("#food-canvas")
    const context = canvas.getContext("2d")

    this.canvas = canvas
    this.context = context
    this.foodImages = []
    this.foodOptions = foodOptions
    this.setSelectedFood = setSelectedFood

    // animation timing
    this.actionTime = null
    this.currentTime = null
    this.startTime = null

    this.fetchImages(foodOptions)

    // Object instances
    this.grid = new Grid(
      canvas.width,
      canvas.height,
      foodOptions,
      this.foodImages
    )
    this.cursor = new Cursor(canvas.width, canvas.height, this.grid.size)
    this.audio = new Audio()

    this.startSearchingAnimation = this.startSearchingAnimation.bind(this)
  }

  fetchImages(foodOptions) {
    this.foodImages = foodOptions.map(({ node }) => {
      const image = new Image()
      image.src = node.image_url
      return image
    })
  }

  clearCanvas() {
    this.context.fillStyle = "white"
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  setCurrentTime(elapsedTime) {
    if (this.startTime === null) {
      this.startTime = elapsedTime
    }
    // Calculate time in seconds
    this.currentTime = (elapsedTime - this.startTime) / 1000
  }

  updateActionTime() {
    this.actionTime = this.currentTime
  }

  showGrid() {
    this.grid.drawGrid(this.context)
  }

  startSearchingAnimation() {
    window.requestAnimationFrame(this.drawSearchingAnimation.bind(this))
  }

  startFoundAnimation(selectedFood, elapsedTime) {
    const selectedImage = new Image()
    selectedImage.src = selectedFood.foodData.image_url
    this.startTime = null
    this.setCurrentTime(elapsedTime)
    this.updateActionTime()
    window.requestAnimationFrame(
      this.drawFoundAnimation.bind(this, selectedFood, selectedImage)
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
    this.grid.draw(this.context, this, this.cursor, this.audio)
    this.cursor.drawSearchingAnimation(this.context, this, this.grid)

    if (this.cursor.searchingAnimationDone) {
      const selectedFood = this.grid.options[this.cursor.startPointIndex]
      this.startFoundAnimation(selectedFood, elapsedTime)
    } else {
      window.requestAnimationFrame(this.drawSearchingAnimation.bind(this))
    }
  }

  drawFoundAnimation(selectedFood, selectedImage, elapsedTime) {
    this.updateDrawSettings(elapsedTime)
    this.cursor.drawFoundAnimation(
      this.context,
      this,
      selectedFood,
      selectedImage
    )

    if (!this.cursor.foundAnimationDone) {
      window.requestAnimationFrame(
        this.drawFoundAnimation.bind(this, selectedFood, selectedImage)
      )
    } else {
      console.log("DONE WITH DISPLAY ANIMATION")
      this.setSelectedFood(selectedFood)
    }
  }
}
