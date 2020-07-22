import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/Hero/index.js"
import { graphql } from "gatsby"
import ShowcaseWrapper from "../components/ShowcaseWrapper"
import FoodSelection from "../components/FoodSelection"
import Tree from "../components/Tree"
import { mindfulness, dendroPhoto, foodSelection } from "../constants/text"
import MindfulnessImage from "../components/mindfulness-image"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Hero />
    <div>
      <ShowcaseWrapper header={mindfulness.header} body={mindfulness.body}>
        <a
          href="https://apps.apple.com/us/app/mindful-life-project/id1033749749"
          target="_blank"
        >
          <MindfulnessImage style={{ margin: "0 auto", maxWidth: "300px" }} />
        </a>
      </ShowcaseWrapper>
      <ShowcaseWrapper header={dendroPhoto.header} body={dendroPhoto.body}>
        <Tree />
      </ShowcaseWrapper>
      <ShowcaseWrapper header={foodSelection.header} body={foodSelection.body}>
        <FoodSelection foodOptions={data["lunch"].edges} />
      </ShowcaseWrapper>
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
