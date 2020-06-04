const fetch = require("node-fetch")

const yelpEndpoint = "https://api.yelp.com/v3/businesses/search"

const foodTypeParams = {
  breakfast: {
    term: "breakfast",
  },
  lunch: {
    term: "lunch",
  },
  dinner: {
    term: "dinner",
  },
}

/**
 *
 * @param {Object} params
 * @description Fetch food option data with given search params
 * @returns {Array} Array of food options
 */
const fetchFood = async params => {
  const url = new URL(yelpEndpoint)
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  )
  try {
    const res = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    })
    if (res.statusText !== "OK")
      throw new Error("Something went wrong fetching food data")

    const food = await res.json()

    if (food && food.businesses && food.businesses.length > 0) {
      return food.businesses
    } else {
      throw new Error("No food data was found with the given search params")
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 *
 * @param {func} createNode
 * @param {func} createNodeId
 * @param {func} createContentDigest
 * @param {String} foodType
 * @param {Array} foodOptions
 * @description Calls the `createNode` Gatsby action for every `foodOption` in the `foodOptions` array
 */
const addGatsbyNode = async (
  createNode,
  createNodeId,
  createContentDigest,
  foodType,
  foodOptions
) => {
  foodOptions.forEach(async foodOption => {
    const nodeMeta = {
      id: createNodeId(`food-option-${foodOption.id}`),
      foodType,
      internal: {
        type: "FoodOption",
        contentDigest: createContentDigest(foodOption),
      },
    }
    const node = { ...foodOption, ...nodeMeta }
    await createNode(node)
  })
}

/**
 * Creates the `FoodOption` GraphQL Schema Type
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type FoodOption implements Node @dontInfer {
      name: String!
      id: ID!
      rating: String
      price: String
      image_url: String
      url: String!
      foodType: String!
    }
  `

  createTypes(typeDefs)
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions
  const baseParams = {
    location: "30318", // My zip. Please don't use it to stalk me.
    limit: 20,
  }

  // Fetch food options by type, then create Gatsby nodes
  Object.entries(foodTypeParams).forEach(async ([key, value]) => {
    const foodOptions = await fetchFood({
      ...baseParams,
      ...value,
    })

    if (foodOptions.length > 0) {
      addGatsbyNode(
        createNode,
        createNodeId,
        createContentDigest,
        key,
        foodOptions
      )
    }
  })
}
