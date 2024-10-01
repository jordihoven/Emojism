// functions/get-emojis.js
export async function handler(event, context) {
    // Retrieve the API key from environment variables
    const EMOJI_API = process.env.EMOJI_API;
    const { query } = event.queryStringParameters;
  
    // Construct the URL for the emoji search (or get all emojis if no query)
    const apiUrl = query
      ? `https://emoji-api.com/emojis?access_key=${EMOJI_API}&search=${query}`
      : `https://emoji-api.com/emojis?access_key=${EMOJI_API}`;
  
      console.log(apiUrl)
    try {
      // Fetch data from the Emoji API
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('netlify function response: ', data)
  
      // Check if the response contains any errors
      if (!data || data.error) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: data.error || 'No results found' }),
        };
      }
  
      // Return the data in the response
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (err) {
      console.error('Error fetching data from Emoji API:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  }
  