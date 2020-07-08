export default class Animator {
  constructor(canvas) {
    const lineTravelSpeed = 1
    const linesToTravel = 5

    this.canvas = canvas
    this.currentTime = 0
    this.isLastLine = false
    this.linesTraveled = 0
    this.lineTravelSpeed = lineTravelSpeed
    this.linesToTravel = linesToTravel
    this.newLineTime = 0
    this.startTime = 0
    this.totalTime = lineTravelSpeed * linesToTravel
  }

  startWaitingAnimation() {}

  startSelectionAnimation() {
    // Draw
    // this.canvas
  }

  startInfoAnimation() {}
}
