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
    }
  `

  createTypes(typeDefs)
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  // TODO Add breakfast, lunch, dinner options using "open_at" param

  const { createNode } = actions
  const params = {
    location: "30318",
    limit: 20,
    term: "lunch",
  }

  const food = await fetchFood(params)
  if (food.businesses.length > 0) {
    food.businesses.forEach(foodOption => {
      const nodeMeta = {
        id: createNodeId(`food-option-${foodOption.id}`),
        internal: {
          type: "FoodOption",
          contentDigest: createContentDigest(foodOption),
        },
      }
      const node = { ...foodOption, ...nodeMeta }
      createNode(node)
    })
  }
}
