import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/Hero/index.js"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Hero />
    <div>
      <Link to="/food/">Food Roulette</Link>
    </div>
    <div>
      <Link to="/tree/">dendrogram</Link>
    </div>
  </Layout>
)

export default IndexPage
