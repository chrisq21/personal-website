import React, { useLayoutEffect, useState, useEffect } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"
// import { showCanvas, startAnimation } from "../lib/animation/food/index.js"
import { startAnimation } from "../lib/animation/food/index.js"

const FoodRoulettePage = ({ data }) => {
  const [selectedFoodOption, setSelectedFoodOption] = useState(null)
  const [foodType, setFoodType] = useState("dinner")
  const [canvasDimensions, setCanvasDimensions] = useState(0)

  useLayoutEffect(() => {
    const wrapperElement = document.getElementById("container")
    const wrapperWidth = wrapperElement.offsetWidth
    const wrapperHeight = wrapperElement.offsetHeight

    const newCanvasDimensions =
      wrapperWidth > wrapperHeight ? wrapperHeight : wrapperWidth
    console.log("Dimension: ", newCanvasDimensions)
    setCanvasDimensions(newCanvasDimensions)
  }, [])

  useEffect(() => {
    if (canvasDimensions > 0) {
      // showCanvas(data["dinner"].edges)
    }
  }, [canvasDimensions])

  useEffect(() => {
    console.log("Food option: ", selectedFoodOption)
    if (document) {
      const canvas = document.getElementById("food-canvas")

      if (canvas) {
        canvas.style.opacity = "0"
      }
    }
  }, [selectedFoodOption])

  const start = () => {
    startAnimation(data["dinner"].edges, setSelectedFoodOption)
  }

  console.log("selectedFoodOption: ", selectedFoodOption)
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
      <button onClick={spin}>SPIN</button> */}
      <button onClick={start}>Start</button>

      <div
        id="canvas-wrapper"
        style={{ height: "90vh", width: "100%", position: "relative" }}
      >
        {canvasDimensions > 0 && (
          <canvas
            width={canvasDimensions}
            height={canvasDimensions}
            id="#food-canvas"
            style={{
              display: "block",
              margin: "0 auto",
              opacity: `${selectedFoodOption ? "0" : "1"}`,
              transition: `3s ease 0s opacity`,
            }}
          ></canvas>
        )}
      </div>
      {selectedFoodOption && (
        <div style={{ margin: "0 auto" }}>
          <h1>{selectedFoodOption.foodOptionData.name}</h1>
        </div>
      )}
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
