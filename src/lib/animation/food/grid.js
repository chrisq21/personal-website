import random from "canvas-sketch-util/random"
import { lerp } from "canvas-sketch-util/math"
import BezierEasing from "bezier-easing"

// TODO document
/**
 *
 */
export default class Grid {
  constructor(canvasWidth, canvasHeight, foodArray, foodImages) {
    this.easeFn = BezierEasing(0.7, 0.01, 0, 0.49)
    this.margin = canvasWidth / 5
    this.orbRadius = canvasWidth / 20
    this.palette = [
      `rgb(185,211,176)`,
      `rgb(129,189,164)`,
      `rgb(178,135,116)`,
      `rgb(248,143,121)`,
      `rgb(246,170,147)`,
    ]

    this.ripple = {
      animations: [],
      count: 4,
      easeFn: BezierEasing(0.29, 0.81, 0.77, 0.95),
      maxAlpha: 0.4,
      radiusAddition: canvasWidth / 65,
      recentlyAnimatedIndex: null,
      totalTime: 1.25,
    }
    this.selectedEaseFn = BezierEasing(0.96, 0.25, 0.54, 0.88)
    this.selectedMvmtSpeed = 0.5
    this.size = 4 // total size = grid.size x grid.size

    this.options = this.getOptions(
      canvasWidth,
      canvasHeight,
      foodArray,
      foodImages
    )
  }

  // TODO document
  /**
   *
   * @param {*} canvasWidth
   * @param {*} canvasHeight
   * @param {*} foodArray
   */
  getOptions(canvasWidth, canvasHeight, foodArray, foodImages) {
    const options = []
    const shuffledFoodArray = random.shuffle(foodArray)
    let counter = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const u = i / (this.size - 1)
        const x = lerp(this.margin, canvasWidth - this.margin, u)
        const v = j / (this.size - 1)
        const y = lerp(this.margin, canvasHeight - this.margin, v)
        const index = counter % shuffledFoodArray.length
        const foodData = shuffledFoodArray[index].node
        const color = this.palette[index % this.palette.length]

        options.push({
          point: [x, y],
          shouldAnimate: false,
          foodData,
          color,
          image: foodImages[index],
        })
        counter++
      }
    }

    return options
  }

  // TODO document
  /**
   *
   * @param {*} cursor
   * @param {*} animator
   */
  checkCollisions(cursor, animator) {
    this.options.forEach((optionData, index) => {
      const [x, y] = optionData.point
      if (
        Math.abs(cursor.point.x - x) < cursor.radius + this.orbRadius &&
        Math.abs(cursor.point.y - y) < cursor.radius + this.orbRadius
      ) {
        /* Check to see if the orb is already animating,
         and whether or not the orb is the most recent orb to animate.
         This ensures that the same orb doesn't animate over and over again if the cursor hasn't moved on yet.
         */
        if (
          !this.options[index].shouldAnimate &&
          index !== this.ripple.recentlyAnimatedIndex
        ) {
          this.options[index].shouldAnimate = true
          this.options[index].actionTime = animator.currentTime
          this.ripple.recentlyAnimatedIndex = index
        }
      }
    })
  }

  // TODO document
  /**
   *
   * @param {*} context
   * @param {*} animator
   * @param {*} cursor
   */
  draw(context, animator, cursor, audio) {
    this.drawGrid(context)
    this.checkCollisions(cursor, animator)
    this.drawOrbRipples(context, animator, audio)
  }

  // TODO add images
  drawGrid(context) {
    this.options.forEach(({ color, point, image }) => {
      context.save()

      const [x, y] = point
      this.drawImage(context, image, point)
      context.fillStyle = color
      context.strokeStyle = color
      context.shadowColor = color
      // Draw grid orb with low opacity over image
      context.globalAlpha = 0.8
      context.beginPath()
      context.arc(x, y, this.orbRadius, 0, Math.PI * 2)
      context.fill()

      context.restore()
    })
  }

  drawImage(context, image, point, color) {
    context.save()

    const [x, y] = point
    const { width, height } = image
    const aspectRatio = width / height
    const diameter = this.orbRadius * 2
    // Make sure the image covers the entire arc
    const heightIsSmaller = height < width
    const newHeight = heightIsSmaller ? diameter : diameter / aspectRatio
    const newWidth = heightIsSmaller ? diameter * aspectRatio : diameter
    // Center the image
    const sizeDiff = heightIsSmaller
      ? newWidth - diameter
      : newHeight - diameter
    const imageX = x - this.orbRadius
    const imageY = y - this.orbRadius
    const newImageX = heightIsSmaller ? imageX - sizeDiff / 2 : imageX
    const newImageY = heightIsSmaller ? imageY : imageY - sizeDiff / 2

    // Draw clipping path
    context.beginPath()
    context.arc(x, y, this.orbRadius, 0, Math.PI * 2)
    context.clip()

    context.imageSmoothingEnabled = true
    // Draw image
    context.drawImage(
      image,
      newImageX,
      newImageY,
      heightIsSmaller ? newWidth : diameter,
      heightIsSmaller ? diameter : newHeight
    )
    context.restore()
  }

  // TODO document
  /**
   *
   * @param {*} context
   * @param {*} animator
   */
  drawOrbRipples(context, animator, audio) {
    this.options.forEach((gridOptionData, index) => {
      const { shouldAnimate, color } = gridOptionData
      if (shouldAnimate) {
        // Queue up ripple animation
        this.options[index].shouldAnimate = false
        this.ripple.animations.push({
          startTime: animator.currentTime,
          gridIndex: index,
          deltaTime: 0,
          maxAlpha: this.ripple.maxAlpha,
          color,
        })

        // Play note that corresponds to the grid point
        const note = audio.gridNotes[index]
        audio.playNote(note)
      }
    })

    this.ripple.animations.forEach((rippleAnimation, index) => {
      const {
        gridIndex,
        startTime,
        deltaTime,
        maxAlpha,
        color,
      } = rippleAnimation
      let alpha
      let fader
      const [x, y] = this.options[gridIndex].point
      /* 
        Calculate alpha based off of how far along the ripple animation is.
        0% => 50% fade in, 
        50% => 100% fade out
      */
      const rippleAnimPercentage = deltaTime / this.ripple.totalTime
      if (rippleAnimPercentage < 0.5) {
        fader = rippleAnimPercentage * 2
        alpha = lerp(0, maxAlpha, this.ripple.easeFn(fader))
      } else {
        fader = rippleAnimPercentage * 2 - 1
        alpha = lerp(maxAlpha, 0, this.ripple.easeFn(fader))
      }
      const colorArray = color.split(")")
      for (let i = 1; i < this.ripple.count; i++) {
        // Calculate radius and alpha, then draw
        const newAlpha = alpha / i
        const rippleRadius = this.orbRadius + this.ripple.radiusAddition * i
        const newColor = `${colorArray[0]},${newAlpha})`
        context.fillStyle = newColor
        context.beginPath()
        context.arc(x, y, rippleRadius, 0, Math.PI * 2)
        context.fill()
      }
      // Update delta ripple delta time
      this.ripple.animations[index].deltaTime = animator.currentTime - startTime
      if (rippleAnimPercentage >= 1) {
        // Once the animation is complete, remove the ripple animation
        delete this.ripple.animations[index]
      }
    })
  }
}
