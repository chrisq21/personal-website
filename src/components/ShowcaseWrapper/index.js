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

const Divider = styled.div`
  height: 1px;
  background: white;
  width: 0px;
  transition: width 500ms ease-out;
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
  margin: 4rem 0;
`

const ShowcaseWrapper = ({ header, body, children }) => {
  return (
    <Wrapper>
      <Header>{header}</Header>
      <Divider className="divider" />
      <Body>{body}</Body>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </Wrapper>
  )
}

export default ShowcaseWrapper
