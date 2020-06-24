import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const requestInstagramAuth = async () => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
  window.location = authURL
}

const TreePage = () => (
  <Layout>
    <SEO title="Tree" />
    <h1>Tree page</h1>
    <button onClick={requestInstagramAuth}>
      I dare you to press this button
    </button>
  </Layout>
)

export default TreePage
