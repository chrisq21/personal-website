import React, { useLayoutEffect, useState, useEffect } from "react"
import styled from "styled-components"
import FoodAnimation from "../../lib/animation/food"

const Wrapper = styled.div`
  margin: 0 auto;
  height: 80vh;
  width: 100%;
`

const Canvas = styled.canvas`
  display: block;
  margin: 0 auto;
`

const FoodSelection = ({ foodOptions }) => {
  const [canvasSize, setCanvasSize] = useState(null)
  const [animationInstance, setAnimationInstance] = useState(null)

  /* Once the DOM loads, set the canvas dimensions to the min between container height and container width. */
  useLayoutEffect(() => {
    const wrapperElement = document.querySelector("#container")
    const wrapperWidth = wrapperElement.offsetWidth
    const wrapperHeight = wrapperElement.offsetHeight
    setCanvasSize(Math.min(wrapperWidth, wrapperHeight))
  }, [])

  /* Once the canvas has proper dimensions, load the animation */
  useEffect(() => {
    if (canvasSize) {
      const animation = new FoodAnimation(foodOptions)
      animation.showGrid()
      setAnimationInstance(animation)
    }
  }, [canvasSize])

  return (
    <Wrapper>
      {animationInstance && (
        <button onClick={animationInstance.startSearchingAnimation}>
          Start
        </button>
      )}
      {!!canvasSize && (
        <Canvas
          width={canvasSize}
          height={canvasSize}
          id="#food-canvas"
        ></Canvas>
      )}
    </Wrapper>
  )
}

export default FoodSelection
