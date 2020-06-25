import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styled from "styled-components"

const Wrapper = styled.div`
  position: relative;
`

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: ${({ index, total }) => 100 - (index / total) * 100}%;
  width: ${({ index, total }) => 100 - (index / total) * 100}%;
`

const requestCode = () => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
  window.location = authURL
}

const TreePage = () => {
  const [imageData, setImageData] = useState(null)
  const [images, setImages] = useState(null)
  const [imageLoadCounter, setImageLoadCounter] = useState(0)

  useEffect(async () => {
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

      const str = `client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&client_secret=${process.env.GATSBY_INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&code=${code}`

      const res = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "post",
        body: str,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      const data = await res.json()
      console.log("fetchAccessToken: ", data)
      return data.access_token
    }

    const searchParams = window.location.search
    if (searchParams && searchParams.includes("code")) {
      const code = searchParams.split("code=")[1]
      const accessToken = await fetchAccessToken(code)
      const imageData = await fetchImageData(accessToken)
      setImageData(imageData)
    }
  }, [])

  useEffect(() => {
    const handleImageLoad = () => {
      setImageLoadCounter(count => count + 1)
    }
    const renderImages = images => {
      const imageElements = images.map(({ media_url }, index) => (
        <Image
          index={index + 1}
          total={imageData.data.length}
          src={media_url}
          onLoad={handleImageLoad}
        />
      ))
      return imageElements
    }
    if (imageData && imageData.data.length > 0) {
      setImages(renderImages(imageData.data.reverse()))
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
      {images && <Wrapper>{images}</Wrapper>}
    </Layout>
  )
}

export default TreePage