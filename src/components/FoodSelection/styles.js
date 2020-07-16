import styled from "styled-components"

export const Wrapper = styled.div`
  margin: 0 auto;
  height: 80vh;
  width: 100%;
`

export const CanvasWrapper = styled.div`
  position: relative;
`

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  transition: 500ms opacity ease;
  cursor: pointer;
  opacity: ${({ isAnimationActive }) => (isAnimationActive ? `0` : `0.9`)};

  &:hover {
    opacity: ${({ isAnimationActive }) => (isAnimationActive ? `0` : `0.7`)};
  }

  ${({ canvasSize }) => `
    height: ${canvasSize}px;
    width: ${canvasSize}px;
  `}
`

export const CanvasLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

export const Text = styled.span`
  color: white;
  font-weight: bold;
  font-size: 2rem;
`

export const Canvas = styled.canvas`
  display: block;
  margin: 0 auto;
`
