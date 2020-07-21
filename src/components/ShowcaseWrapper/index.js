import React from "react"
import styled, { keyframes } from "styled-components"
import { mobileBreakpoint } from "../../constants/styles"
const Wrapper = styled.div`
  margin-bottom: 10rem;
`

const Header = styled.h2`
  color: white;
  margin-bottom: 0.5rem;
`

const widthKeyframes = keyframes`
  0% {
    width: 0px;
  }
  100% {
    width: 100%;
  }
`

const Divider = styled.div`
  height: 1px;
  background: white;
  width: 0px;
  animation: 300ms ease-out ${widthKeyframes} forwards;
`

const Body = styled.p`
  margin: 1rem 0;
  color: white;
  width: 75%;

  @media screen and (max-width: ${mobileBreakpoint}px) {
    width: 95%;
  }
`

const ChildrenWrapper = styled.div`
  margin: 5rem 0;
`

const ShowcaseWrapper = ({ header, body, children }) => {
  return (
    <Wrapper>
      <Header>{header}</Header>
      <Divider />
      <Body>{body}</Body>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Wrapper>
  )
}

export default ShowcaseWrapper
