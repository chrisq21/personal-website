import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/Hero/index.js"
import { graphql } from "gatsby"
import FoodSelection from "../components/FoodSelection"

const IndexPage = ({ data }) => (
  <Layout>
    {console.log(data)}
    <SEO title="Home" />
    <Hero />
    <div>
      <FoodSelection foodOptions={data["lunch"].edges} />
    </div>
    <div>
      <Link to="/tree/">dendrogram</Link>
    </div>
  </Layout>
)

export default IndexPage

export const fragment = graphql`
  fragment Option on FoodOption {
    name
    foodType
    rating
    image_url
    url
    price
  }
`

export const query = graphql`
  query BreakfastQuery {
    lunch: allFoodOption(
      filter: { foodType: { eq: "lunch" } }
      sort: { fields: rating, order: DESC }
    ) {
      edges {
        node {
          ...Option
        }
      }
    }
  }
`
