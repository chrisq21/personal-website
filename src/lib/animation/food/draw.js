import { updateCursorPosition, checkCollisions } from "./logic"
import { lerp } from "canvas-sketch-util/math"

/* Cursor */
const drawCursor = (cursor, animation, context) => {
  context.beginPath()
  context.fillStyle = "rgb(185,211,176)"
  context.arc(cursor.center.x, cursor.center.y, cursor.radius, 0, Math.PI * 2)
  context.fill()
}

/* Grid */
const drawGrid = (grid, context, animation, audio) => {
  grid.options.forEach((data, index) => {
    const color = grid.palette[index % grid.palette.length]
    grid.options[index].color = color
    context.fillStyle = color
    const note = audio.notes[index]

    if (data.shouldAnimate) {
      grid.options[index].shouldAnimate = false
      /* Enqueue ripple animation */
      grid.ripples.animations.push({
        startTime: animation.currentTime,
        gridIndex: index,
        deltaTime: 0,
        maxAlpha: grid.ripples.maxAlpha,
        color,
        note,
      })

      /* Play sound */
      if (audio.synth) {
        if (audio.Tone.context.state !== "running") {
          audio.Tone.context.resume()
        }
        audio.synth.triggerAttackRelease(
          note,
          "16n",
          audio.synth.context.currentTime,
          1
        )
      }
    }

    const [x, y] = data.point
    context.beginPath()
    context.arc(x, y, grid.orbRadius, 0, Math.PI * 2)
    context.fill()
  })
}

export const drawOrbRipples = (grid, animation, context) => {
  let alpha
  let percUp
  let percDown

  grid.ripples.animations.forEach((rippleAnimation, index) => {
    const { gridIndex, startTime, deltaTime, maxAlpha, color } = rippleAnimation
    const [x, y] = grid.options[gridIndex].point

    const rippleAnimPercentage = deltaTime / grid.ripples.totalTime

    if (rippleAnimPercentage < 0.5) {
      percUp = rippleAnimPercentage * 2
      alpha = lerp(0, maxAlpha, grid.ripples.easeFn(percUp))
    } else {
      percDown = rippleAnimPercentage * 2 - 1
      alpha = lerp(maxAlpha, 0, grid.ripples.easeFn(percDown))
    }

    const colorArray = color.split(")")
    for (let i = 1; i < grid.ripples.count; i++) {
      const newAlpha = alpha / i
      context.beginPath()

      const newColor = `${colorArray[0]},${newAlpha})`
      context.fillStyle = newColor
      context.arc(
        x,
        y,
        grid.orbRadius + grid.ripples.radiusAddition * i,
        0,
        Math.PI * 2
      )
      context.fill()
    }

    // Update values
    grid.ripples.animations[index].deltaTime = animation.currentTime - startTime

    if (rippleAnimPercentage >= 1) {
      delete grid.ripples.animations[index]
    }
  })
}

/* Main drawing function */
export const draw = (
  grid,
  cursor,
  animation,
  audio,
  context,
  canvas,
  setSelectedFoodOption,
  time
) => {
  /* Clear the canvas */
  context.fillStyle = "black"
  context.fillRect(0, 0, canvas.width, canvas.height)

  /* Calculate global time in seconds */
  if (animation.startTime === null) {
    animation.startTime = time
  }
  animation.currentTime = (time - animation.startTime) / 1000

  drawGrid(grid, context, animation, audio)
  drawCursor(cursor, animation, context)

  if (!animation.done) {
    updateCursorPosition(cursor, grid, animation, canvas)
    checkCollisions(animation, grid, cursor)
  }

  drawOrbRipples(grid, animation, context)

  if (animation.currentTime <= animation.totalTime + 0.2) {
    window.requestAnimationFrame(
      draw.bind(
        null,
        grid,
        cursor,
        animation,
        audio,
        context,
        canvas,
        setSelectedFoodOption
      )
    )
  } else {
    console.log("Animation Done")
    animation.atCenter = false

    animation.startTime = null
    const selectedFoodOptionIndex = cursor.startingPointIndex
    // setSelectedFoodOption(selectedFoodOption)
    // Start selected animation
    window.requestAnimationFrame(
      drawSelected.bind(
        null,
        selectedFoodOptionIndex,
        grid,
        animation,
        context,
        canvas
      )
    )
  }
}

const drawInfo = (orbData, grid, animation, context, canvas, time) => {
  context.restore()
  console.log("orb data: ", orbData)
  const title = orbData.foodOptionData.name
  context.font = "50px roboto"
  context.textAlign = "center"
  context.fillText(title, canvas.width / 2, 50)
}

const drawSelected = (
  selectedOptionIndex,
  grid,
  animation,
  context,
  canvas,
  time
) => {
  /* Clear the canvas */
  if (!animation.atCenter) {
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  /* Reset animation time */
  if (animation.startTime === null) {
    animation.startTime = time
  }
  animation.currentTime = (time - animation.startTime) / 1000

  /* Animate orb to center */
  const orb = grid.options[selectedOptionIndex]
  let movementPercentage = animation.currentTime / grid.selectedMvmtSpeed

  context.fillStyle = orb.color
  context.beginPath()

  const x = lerp(
    orb.point[0],
    canvas.width / 2,
    grid.selectedEaseFn(movementPercentage)
  )
  const y = lerp(
    orb.point[1],
    grid.orbRadius * 2 + grid.margin + 100,
    grid.selectedEaseFn(movementPercentage)
  )
  const radius = lerp(
    grid.orbRadius,
    canvas.width / 4,
    grid.selectedEaseFn(movementPercentage)
  )
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()

  if (movementPercentage >= 1) {
    animation.atCenter = true
  }

  if (!animation.atCenter) {
    window.requestAnimationFrame(
      drawSelected.bind(
        null,
        selectedOptionIndex,
        grid,
        animation,
        context,
        canvas
      )
    )
  } else {
    console.log("done", orb)
    const image = new Image()
    image.src = orb.foodOptionData.image_url
    const orbData = { ...orb, x, y, radius }
    context.strokeStyle = orb.color
    image.onload = drawImage.bind(
      null,
      image,
      canvas,
      context,
      orbData,
      selectedOptionIndex,
      grid,
      animation
    )
  }
}

const drawImage = (
  image,
  canvas,
  context,
  orbData,
  selectedOptionIndex,
  grid,
  animation
) => {
  context.lineWidth = 10
  context.stroke()
  context.save()
  context.clip()

  context.beginPath()
  context.drawImage(
    image,
    orbData.x - orbData.radius,
    orbData.y - orbData.radius,
    orbData.radius * 2,
    orbData.radius * 2
  )

  drawInfo(orbData, grid, animation, context, canvas)
}

export const drawInitial = (
  grid,
  cursor,
  animation,
  audio,
  context,
  canvas,
  time
) => {
  drawGrid(grid, context, animation, audio)
}
