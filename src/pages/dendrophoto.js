import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { fetchToken, fetchImages } from "../lib/services"

const DendroPhotoPage = () => {
  const [images, setImages] = useState(null)
  useEffect(() => {
    const getImages = async code => {
      const accessToken = await fetchToken(code)
      const imageData = await fetchImages(accessToken)
      setImageData(imageData)
    }

    const searchParams = window?.location?.search
    if (searchParams && searchParams.includes("code")) {
      const code = searchParams.split("code=")[1]
      getImages(code)
    }
  }, [])

  const requestCode = () => {
    // TODO move to constants file
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
    window.location = authURL
  }

  return (
    <Layout>
      <SEO title="DendroPhoto" />
      <h1>Dendro-Photo</h1>
      <button onClick={requestCode}>Get Photo Data</button>
    </Layout>
  )
}

export default DendroPhotoPage
