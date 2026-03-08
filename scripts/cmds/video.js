const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    version: "2.2.2",
    author: "Milon Pro",
    countDown: 5,
    role: 0,
    shortDescription: "Search & download YouTube videos",
    longDescription: "Search YouTube videos by name and download without prefix",
    category: "media",
    guide: {
      en: "video <video name>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, body } = event;
    const creatorName = "Milon Islam";

    let query = args.join(" ");
    
    // Handling No-prefix input
    if (!query && body) {
      query = body.replace(/^video\s+/i, "").trim();
    }

    // Your requested English error message and example
    if (!query || query.toLowerCase() === "video") {
      return api.sendMessage(
        `❌ Please provide a song name.\n📌 Example: video Let Me Love You`,
        threadID,
        messageID
      );
    }

    let tempMsgID = null;

    try {
      const searching = await api.sendMessage(
        `🔍 Searching\n━━━━━━━━━━━━━━━\n📌 Query: ${query}\n⏳ Please wait...`,
        threadID
      );
      tempMsgID = searching.messageID;

      // Searching using BetaDash API
      const searchRes = await axios.get(
        `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`
      );

      const video = searchRes.data?.[0];
      if (!video || !video.url) throw new Error("No results found.");

      await api.unsendMessage(tempMsgID).catch(() => {});

      const downloading = await api.sendMessage(
        `🎬 Video Found\n━━━━━━━━━━━━━━━\n📖 Title: ${video.title}\n⬇️ Downloading...`,
        threadID
      );
      tempMsgID = downloading.messageID;

      // Getting download link using Imran API
      const dlRes = await axios.get(
        `https://yt-api-imran.vercel.app/api?url=${video.url}`
      );

      const downloadUrl = dlRes.data?.downloadUrl;
      if (!downloadUrl) throw new Error("Download link not available.");

      // Fetching the video buffer
      const buffer = (
        await axios.get(downloadUrl, { responseType: "arraybuffer" })
      ).data;

      const cacheDir = path.join(process.cwd(), "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
      await fs.writeFile(filePath, buffer);

      const finalMessage = {
        body:
          `━━━━━━━━━━━━━━━━━━\n` +
          `🎬 VIDEO READY\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📖 Title: ${video.title}\n` +
          `⏱ Duration: ${video.time}\n` +
          `🖌️ Power by: ${creatorName}\n` +
          `━━━━━━━━━━━━━━━━━━`,
        attachment: fs.createReadStream(filePath)
      };

      await api.sendMessage(finalMessage, threadID, async () => {
        if (fs.existsSync(filePath)) await fs.unlink(filePath);
      }, messageID);

      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});

    } catch (err) {
      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});
      api.sendMessage(
        `❌ Failed\n━━━━━━━━━━━━━━━\n${err.message || "An unexpected error occurred."}`,
        threadID,
        messageID
      );
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
