import React, { useRef } from "react"
import styled, { keyframes } from "styled-components"
import Tagline from "./Tagline"
import GithubImage from "../github-image"
import EmailImage from "../email-image"

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Header = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 0;
`

const ContactWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`

const ImageWrapper = styled.a`
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
`

const Hero = () => {
  const heroWrapperRef = useRef(null)
  return (
    <Wrapper ref={heroWrapperRef}>
      <Header>Chris Queen</Header>
      <Tagline heroWrapperRef={heroWrapperRef} />
      <ContactWrapper>
        <ImageWrapper href="https://github.com/chrisq21">
          <GithubImage />
        </ImageWrapper>
        <ImageWrapper href="mailto:chrisqueen10@gmail.com">
          <EmailImage />
        </ImageWrapper>
      </ContactWrapper>
    </Wrapper>
  )
}

export default Hero
