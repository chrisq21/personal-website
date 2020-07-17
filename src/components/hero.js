import React from "react"
import styled, { keyframes } from "styled-components"
import { taglineHeight } from "../constants/styles"
import { heroTaglines } from "../constants/text"

const generateTaglineKeyFrames = (height, taglines) => {
  const incrementor = 100 / taglines.length
  let generatedKeyFrames = ``
  taglines.map(
    (_, index) =>
      (generatedKeyFrames = `${generatedKeyFrames}\n
    ${index * incrementor}%, ${index * incrementor + incrementor / 2}% {
      transform: translate(0px, -${height * index}px);
    }
  `)
  )

  generatedKeyFrames = `${generatedKeyFrames}\n
    100% {
      transform: translate(0px, 0px);
    }
  `

  console.log(generatedKeyFrames)

  return keyframes`${generatedKeyFrames}`
}

const Wrapper = styled.div`
  height: 100vh;
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

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  margin-left: 5px;

  animation: 15s cubic-bezier(1, -0.86, 0, 1)
    ${({ taglineKeyframes }) => taglineKeyframes} infinite;
  animation-delay: 2s;
`

const Option = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: bold;
  transform-origin: 50% 100%;
`

const taglines = heroTaglines.map((tagline, index) => (
  <Option key={index}>{tagline}</Option>
))

const Hero = () => (
  <Wrapper>
    <Header>Chris Queen</Header>
    <TaglineWrapper>
      <StaticText>To me, software engineering</StaticText>
      <OptionsWrapper
        taglineKeyframes={generateTaglineKeyFrames(taglineHeight, taglines)}
      >
        {taglines}
      </OptionsWrapper>
    </TaglineWrapper>
  </Wrapper>
)

export default Hero
