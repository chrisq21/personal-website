import React from "react"
import { keyframes } from "styled-components"
import { TaglineWrapper, StaticText, OptionsWrapper, Option } from "./styles"
import { taglineHeight } from "../../../constants/styles"
import { heroTaglines } from "../../../constants/text"

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
  return keyframes`${generatedKeyFrames}`
}

const taglineComponents = heroTaglines.map((tagline, index) => (
  <Option key={index}>{tagline}</Option>
))

const Tagline = () => (
  <TaglineWrapper>
    <StaticText>To me, software engineering</StaticText>
    <OptionsWrapper
      taglineKeyframes={generateTaglineKeyFrames(taglineHeight, heroTaglines)}
    >
      {taglineComponents}
    </OptionsWrapper>
  </TaglineWrapper>
)

export default Tagline
