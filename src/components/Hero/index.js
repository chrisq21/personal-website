import React from "react"
import styled from "styled-components"
import Tagline from "./Tagline"

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

const Hero = () => (
  <Wrapper>
    <Header>Chris Queen</Header>
    <Tagline />
  </Wrapper>
)

export default Hero
