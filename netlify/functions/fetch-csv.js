// netlify/functions/fetch-csv.js

// Netlify Functions (on the Essential/Starter plan) use Node.js, 
// and 'node-fetch' is generally available, but you might need 
// to ensure it's in your dependencies if you're using a specific build process.

const fetch = require('node-fetch');

// The secret URL is pulled from the environment variable you set on Netlify.
// This variable MUST be set on your Netlify project settings for this to work.
const SECRET_CSV_URL = process.env.GOOGLE_SHEETS_CSV_URL; 

exports.handler = async (event, context) => {
    if (!SECRET_CSV_URL) {
        console.error("GOOGLE_SHEETS_CSV_URL environment variable is not set.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: Data source URL missing.' })
        };
    }

    try {
        // Fetch data using the secret URL on the server side
        const response = await fetch(SECRET_CSV_URL);
        
        if (!response.ok) {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Failed to fetch data from source: ${response.statusText}` })
            };
        }
        
        const csvText = await response.text();

        // Return the raw CSV text to the client
        return {
            statusCode: 200,
            // Allow client-side JavaScript to read the response (CORS)
            headers: {
                'Content-Type': 'text/plain', 
                'Access-Control-Allow-Origin': '*' 
            },
            body: csvText
        };
    } catch (error) {
        console.error("Serverless Function Execution Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error during data retrieval.' })
        };
    }
};