import styled from "styled-components"

export const TaglineWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 40px;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    height: auto;
  }
`

export const StaticText = styled.span`
  height: 40px;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    height: auto;
  }
`

export const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  margin-left: 5px;

  animation-name: ${({ keyFrames }) => keyFrames};
  animation-duration: 15s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(1, -0.86, 0, 1);

  @media screen and (max-width: 768px) {
    animation-delay: 3s;
    transform: translate(0px, 0px);
    animation-name: ${({ mobileKeyFrames }) => mobileKeyFrames};
    flex-direction: row;
    height: auto;
    margin-left: 0;
  }
`

export const Option = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: bold;
  transform-origin: 50% 100%;

  @media screen and (max-width: 768px) {
    height: auto;
    width: ${({ wrapperWidth }) => wrapperWidth}px;
  }
`
