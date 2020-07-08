import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Very much under construction</h1>
    <div>
      <Link to="/food/">Food Roulette</Link>
    </div>
    <div>
      <Link to="/tree/">dendrogram</Link>
    </div>
  </Layout>
)

export default IndexPage
