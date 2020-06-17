import React, { useLayoutEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import { setupCanvas } from "../lib/animation/food"

const FoodRoulettePage = ({ data }) => {
  const [selectedFoodOption, setSelectedFoodOption] = useState("")
  const [foodType, setFoodType] = useState("dinner")

  // TODO Move to helper file
  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /* Start spin animation and select food option */
  const spin = async () => {
    const options = data[foodType].edges
    if (options) {
      const randomIndex = getRandomInt(0, options.length - 1)
      setSelectedFoodOption(options[randomIndex].node)
    } else {
      console.error(`Options for the food type ${foodType} do not exist`)
    }
  }

  const handleChange = e => setFoodType(e.target.value)

  useLayoutEffect(() => {
    setupCanvas(data["dinner"].edges)
    // setupCanvas(data["breakfast"].edges)
    // setupCanvas(data["lunch"].edges)
  }, [])

  // TODO Move markup to components in the components folder
  return (
    <Layout>
      <SEO title="Food Roulette" />
      {/* <h1>Food</h1> 
       <p>Spin the wheel. Eat food.</p>
      <select value={foodType} onChange={handleChange}>
        <option value="dinner">Dinner</option>
        <option value="lunch">Lunch</option>
        <option value="breakfast">Breakfast</option>
      </select>
      <p>
        [WARNING⚠️] You have no other choice. You must eat where the wheel
        chooses.
      </p>
      {selectedFoodOption && (
        <>
          <h2>{selectedFoodOption.name} it is!</h2>
          <p>There is no turning back now.</p>
        </>
      )}
      <button onClick={spin}>SPIN</button>
    */}
      <div>
        <canvas
          id="#food-canvas"
          style={{ height: "75vh", display: "block", margin: "0 auto" }}
        ></canvas>
      </div>
    </Layout>
  )
}

export default FoodRoulettePage

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
    breakfast: allFoodOption(
      filter: { foodType: { eq: "breakfast" } }
      sort: { fields: rating, order: DESC }
    ) {
      edges {
        node {
          ...Option
        }
      }
    }
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
    dinner: allFoodOption(
      filter: { foodType: { eq: "dinner" } }
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
