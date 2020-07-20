import React, { useState } from "react"
import { keyframes } from "styled-components"
import { TaglineWrapper, StaticText, OptionsWrapper, Option } from "./styles"
import { taglineHeight } from "../../../constants/styles"
import { heroTaglines } from "../../../constants/text"
import useWindowResize from "../../../lib/hooks/useWindowResize"

/**
 * @param {boolean} shouldMoveVertically
 * @param {number} size
 * @param {array} taglines
 * @return A keyframes string for vertical or horizontal animation.
 * Example return value:
 * `
 *    0%, 50% {
 *      transform: translate(0px, -400px);
 *    }
 *
 *    100% {
 *       transform: translate(0px, 0px);
 *    }
 * `
 */
const generateTaglineKeyFrames = (shouldMoveVertically, size, taglines) => {
  const incrementor = 100 / taglines.length
  let generatedKeyFrames = ``
  taglines.map(
    (_, index) =>
      (generatedKeyFrames = `${generatedKeyFrames}\n
    ${index * incrementor}%, ${index * incrementor + incrementor / 2}% {
      ${
        shouldMoveVertically
          ? `transform: translate(0px, -${size * index}px);`
          : `transform: translate(-${size * index}px, 0px);`
      }
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

const Tagline = ({ heroWrapperRef }) => {
  const [wrapperWidth, setWrapperWidth] = useState(
    heroWrapperRef?.current?.offsetWidth
  )

  // Determine wrapper width on window resize for horizontal animation.
  useWindowResize(() => {
    setWrapperWidth(heroWrapperRef?.current?.offsetWidth)
  }, heroWrapperRef)

  const renderTaglineComponents = heroTaglines.map((tagline, index) => (
    <Option key={index} wrapperWidth={wrapperWidth}>
      {tagline}
    </Option>
  ))

  return (
    <TaglineWrapper>
      <StaticText>To me, software engineering</StaticText>
      <OptionsWrapper
        keyFrames={generateTaglineKeyFrames(true, taglineHeight, heroTaglines)}
        mobileKeyFrames={generateTaglineKeyFrames(
          false,
          wrapperWidth,
          heroTaglines
        )}
      >
        {renderTaglineComponents}
      </OptionsWrapper>
    </TaglineWrapper>
  )
}

export default Tagline
