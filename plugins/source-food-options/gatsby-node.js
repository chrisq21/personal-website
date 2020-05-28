const fetch = require("node-fetch")
const { YELP_API_KEY } = require("../../secrets")

const yelpEndpoint = "https://api.yelp.com/v3/businesses/search"

/**
 * Food Type Params
 * The `open_at` field here can't be trusted very much unfortunately.
 * Each `open_at` value represents a certain time on Thursday, May 28, 2020,
 * so if a business changes their times or if the weekend times are different, that won't be reflected in the data
 *
 * Unix times:
 * Breakfast (7AM EST, Thursday, May 28, 2020) ====> 1590663600
 * Lunch (12PM EST, Thursday, May 28, 2020) ====> 1590681600
 * Dinner (5PM EST, Thursday, May 28, 2020) ====> 1590699600
 */
const foodTypeParams = (() => {
  const foodTimes = {
    BREAKFAST: "1590663600",
    LUNCH: "1590681600",
    DINNER: "1590699600",
  }

  return {
    breakfast: {
      term: "breakfast",
      open_at: foodTimes.BREAKFAST,
    },
    lunch: {
      term: "lunch",
      open_at: foodTimes.LUNCH,
    },
    dinner: {
      term: "dinner",
      open_at: foodTimes.DINNER,
    },
  }
})()

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
        Authorization: `Bearer ${YELP_API_KEY}`,
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
    addGatsbyNode(
      createNode,
      createNodeId,
      createContentDigest,
      key,
      foodOptions
    )
  })
}
