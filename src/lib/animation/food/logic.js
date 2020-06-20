import random from "canvas-sketch-util/random"
import BezierEasing from "bezier-easing"
import { lerp } from "canvas-sketch-util/math"

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
export const updateCursorPosition = (cursor, grid, animation) => {
  /* Determine ease fn and distance complete */
  const lineMvmtEaseFn =
    animation.linesTraveled === animation.linesToTravel - 1
      ? cursor.easingFns.lastLineMvmt
      : cursor.easingFns.mainLineMvmt
  const lineCompletePercentage =
    (animation.currentTime - animation.newLineTime) / animation.lineTravelSpeed

  /* Calculate orbit center position */
  const [startX, startY] = grid.options[cursor.startingPointIndex].point
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

export const init = (foodOptions, canvas) => {
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
      count: 3,
      maxAlpha: 0.35,
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
    initialDistanceFromOrbitCenter: canvas.width / 3,
    distanceFromOrbitCenter: canvas.width / 3,
    initialRotationScalar: 5,
    rotationScalar: 5,
    startingPointIndex: Math.round((grid.size * grid.size) / 2),
    destinationPointIndex: random.rangeFloor(0, grid.size * grid.size - 1),
  }

  /* Animation controls*/
  const lineTravelSpeed = 1
  const linesToTravel = 5
  const animation = {
    startTime: null,
    currentTime: 0,
    newLineTime: 0,
    lineTravelSpeed,
    linesToTravel,
    linesTraveled: 0,
    totalTime: lineTravelSpeed * linesToTravel,
  }

  return { cursor, grid, animation }
}
