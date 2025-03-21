// functions/get-emojis.js
export async function handler(event, context) {
  const { query } = event.queryStringParameters

  // Construct the URL for the emoji search (or get all emojis if no query)
  const apiUrl = `https://emoji.family/api/emojis?search=${query}`

  try {
    // Fetch data from the Emoji API
    const response = await fetch(apiUrl)

    // Log the response status and body for debugging
    console.log('Response status:', response.status)
    const text = await response.text() // Read the response as text
    console.log('Response body:', text) // Log the response body

    // Try to parse the response as JSON
    const data = JSON.parse(text)

    console.log('Parsed data:', data)

    // Check if the response contains any emojis
    if (!Array.isArray(data) || data.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No results found' })
      }
    }

    // Return the data in the response
    return {
      statusCode: 200,
      body: JSON.stringify(data) // Return the emojis directly
    }
  } catch (err) {
    console.error('Error fetching data from Emoji API:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}
