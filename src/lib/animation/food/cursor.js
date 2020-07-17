import random from "canvas-sketch-util/random"
import { lerp } from "canvas-sketch-util/math"
import BezierEasing from "bezier-easing"

export default class Cursor {
  constructor(canvasWidth, canvasHeight, gridSize) {
    // canvas + grid settings
    this.canvasHeight = canvasHeight
    this.canvasWidth = canvasWidth
    this.gridSize = gridSize
    // initial settings
    this.initialRotationScalar = 2.5
    this.initialRadius = canvasWidth / 30
    this.initialDistanceFromOrbitCenter = canvasWidth / 3.5
    this.maxRadius = canvasWidth / 4
    // animation settings
    this.easingFns = {
      lineMvmt: BezierEasing(0.76, 0.02, 0.73, 0.93),
      lastLineMvmt: BezierEasing(0.7, 0.01, 0, 0.49),
      settings: BezierEasing(0.62, 0.53, 0.8, 0.03),
    }
    this.lineTravelSpeed = 1
    this.linesToTravel = 5
    this.totalFoundAnimationTime = this.lineTravelSpeed
    this.totalSearchingAnimationTime = this.lineTravelSpeed * this.linesToTravel

    this.drawSearchingAnimation = this.drawSearchingAnimation.bind(this)
    this.reset()
  }

  reset() {
    // initial settings
    this.distanceFromOrbitCenter = this.initialDistanceFromOrbitCenter
    this.radius = this.initialRadius
    this.rotationScalar = this.initialRotationScalar
    // search settings
    this.linesTraveled = 0
    this.startPointIndex = -1
    this.endPointIndex = random.rangeFloor(0, this.gridSize * this.gridSize - 1)
    this.orbitPoint = {
      x: -100,
      y: -100,
    }
    this.point = {
      x: -100,
      y: -100,
    }
    // animation settings
    this.foundAnimationDone = false
    this.isLastLine = false
    this.searchingAnimationDone = false
  }

  getEasingFunction(isLastLine) {
    return isLastLine ? this.easingFns.lastLineMvmt : this.easingFns.lineMvmt
  }

  getPointAlongLine(
    startPoint,
    endPoint,
    lineCompletePercentage,
    lineMvmtEaseFn
  ) {
    const [startX, startY] = startPoint
    const [endX, endY] = endPoint
    const x = lerp(startX, endX, lineMvmtEaseFn(lineCompletePercentage))
    const y = lerp(startY, endY, lineMvmtEaseFn(lineCompletePercentage))
    return [x, y]
  }

  getLineCompletePercentage(currentTime, actionTime) {
    return (currentTime - actionTime) / this.lineTravelSpeed
  }

  updateMvmtLine(animator, grid) {
    // Set the start point equal to the end point, then set the end point equal to a random point on the grid.
    this.startPointIndex = this.endPointIndex
    this.endPointIndex = random.rangeFloor(0, grid.size * grid.size - 1)

    animator.updateActionTime()
    // Increment linesTraveled and check to see if we're done
    this.linesTraveled = this.linesTraveled + 1
    if (this.linesTraveled === this.linesToTravel - 1) {
      this.isLastLine = true
    }
    if (this.linesTraveled >= this.linesToTravel) {
      this.searchingAnimationDone = true
    }
  }

  updatePositionAlongLine(animator, selectedPoint, grid) {
    const { currentTime, actionTime, canvas } = animator
    const lineMvmtEaseFn = this.getEasingFunction(this.isLastLine)
    // Determine how far the cursor is along the line
    const lineCompletePercentage = this.getLineCompletePercentage(
      currentTime,
      actionTime
    )

    if (lineCompletePercentage <= 1) {
      const canvasCenter = [canvas.width / 2, canvas.height / 2]
      if (this.searchingAnimationDone) {
        const canvasLowerMiddle = [canvas.width / 2, (canvas.height / 5) * 3]
        const [newX, newY] = this.getPointAlongLine(
          selectedPoint,
          canvasLowerMiddle,
          lineCompletePercentage,
          lineMvmtEaseFn
        )
        this.point.x = newX
        this.point.y = newY
      } else {
        const { options: gridOptions } = grid
        const startPoint =
          this.startPointIndex >= 0
            ? gridOptions[this.startPointIndex].point
            : canvasCenter
        const endPoint = grid.options[this.endPointIndex].point

        // Calculate orbit point
        const [orbitX, orbitY] = this.getPointAlongLine(
          startPoint,
          endPoint,
          lineCompletePercentage,
          lineMvmtEaseFn
        )

        // Calculate cursor point relative to it's rotation around the orbit point
        const rotation = Math.PI * currentTime * this.rotationScalar
        this.point.x =
          orbitX + this.distanceFromOrbitCenter * Math.sin(rotation)
        this.point.y =
          orbitY + this.distanceFromOrbitCenter * Math.cos(rotation)
      }
    } else {
      if (this.searchingAnimationDone && !this.foundAnimationDone) {
        this.foundAnimationDone = true
      }

      if (!this.searchingAnimationDone) {
        this.updateMvmtLine(animator, grid)
      }
    }
  }

  updateSettings(animator) {
    const { currentTime } = animator

    const totalAnimationTime = this.searchingAnimationDone
      ? this.totalFoundAnimationTime
      : this.totalSearchingAnimationTime

    // Determine the animation completion percentage
    const animDonePerc =
      (totalAnimationTime + currentTime) / totalAnimationTime - 1
    const { lastLineMvmt, settings } = this.easingFns

    // Gradually set rotation and distance from orbit center to 0
    if (animDonePerc <= 1) {
      if (this.searchingAnimationDone) {
        this.radius = lerp(
          this.initialRadius,
          this.maxRadius,
          lastLineMvmt(animDonePerc)
        )
      } else {
        this.rotationScalar = lerp(
          this.initialRotationScalar,
          0,
          settings(animDonePerc)
        )

        this.distanceFromOrbitCenter = lerp(
          this.initialDistanceFromOrbitCenter,
          0,
          settings(animDonePerc)
        )
      }
    }
  }

  drawSearchingAnimation(context, animator, grid) {
    this.updateSettings(animator)
    this.updatePositionAlongLine(animator, null, grid)
    context.beginPath()
    context.fillStyle = `rgb(246,170,147)`
    context.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }

  drawFoundAnimation(context, animator, selectedData, selectedImage) {
    const { point, color, foodData } = selectedData
    this.updateSettings(animator)
    this.updatePositionAlongLine(animator, point)
    context.beginPath()
    context.fillStyle = color
    context.strokeStyle = color
    context.shadowColor = color
    context.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2)
    context.fill()

    this.drawInfo(context, foodData, selectedImage)
  }

  drawInfo(context, foodData, selectedImage) {
    context.save()

    context.shadowBlur = 30
    context.lineWidth = 10
    context.stroke()

    const { width, height } = selectedImage
    const aspectRatio = width / height
    const diameter = this.radius * 2
    // Make sure the image covers the entire arc
    const heightIsSmaller = height < width
    const newHeight = heightIsSmaller ? diameter : diameter / aspectRatio
    const newWidth = heightIsSmaller ? diameter * aspectRatio : diameter
    // Center the image
    const sizeDiff = heightIsSmaller
      ? newWidth - diameter
      : newHeight - diameter
    const imageX = this.point.x - this.radius
    const imageY = this.point.y - this.radius
    const newImageX = heightIsSmaller ? imageX - sizeDiff / 2 : imageX
    const newImageY = heightIsSmaller ? imageY : imageY - sizeDiff / 2
    // Clip the arc around the image and draw
    context.clip()
    context.beginPath()
    context.drawImage(
      selectedImage,
      newImageX,
      newImageY,
      heightIsSmaller ? newWidth : diameter,
      heightIsSmaller ? diameter : newHeight
    )
    context.restore()

    //draw text
    const title = foodData.name
    context.font = `bold ${
      this.maxRadius / 4
    }px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`
    context.textAlign = "center"
    context.fillText(title, this.canvasWidth / 2, this.canvasHeight / 4)
  }
}
