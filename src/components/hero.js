import React from "react"
import styled from "styled-components"
import { heroHeight } from "../constants/styles"

const Wrapper = styled.div`
  height: ${heroHeight};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid green;
`

const Hero = () => (
  <Wrapper>
    <h1>Chris Queen</h1>
    <p>Here are some things about the person in question.</p>
  </Wrapper>
)

export default Hero
