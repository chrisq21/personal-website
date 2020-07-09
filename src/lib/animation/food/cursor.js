import random from "canvas-sketch-util/random"
import { lerp } from "canvas-sketch-util/math"
import BezierEasing from "bezier-easing"

export default class Cursor {
  constructor(radius, initialDistanceFromOrbitCenter, gridSize) {
    const initialRotationScalar = 3

    this.color = `rgb(185,211,176)`
    this.endPointIndex = random.rangeFloor(0, gridSize * gridSize - 1)
    this.distanceFromOrbitCenter = initialDistanceFromOrbitCenter
    this.easingFns = {
      mainLineMvmt: BezierEasing(0.76, 0.02, 0.73, 0.93),
      lastLineMvmt: BezierEasing(0.7, 0.01, 0, 0.49),
      main: BezierEasing(1, 0.09, 0.55, 0.91),
    }
    this.initialDistanceFromOrbitCenter = initialDistanceFromOrbitCenter
    this.initialRotationScalar = initialRotationScalar
    this.orbitPoint = {
      x: -100,
      y: -100,
    }
    this.point = {
      x: -100,
      y: -100,
    }
    this.radius = radius
    this.rotationScalar = initialRotationScalar
    this.startPointIndex = -1

    this.drawSelectionMovement = this.drawSelectionMovement.bind(this)
  }

  getEasingFunction(isLastLine) {
    return isLastLine
      ? this.easingFns.lastLineMvmt
      : this.easingFns.mainLineMvmt
  }

  getOrbitPoint(startPoint, endPoint, lineCompletePercentage, lineMvmtEaseFn) {
    const [startX, startY] = startPoint
    const [endX, endY] = endPoint
    const x = lerp(startX, endX, lineMvmtEaseFn(lineCompletePercentage))
    const y = lerp(startY, endY, lineMvmtEaseFn(lineCompletePercentage))
    return [x, y]
  }

  getLineCompletePercentage(currentTime, actionTime, lineTravelSpeed) {
    // TODO  use lineTraveSpeed from animator
    // console.log(currentTime)
    return (currentTime - actionTime) / lineTravelSpeed
  }

  // TODO add docs
  /**
   *
   */
  updateMvmtLine(animator, grid) {
    /*  Set the start point equal to the end point, then set the end point equal to a random point on the grid. */
    this.startPointIndex = this.endPointIndex
    this.endPointIndex = random.rangeFloor(0, grid.size * grid.size - 1)

    animator.incrementLinesTraveled()
  }

  // TODO add docs
  /**
   *
   * @param {*} cursor
   * @param {*} grid
   * @param {*} animation
   * @param {*} canvas
   */
  updatePositionAlongLine(animator, grid) {
    const {
      currentTime,
      actionTime,
      lineTravelSpeed,
      isLastLine,
      canvas,
    } = animator
    const { options: gridOptions } = grid

    // Determine how far the cursor is along the line
    const lineCompletePercentage = this.getLineCompletePercentage(
      currentTime,
      actionTime,
      lineTravelSpeed
    )

    if (lineCompletePercentage <= 1) {
      const canvasCenter = [canvas.width / 2, canvas.height / 2]
      const startPoint =
        this.startPointIndex >= 0
          ? gridOptions[this.startPointIndex].point
          : canvasCenter
      const endPoint = grid.options[this.endPointIndex].point
      const lineMvmtEaseFn = this.getEasingFunction(isLastLine)

      // Calculate orbit point
      const [orbitX, orbitY] = this.getOrbitPoint(
        startPoint,
        endPoint,
        lineCompletePercentage,
        lineMvmtEaseFn
      )

      // Calculate cursor point relative to it's rotation around the orbit point
      const rotation = Math.PI * currentTime * this.rotationScalar
      this.point.x = orbitX + this.distanceFromOrbitCenter * Math.sin(rotation)
      this.point.y = orbitY + this.distanceFromOrbitCenter * Math.cos(rotation)
    } else {
      this.updateMvmtLine(animator, grid)
    }
  }

  // TODO Add docs
  /**
   *
   */
  updateSettings(animator) {
    const { totalTime, currentTime } = animator
    // Determine the animation completion percentage
    const animDonePerc = (totalTime + currentTime) / totalTime - 1
    const mainEasingFn = this.easingFns.main

    // Gradually set rotation and distance from orbit center to 0
    if (animDonePerc <= 1) {
      this.rotationScalar = lerp(
        this.initialRotationScalar,
        0,
        mainEasingFn(animDonePerc)
      )

      this.distanceFromOrbitCenter = lerp(
        this.initialDistanceFromOrbitCenter,
        0,
        mainEasingFn(animDonePerc)
      )
    }
  }

  // TODO document
  /**
   *
   * @param {*} context
   * @param {*} animator
   * @param {*} grid
   */
  drawSelectionMovement(context, animator, grid) {
    this.updateSettings(animator)
    this.updatePositionAlongLine(animator, grid)

    context.beginPath()
    context.fillStyle = this.color
    context.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }
}
