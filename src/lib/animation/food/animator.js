// TODO document
/**
 *
 */
export default class Animator {
  constructor(canvas) {
    const lineTravelSpeed = 1.2
    const linesToTravel = 5

    this.actionTime = null
    this.canvas = canvas
    this.currentTime = 0
    this.isLastLine = false
    this.linesTraveled = 0
    this.lineTravelSpeed = lineTravelSpeed
    this.linesToTravel = linesToTravel
    this.startTime = null
    this.totalTime = lineTravelSpeed * linesToTravel
    this.travelAnimationDone = false

    this.incrementLinesTraveled = this.incrementLinesTraveled.bind(this)
  }

  // TODO document
  /**
   *
   */
  incrementLinesTraveled() {
    this.actionTime = this.currentTime
    this.linesTraveled = this.linesTraveled + 1

    if (this.linesTraveled === this.linesToTravel - 1) {
      this.isLastLine = true
    }

    if (this.linesTraveled >= this.linesToTravel) {
      this.travelAnimationDone = true
    }
  }

  // TODO document
  /**
   *
   * @param {*} elapsedTime
   */
  setCurrentTime(elapsedTime) {
    /* Calculate global time in seconds */
    if (this.startTime === null) {
      this.startTime = elapsedTime
    }
    this.currentTime = (elapsedTime - this.startTime) / 1000
  }

  startWaitingAnimation() {}

  // TODO document
  /**
   *
   * @param {*} canvas
   * @param {*} context
   * @param {*} grid
   * @param {*} cursor
   */
  startSelectionAnimation(canvas, context, grid, cursor) {
    // Draw
    window.requestAnimationFrame(
      this.drawSelectionAnimation.bind(this, canvas, context, grid, cursor)
    )
  }

  startInfoAnimation() {}

  // TODO document
  /**
   *
   * @param {*} context
   * @param {*} canvasWidth
   * @param {*} canvasHeight
   */
  clearCanvas(context, canvasWidth, canvasHeight) {
    context.fillStyle = "white"
    context.fillRect(0, 0, canvasWidth, canvasHeight)
  }
}
