const express = require("express");
const axios = require("axios");
const redis = require("redis");
const app = express();
const port = 4000;
const client = redis.createClient(6379);
client.on("error", (error) => {
  console.error(error);
});
app.get("/data", async (req, res) => {
  try {
    console.log("In Get");
    let key = client.keys("Products");
    console.log(`Key = ${key}`);
    if (key) {
      // get data from the cache
      client.get("Products", async (error, data) => {
        if (data) {
          console.log("====================================");
          console.log(`Data from Cache`);
          console.log("====================================");
          return res.status(200).send({
            error: false,
            message: `Data for Products from the cache`,
            data: JSON.parse(data),
          });
        } else {
          

          const recipe = await axios.get(
            `https://apiapptrainingnewapp.azurewebsites.net/api/Products`
          );
          console.log(`In Else`);

          client.setex("Products", 1020, JSON.stringify(recipe.data));
          return res.status(200).send({
            error: false,
            message: `Data for Products from the server`,
            data: recipe.data,
          });
        }
      });
    } 
    
  } catch (e) {
    console.log("====================================");
    console.log(`In Catch Error Occured ${e}`);
    console.log("====================================");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
