import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styled, { keyframes } from "styled-components"
import mockImageData from "../components/Tree/mockData"

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
const Image = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  margin: 0;
  clip-path: circle(44% at center);

  width: 0px;

  animation-duration: 500ms;
  animation-delay: ${({ index, total }) => (total - index) * 500}ms;
  animation-name: ${({ index, total }) => keyframes`

  from {
    width: 0px;
  }

  to {
    width: ${100 - (index / total) * 100}%;
  }

`};
  animation-fill-mode: forwards;

  &:hover {
    border: 3px solid red;
  }
`

const requestCode = () => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
  window.location = authURL
}

const TreePage = () => {
  const [imageData, setImageData] = useState(null)
  const [images, setImages] = useState(null)
  const [imageLoadCounter, setImageLoadCounter] = useState(0)

  useEffect(() => {
    const fetchImageData = async accessToken => {
      // TODO Error handling
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=media_url,media_type,id,timestamp&access_token=${accessToken}`
      )
      const imageData = await res.json()
      console.log("fetchImageData: ", imageData)
      return imageData
    }

    const fetchAccessToken = async code => {
      const body = {
        client_id: process.env.GATSBY_INSTAGRAM_CLIENT_ID,
        client_secret: process.env.GATSBY_INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.GATSBY_INSTAGRAM_REDIRECT_URI,
        code,
      }
      // TODO generate str from body
      const str = `client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&client_secret=${process.env.GATSBY_INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&code=${code}`

      const res = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "post",
        body: str,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      // TODO wrap in try/catch
      const data = await res.json()
      return data.access_token
    }

    const fetchTokenAndImage = async searchParams => {
      const code = searchParams.split("code=")[1]
      const accessToken = await fetchAccessToken(code)
      const imageData = await fetchImageData(accessToken)
      setImageData(imageData)
    }

    const searchParams = window.location.search
    if (searchParams && searchParams.includes("code")) {
      fetchTokenAndImage(searchParams)
    }

    if (process.env.GATSBY_LOCAL_DEV) {
      setImageData(mockImageData)
    }
  }, [])

  useEffect(() => {
    const handleImageLoad = () => {
      setImageLoadCounter(count => count + 1)
    }
    const renderImages = images => {
      const imageElements = images.map(({ media_url, id }, index) => (
        <Image
          key={id}
          index={index + 1}
          total={imageData.data.length}
          src={media_url}
          onLoad={handleImageLoad}
        />
      ))
      return imageElements
    }
    if (imageData && imageData.data.length > 0) {
      setImages(renderImages(imageData.data))
    }
  }, [imageData, setImageLoadCounter, setImages])
  console.log(imageLoadCounter)

  return (
    <Layout>
      <SEO title="Tree" />
      <h1>Tree page</h1>
      {!imageData && (
        <button onClick={requestCode}>I dare you to press this button</button>
      )}
      {imageData && imageData.data && imageLoadCounter < imageData.data.length && (
        <p>
          Images Loaded: {imageLoadCounter} / {imageData.data.length}
        </p>
      )}
      {images && (
        <Wrapper>
          <ImageWrapper>{images}</ImageWrapper>
        </Wrapper>
      )}
    </Layout>
  )
}

export default TreePage
