import styled, { keyframes } from "styled-components"

const ANIMATION_SPEED_MS = 300

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

  animation-name: ${fadeInMain};
  animation-delay: ${({ index }) => index * ANIMATION_SPEED_MS}ms;
  animation-duration: ${ANIMATION_SPEED_MS}ms;
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
  border-color: #834200;

  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-width: ${({ isUnderSelectedImage }) =>
    isUnderSelectedImage ? "1" : "3"}px;
`

export const ImageOverlay = styled(FadeInAnimation)`
  opacity: 0;
  background: #d56c01;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  &:hover {
    animation: none;
    opacity: 0;
  }

  animation-name: ${fadeInOverlay};
`

export const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`
