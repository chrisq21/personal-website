import React, { useLayoutEffect, useState, useEffect } from "react"
import styled from "styled-components"
import FoodAnimation from "../../lib/animation/food"

const Wrapper = styled.div`
  margin: 0 auto;
  height: 80vh;
  width: 100%;
`

const CanvasWrapper = styled.div`
  position: relative;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  border-radius: 50px;
  transition: 1.5s opacity ease;
  cursor: pointer;
  opacity: ${({ isAnimationActive }) => (isAnimationActive ? `0` : `0.75`)};

  &:hover {
    opacity: ${({ isAnimationActive }) => (isAnimationActive ? `0` : `0.4`)};
  }

  ${({ canvasSize }) => `
    height: ${canvasSize}px;
    width: ${canvasSize}px;
  `}
`

const Text = styled.span`
  color: white;
  font-weight: bold;
  font-size: 2rem;
`

const Canvas = styled.canvas`
  display: block;
  margin: 0 auto;
`

const FoodSelection = ({ foodOptions }) => {
  const [canvasSize, setCanvasSize] = useState(null)
  const [animationInstance, setAnimationInstance] = useState(null)
  const [isAnimationActive, setIsAnimationActive] = useState(false)

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
      const animation = new FoodAnimation(foodOptions)
      animation.showGrid()
      setAnimationInstance(animation)
    }
  }, [canvasSize])

  const handleStartAnimationClick = () => {
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
            onClick={handleStartAnimationClick}
            isAnimationActive={isAnimationActive}
          >
            <Text>Start</Text>
          </Overlay>
        </CanvasWrapper>
      )}
    </Wrapper>
  )
}

export default FoodSelection
