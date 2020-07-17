import React from "react"
import styled, { keyframes } from "styled-components"
import { heroHeight } from "../constants/styles"

const Wrapper = styled.div`
  height: ${heroHeight};
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Header = styled.h1`
  font-size: 4rem;
  font-weight: bold;
`

const TaglineWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 20px;
  height: 40px;
  overflow: hidden;
`

const StaticText = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
`

const TaglineAnimation = keyframes`
  0% {
    transform: translate(0px, 0px);
  }

  10% {
    transform: translate(0px, 0px);
  }

  20% {
    transform: translate(0px, -40px);
  }

  30% {
    transform: translate(0px, -40px);
  }

  40% {
    transform: translate(0px, -80px);
  }

  50% {
    transform: translate(0px, -80px);
  }

  60% {
    transform: translate(0px, -120px);
  }

  70% {
    transform: translate(0px, -120px);
  }

  80% {
    transform: translate(0px, -160px);
  }

  90% {
    transform: translate(0px, -160px);
  }

  100% {
    transform: translate(0px, 0px);
  }
`

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  margin-left: 5px;

  animation: 15s cubic-bezier(1, -0.86, 0, 1) ${TaglineAnimation} infinite;
  animation-delay: 2s;
`

const Options = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: bold;
  transform-origin: 50% 100%;
`

const Hero = () => (
  <Wrapper>
    <Header>Chris Queen</Header>
    <TaglineWrapper>
      <StaticText>To me, software engineering</StaticText>
      <OptionsWrapper>
        <Options>is the most powerful tool in the universe.</Options>
        <Options>is a fruitful occupation.</Options>
        <Options>is an outlet for creative expression.</Options>
        <Options>is a bit of an addiction...</Options>
        <Options>should be accessible to everyone.</Options>
        <Options></Options>
      </OptionsWrapper>
    </TaglineWrapper>
  </Wrapper>
)

export default Hero
