export default class Animator {
  constructor(canvas) {
    const lineTravelSpeed = 1.2234
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

    this.incrementLinesTraveled = this.incrementLinesTraveled.bind(this)
  }

  incrementLinesTraveled() {
    this.actionTime = this.currentTime
    this.linesTraveled = this.linesTraveled + 1

    if (this.linesTraveled === this.linesTraveled - 1) {
      this.isLastLine = true
    }

    if (this.linesTraveled >= this.linesToTravel && !this.done) {
      this.done = true
    }
  }

  setCurrentTime(elapsedTime) {
    /* Calculate global time in seconds */
    if (this.startTime === null) {
      this.startTime = elapsedTime
    }
    this.currentTime = (elapsedTime - this.startTime) / 1000
  }

  startWaitingAnimation() {}

  startSelectionAnimation(canvas, context, grid, cursor) {
    // Draw
    console.log("startSelectionAnimation")
    window.requestAnimationFrame(
      this.drawSelectionAnimation.bind(this, canvas, context, grid, cursor)
    )
  }

  startInfoAnimation() {}

  clearCanvas(context, canvasWidth, canvasHeight) {
    context.fillStyle = "white"
    context.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  drawSelectionAnimation(canvas, context, grid, cursor, elapsedTime) {
    this.clearCanvas(context, canvas.width, canvas.height)
    this.setCurrentTime(elapsedTime)

    if (this.actionTime === null) {
      this.actionTime = this.currentTime
    }

    grid.draw(context, this)
    cursor.drawSelectionMovement(context, this, grid)

    if (!this.done) {
      window.requestAnimationFrame(
        this.drawSelectionAnimation.bind(this, canvas, context, grid, cursor)
      )
    } else {
      console.log("DONEs")
    }
  }
}
