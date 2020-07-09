import random from "canvas-sketch-util/random"
import { lerp } from "canvas-sketch-util/math"
import BezierEasing from "bezier-easing"

export default class Grid {
  constructor(canvasWidth, canvasHeight, foodArray) {
    this.easeFn = BezierEasing(0.7, 0.01, 0, 0.49)
    this.margin = canvasWidth / 5
    this.orbRadius = canvasWidth / 25
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
      radiusAddition: canvasWidth / 60,
      recentlyAnimatedIndex: null,
      totalTime: 1.5,
    }
    this.selectedEaseFn = BezierEasing(0.96, 0.25, 0.54, 0.88)
    this.selectedMvmtSpeed = 0.5
    this.size = 4 // total size = grid.size x grid.size

    this.options = this.getOptions(canvasWidth, canvasHeight, foodArray)
  }

  // TODO document
  /**
   *
   * @param {*} canvasWidth
   * @param {*} canvasHeight
   * @param {*} foodArray
   */
  getOptions(canvasWidth, canvasHeight, foodArray) {
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
        const foodOptionData = shuffledFoodArray[index].node
        options.push({
          point: [x, y],
          shouldAnimate: false,
          animationStartTime: 0,
          foodOptionData,
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

  draw(context, animator) {
    this.options.forEach((foodOptionData, index) => {
      const color = this.palette[index % this.palette.length]
      this.options[index].color = color
      context.fillStyle = color
      // TODO add note
      // const note = audio.notes[index]
      if (foodOptionData.shouldAnimate) {
        // Queue up ripple animation
        this.options[index].shouldAnimate = false
        this.ripple.animations.push({
          startTime: animator.currentTime,
          gridIndex: index,
          deltaTime: 0,
          maxAlpha: this.ripple.maxAlpha,
          color,
          note: null,
        })

        // TODO add audio
        {
          // /* Play sound */
          // if (audio.synth) {
          //   if (audio.Tone.context.state !== "running") {
          //     audio.Tone.context.resume()
          //   }
          //   audio.synth.triggerAttackRelease(
          //     note,
          //     "16n",
          //     audio.synth.context.currentTime,
          //     1
          //   )
          // }
        }
      }

      const [x, y] = foodOptionData.point
      context.beginPath()
      context.arc(x, y, this.orbRadius, 0, Math.PI * 2)
      context.fill()
    })
  }

  drawOrbRipples(context, animator) {
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
