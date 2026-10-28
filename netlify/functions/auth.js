const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' })
      };
    }

    // Read the portal-config.json file
    const configPath = process.env.PORTAL_CONFIG_PATH || path.resolve(__dirname, '../../portal-config.local.json');
    const rawData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(rawData);

    // Find the user
    const user = config.users.find(u => u.email === email && u.password === password);

    if (!user) {
      // Simulate slight delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' })
      };
    }

    // Successful login! Return the user's name and the reports.
    // We intentionally DO NOT return the users array to keep it secure.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Login successful',
        user: { name: user.name, email: user.email },
        reports: config.reports
      })
    };
  } catch (error) {
    console.error('Error during authentication:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};
