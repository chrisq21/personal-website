import random from "canvas-sketch-util/random"
import BezierEasing from "bezier-easing"
import { lerp } from "canvas-sketch-util/math"
import Tone from "tone"

const setupAudio = async () => {
  if (Tone.context.state !== "running") {
    Tone.context.resume()
  }
  // Setup a reverb with ToneJS
  const reverb = new Tone.Reverb({
    decay: 4,
    wet: 0.5,
    preDelay: 0.2,
  }).toMaster()

  // Load the reverb
  await reverb.generate()

  // Setup a synth with ToneJS
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.001,
      decay: 0.5,
      sustain: 0.001,
      release: 5,
    },
  }).connect(reverb)

  return { synth, reverb }
}

const updateMvmtLine = (cursor, grid, animation) => {
  cursor.startingPointIndex = cursor.destinationPointIndex
  cursor.destinationPointIndex = random.rangeFloor(0, grid.size * grid.size - 1)
  animation.newLineTime = animation.currentTime
  animation.linesTraveled = animation.linesTraveled + 1
  if (animation.linesTraveled >= animation.linesToTravel && !animation.done) {
    animation.done = true
  }
  return cursor
}

const getGridOptions = (foodOptions, grid, canvas) => {
  const options = []
  const shuffledFoodOptions = random.shuffle(foodOptions)
  let counter = 0
  for (let i = 0; i < grid.size; i++) {
    for (let j = 0; j < grid.size; j++) {
      const u = i / (grid.size - 1)
      const x = lerp(grid.margin, canvas.width - grid.margin, u)
      const v = j / (grid.size - 1)
      const y = lerp(grid.margin, canvas.height - grid.margin, v)
      const index = counter % shuffledFoodOptions.length
      const foodOptionData = shuffledFoodOptions[index].node
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

export const checkCollisions = (animation, grid, cursor) => {
  grid.options.forEach((optionData, index) => {
    const [x, y] = optionData.point
    if (
      Math.abs(cursor.center.x - x) < cursor.radius + grid.orbRadius &&
      Math.abs(cursor.center.y - y) < cursor.radius + grid.orbRadius
    ) {
      /* Check to see if the orb is already animating,
       and whether or not the orb is the most recent orb to animate.
       This ensures that the same orb doesn't animate over and over again if the cursor hasn't moved on yet.
       */
      if (
        !grid.options[index].shouldAnimate &&
        index !== grid.recentlyAnimatedIndex
      ) {
        grid.options[index].shouldAnimate = true
        grid.options[index].animTime = animation.currentTime
        grid.recentlyAnimatedIndex = index
      }
    }
  })
}

/* Move cursor along a line */
export const updateCursorPosition = (cursor, grid, animation, canvas) => {
  /* Determine ease fn and distance complete */
  const lineMvmtEaseFn =
    animation.linesTraveled === animation.linesToTravel - 1
      ? cursor.easingFns.lastLineMvmt
      : cursor.easingFns.mainLineMvmt
  const lineCompletePercentage =
    (animation.currentTime - animation.newLineTime) / animation.lineTravelSpeed

  /* Calculate orbit center position */
  let startX
  let startY
  if (cursor.startingPointIndex < 0) {
    // Start in the center of the canvas
    startX = canvas.width / 2
    startY = canvas.height / 2
  } else {
    const startPoint = grid.options[cursor.startingPointIndex].point
    startX = startPoint[0]
    startY = startPoint[1]
  }

  const [endX, endY] = grid.options[cursor.destinationPointIndex].point
  if (lineCompletePercentage <= 1) {
    cursor.orbitCenter.x = lerp(
      startX,
      endX,
      lineMvmtEaseFn(lineCompletePercentage)
    )
    cursor.orbitCenter.y = lerp(
      startY,
      endY,
      lineMvmtEaseFn(lineCompletePercentage)
    )

    /* Calculate cursor position in relation to it's rotation around it's orbit */
    const rotation = Math.PI * animation.currentTime * cursor.rotationScalar
    cursor.center.x =
      cursor.orbitCenter.x + cursor.distanceFromOrbitCenter * Math.sin(rotation)
    cursor.center.y =
      cursor.orbitCenter.y + cursor.distanceFromOrbitCenter * Math.cos(rotation)
  } else {
    cursor = updateMvmtLine(cursor, grid, animation)
  }

  /* Update the cursors rotation speed and orbit distance based off of animation timing */
  const animCompletePercentage =
    (animation.totalTime + animation.currentTime) / animation.totalTime - 1
  if (animCompletePercentage <= 1) {
    cursor.rotationScalar = lerp(
      cursor.initialRotationScalar,
      0,
      cursor.easingFns.main(animCompletePercentage)
    )
    cursor.distanceFromOrbitCenter = lerp(
      cursor.initialDistanceFromOrbitCenter,
      0,
      cursor.easingFns.main(animCompletePercentage)
    )
  }
}

export const init = async (foodOptions, canvas) => {
  /* Grid */
  const grid = {
    size: 4, // total size = grid.size x grid.size
    margin: canvas.width / 5,
    orbRadius: canvas.width / 25,
    palette: [
      "rgb(185,211,176)",
      "rgb(129,189,164)",
      "rgb(178,135,116)",
      "rgb(248,143,121)",
      "rgb(246,170,147)",
    ],
    ripples: {
      count: 4,
      maxAlpha: 0.4,
      totalTime: 1.5,
      radiusAddition: canvas.width / 60,
      animations: [],
      recentlyAnimatedIndex: null,
      easeFn: BezierEasing(0.29, 0.81, 0.77, 0.95),
    },
  }
  grid.options = getGridOptions(foodOptions, grid, canvas)

  /* Cursor */
  const cursor = {
    center: {
      x: 0,
      y: 0,
    },
    orbitCenter: {
      x: 0,
      y: 0,
    },

    easingFns: {
      mainLineMvmt: BezierEasing(0.76, 0.02, 0.73, 0.93),
      lastLineMvmt: BezierEasing(0.7, 0.01, 0, 0.49),
      main: BezierEasing(1, 0.09, 0.55, 0.91),
    },

    radius: canvas.width / 30,
    initialDistanceFromOrbitCenter: canvas.width / 4,
    initialRotationScalar: 3,
    startingPointIndex: -1,
    destinationPointIndex: random.rangeFloor(0, grid.size * grid.size - 1),
  }

  /* Animation */
  const lineTravelSpeed = 1
  const linesToTravel = 6
  const animation = {
    startTime: null,
    currentTime: 0,
    newLineTime: 0,
    lineTravelSpeed,
    linesToTravel,
    linesTraveled: 0,
    totalTime: lineTravelSpeed * linesToTravel,
  }

  /* Audio */
  const { synth, reverb } = await setupAudio()
  const audio = {
    Tone,
    synth,
    reverb,
    notes: [
      "A6",
      "A5",
      "A4",
      "A3",
      "C6",
      "C5",
      "C4",
      "C3",
      "D6",
      "D5",
      "D4",
      "D3",
      "F6",
      "F5",
      "F4",
      "F3",
    ],
  }

  return { cursor, grid, animation, audio }
}
