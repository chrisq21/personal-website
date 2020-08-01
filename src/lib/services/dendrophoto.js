// TODO error handling
export const fetchImages = async tokenData => {
  const imageDataURL = `https://graph.instagram.com/${tokenData.user_id}/media?fields=media_url,media_type,id,timestamp&access_token`
  const res = await fetch(`${imageDataURL}=${tokenData.access_token}`)
  const imageData = await res.json()
  return imageData.data
}

// TODO error handling
export const fetchToken = async code => {
  const tokenURL = `https://api.instagram.com/oauth/access_token`
  const body = `client_id=${process.env.GATSBY_INSTAGRAM_CLIENT_ID}&client_secret=${process.env.GATSBY_INSTAGRAM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.GATSBY_INSTAGRAM_REDIRECT_URI}&code=${code}`
  const res = await fetch(tokenURL, {
    method: "post",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  const tokenData = await res.json()
  return tokenData
}
