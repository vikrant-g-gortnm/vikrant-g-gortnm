require("dotenv").config();

module.exports = {
  client: {
    service: {
      name: process.env.APPSYNC_API_NAME,
      url: process.env.APPSYNC_URL,
      headers: {
        "x-api-key": process.env.APPSYNC_API_KEY
      }
    }
  }
};
