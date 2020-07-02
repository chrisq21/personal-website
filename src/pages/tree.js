import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TreeWrapper from "../components/Tree"
import styled, { keyframes } from "styled-components"
import mockImageData from "../components/Tree/mockData"

const requestCode = () => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
  window.location = authURL
}

const TreePage = () => {
  const [instagramData, setInstagramData] = useState(null)
  const [images, setImages] = useState([])
  const [imageLoadCounter, setImageLoadCounter] = useState(0)

  useEffect(() => {
    const fetchInstagramData = async accessToken => {
      // TODO Error handling
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=media_url,media_type,id,timestamp&access_token=${accessToken}`
      )
      const instagramData = await res.json()
      return instagramData
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

      // TODO wrap in try/catch
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
      const instagramData = await fetchInstagramData(accessToken)
      setInstagramData(instagramData)
    }

    const searchParams = window.location.search
    if (searchParams && searchParams.includes("code")) {
      fetchTokenAndImage(searchParams)
    }

    if (process.env.GATSBY_LOCAL_DEV) {
      setInstagramData(mockImageData)
    }
  }, [])

  useEffect(() => {
    if (instagramData && instagramData.data.length > 0) {
      setImages(
        instagramData.data.filter(image => image.media_type !== "VIDEO")
      )
    }
  }, [instagramData, setImageLoadCounter, setImages])
  console.log(imageLoadCounter)

  return (
    <Layout>
      <SEO title="Tree" />
      <h1>Tree page</h1>
      {!instagramData && (
        <button onClick={requestCode}>I dare you to press this button</button>
      )}
      {images && images.length > 0 && <TreeWrapper images={images} />}
    </Layout>
  )
}

export default TreePage
