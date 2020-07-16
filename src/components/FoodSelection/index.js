import React, { useLayoutEffect, useState, useEffect } from "react"
import FoodAnimation from "../../lib/animation/food"
import {
  Wrapper,
  CanvasWrapper,
  CanvasLink,
  Overlay,
  Text,
  Canvas,
} from "./styles"

const FoodSelection = ({ foodOptions }) => {
  const [canvasSize, setCanvasSize] = useState(null)
  const [animationInstance, setAnimationInstance] = useState(null)
  const [isAnimationActive, setIsAnimationActive] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)

  /* Once the DOM loads, set the canvas dimensions to the min between container height and container width. */
  useLayoutEffect(() => {
    const wrapperElement = document.querySelector("#container")
    const wrapperWidth = wrapperElement.offsetWidth
    const wrapperHeight = wrapperElement.offsetHeight
    setCanvasSize(Math.min(wrapperWidth, wrapperHeight))
  }, [])

  /* Once the canvas has proper dimensions, display the grid */
  useEffect(() => {
    if (canvasSize) {
      const animation = new FoodAnimation(foodOptions, setSelectedFood)
      animation.showGrid()
      setAnimationInstance(animation)
    }
  }, [canvasSize])

  const handleCanvasOverlayClick = () => {
    if (animationInstance && !isAnimationActive) {
      animationInstance.startSearchingAnimation()
      setIsAnimationActive(true)
    }
  }

  return (
    <Wrapper>
      {!!canvasSize && (
        <CanvasWrapper>
          <Canvas
            width={canvasSize}
            height={canvasSize}
            id="#food-canvas"
          ></Canvas>
          <Overlay
            canvasSize={canvasSize}
            onClick={handleCanvasOverlayClick}
            isAnimationActive={isAnimationActive}
          >
            {selectedFood && <CanvasLink href={selectedFood.foodData.url} />}
            <Text>Find me food!</Text>
          </Overlay>
        </CanvasWrapper>
      )}
    </Wrapper>
  )
}

export default FoodSelection
