import styled, { keyframes } from "styled-components"
import { ANIMATION_SPEED_MS, darkBrown, lightBrown } from "../constants"

const fadeInMain = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const fadeInOverlay = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.75;
  }
`

const FadeInAnimation = styled.div`
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  animation-name: ${fadeInMain};
  animation-delay: ${({ index }) => index * ANIMATION_SPEED_MS}ms;
  animation-duration: ${ANIMATION_SPEED_MS}ms;

  ${({ isInitialAnimationDone }) =>
    isInitialAnimationDone &&
    `
    animation-delay: 0s;
    animation-duration: 100ms;
  `}
`

const AbsoluteCenterCircleFadeIn = styled(FadeInAnimation)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
`

export const ImageWrapper = styled(AbsoluteCenterCircleFadeIn)`
  opacity: 0;
  cursor: pointer;

  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  z-index: ${({ isSelected }) => (isSelected ? "2" : "1")};
  pointer-events: ${({ isSelected }) => (isSelected ? "none" : "auto")};
`

export const ImageBorder = styled(AbsoluteCenterCircleFadeIn)`
  opacity: 0;
  z-index: 3;
  pointer-events: none;
  border-style: solid;
  border-color: ${darkBrown};

  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-width: ${({ isUnderSelectedImage }) =>
    isUnderSelectedImage ? "1" : "3"}px;
`

export const ImageOverlay = styled(FadeInAnimation)`
  opacity: 0;
  background: ${lightBrown};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  // Wait ANIMATION_SPEED_MS milliseconds longer than normal to display the image without overlay initially
  animation-delay: ${({ index }) => (index + 1) * ANIMATION_SPEED_MS}ms;
  animation-name: ${fadeInOverlay};

  ${({ isInitialAnimationDone }) =>
    isInitialAnimationDone &&
    `
      animation-delay: 0s;
      &:hover {
        animation-direction: reverse;
      }
    `}

  ${({ isSelected }) => isSelected && ` animation-direction: reverse; `}
`

export const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`
