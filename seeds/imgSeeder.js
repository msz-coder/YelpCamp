const axios = require("axios");
const seedImg = async () => {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "xGPoaMW0zsa0_TrAlSDqF3l5Qg_gIUZYgUDxnMUKU1g",
        collections: 9046579,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
};

module.exports.seedImg = seedImg;
