const fetch = require("node-fetch")
const { YELP_API_KEY } = require("./secrets")

const yelpEndpoint = "https://api.yelp.com/v3/businesses/search"
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const fetchFood = async params => {
  const url = new URL(yelpEndpoint)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  )

  try {
    const res = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
    })
    // TODO check status code
    const food = await res.json()
    return food
  } catch (error) {
    console.error(error)
  }
}

const addGatsbyNode = async (
  createNode,
  createNodeId,
  createContentDigest,
  foodType,
  foodOptions
) => {
  if (foodOptions.businesses.length > 0) {
    foodOptions.businesses.forEach(option => {
      const nodeMeta = {
        id: createNodeId(`food-option-${option.id}`),
        foodType,
        internal: {
          type: "FoodOption",
          contentDigest: createContentDigest(option),
        },
      }
      const node = { ...option, ...nodeMeta }
      createNode(node)
    })
  } else {
    console.error("No food options were provided")
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type FoodOption implements Node @dontInfer {
      name: String
      id: ID
      rating: String
      price: String
      image_url: String
      url: String
      foodType: String
    }
  `

  createTypes(typeDefs)
}

// Breakfast (7AM EST, Thursday, May 28, 2020) ====> 1590663600
// Lunch (12PM EST, Thursday, May 28, 2020) ====> 1590681600
// Dinner (5PM EST, Thursday, May 28, 2020) ====> 1590699600
// "type" could be retrieved from key, but setting the value explicitly adds flexibility in the future

const foodTypeData = (() => {
  const breakfastTime = "1590663600"
  const lunchTime = "1590681600"
  const dinnerTime = "1590699600"
  return {
    breakfast: {
      open_at: breakfastTime,
      params: {
        term: "breakfast",
        open_at: breakfastTime,
      },
    },
    lunch: {
      open_at: lunchTime,
      params: {
        term: "lunch",
        open_at: lunchTime,
      },
    },
    dinner: {
      open_at: dinnerTime,
      params: {
        term: "dinner",
        open_at: dinnerTime,
      },
    },
  }
})()

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions
  const baseParams = {
    location: "30318",
    limit: 20,
  }

  // TODO Add breakfast, lunch, dinner options using "open_at" param
  const { breakfast, lunch, dinner } = foodTypeData

  // Replace all of the operations below with a loop through the foodTypeData object

  // Fetch Breakfast Options
  const breakfastOptions = await fetchFood({
    ...baseParams,
    ...breakfast.params,
  })
  addGatsbyNode(
    createNode,
    createNodeId,
    createContentDigest,
    "breakfast",
    breakfastOptions
  )

  // Fetch Lunch Options
  const lunchOptions = await fetchFood({
    ...baseParams,
    ...lunch.params,
  })
  addGatsbyNode(
    createNode,
    createNodeId,
    createContentDigest,
    "lunch",
    lunchOptions
  )

  // Fetch Dinner Options
  const dinnerOptions = await fetchFood({
    ...baseParams,
    ...dinner.params,
  })
  addGatsbyNode(
    createNode,
    createNodeId,
    createContentDigest,
    "dinner",
    dinnerOptions
  )
}
