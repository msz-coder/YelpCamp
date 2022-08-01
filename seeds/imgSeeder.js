const axios = require("axios");
const seedImg = async () => {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "w5zi24wcMD3ja5hJPFn6-_JPtfjxPh2Lc_zIP8Aw32o",
        collections: 9046579,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
};

module.exports.seedImg = seedImg;
