import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const FoodRoulettePage = () => {
  /* Start spin animation and select food option */
  const spin = async () => {}

  return (
    <Layout>
      <SEO title="Food Roulette" />
      <h1>Food Roulette</h1>
      <p>Spin the wheel. Eat food.</p>
      <button onClick={spin}>SPIN</button>
    </Layout>
  )
}

export default FoodRoulettePage
