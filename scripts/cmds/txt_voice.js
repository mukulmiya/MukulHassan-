const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "txt_voice",
    version: "2.0.0",
    author: "SIYAM EDIT",
    countDown: 5,
    role: 0,
    shortDescription: "Text → Voice Reply",
    longDescription: "নির্দিষ্ট টেক্সটে আলাদা ভয়েস রিপ্লাই",
    category: "noprefix",
  },

  onChat: async function ({ event, message }) {
    const { body } = event;
    if (!body) return;

    // 🔥 Text অনুযায়ী Voice (Serial Style)
    const textAudioMap = {
      "সিয়াম": "https://files.catbox.moe/pjxs5g.mp4",
      "siyam": "https://files.catbox.moe/515rkv.mp4",
      "ওই": "https://files.catbox.moe/wmdaho.mp4",
      "@তো্ঁমা্ঁগো্ঁ পি্ঁচ্ছি্ঁ উ্ঁদয়্ঁ তা্ঁহ": "https://files.catbox.moe/khdlld.mp4",
      "সিয়াম ভাই": "https://files.catbox.moe/glp2f4.mp4"
    };

    const key = body.trim().toLowerCase();
    const audioUrl = textAudioMap[key];
    if (!audioUrl) return;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `${encodeURIComponent(key)}.mp4`);

    try {
      const response = await axios({
        method: "GET",
        url: audioUrl,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: "তোমার নাম", // 🔥 শুধু এইটা দিবে
          attachment: fs.createReadStream(filePath),
        });

        fs.unlink(filePath, (err) => {
          if (err) console.error(err);
        });
      });

      writer.on("error", (err) => {
        console.error(err);
        message.reply("ভয়েস প্লে হয়নি 😅");
      });

    } catch (error) {
      console.error(error);
      message.reply("ভয়েস প্লে হয়নি 😅");
    }
  },

  onStart: async function () {},
};
