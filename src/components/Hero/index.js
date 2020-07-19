import React from "react"
import styled from "styled-components"
import Tagline from "./Tagline"
import GithubImage from "../github-image"
import EmailImage from "../email-image"

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
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

const ImageWrapper = styled.div`
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
`

const Hero = () => (
  <Wrapper>
    <Header>Chris Queen</Header>
    <Tagline />
    <ContactWrapper>
      <ImageWrapper>
        <GithubImage />
      </ImageWrapper>
      <ImageWrapper>
        <EmailImage />
      </ImageWrapper>
    </ContactWrapper>
  </Wrapper>
)

export default Hero
