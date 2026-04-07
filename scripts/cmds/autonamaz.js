const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autonamaz",
  version: "2.5",
  role: 0,
  author: "Farhan-Khan",
  description: "🕌 প্রতিদিনের নামাজের জন্য auto scheduler ও backup logging সহ",
  category: "Islam",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  const videoURL = "https://files.catbox.moe/gr8zqw.mp4";
  const cacheDir = path.join(__dirname, "cache");
  const videoPath = path.join(cacheDir, "namazvideo.mp4");
  const logFile = path.join(cacheDir, "namaz_log.txt");

  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // ভিডিও ডাউনলোড
  if (!fs.existsSync(videoPath)) {
    try {
      const res = await axios.get(videoURL, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(res.data));
      console.log("📥 Video downloaded successfully");
    } catch (err) {
      console.error("❌ Video download failed:", err);
    }
  }

  console.log("✅ AutoNamaz Full Scheduler Loaded...");

  // Helper: log write
  const writeLog = (message) => {
    const time = moment().tz("Asia/Dhaka").format("DD-MM-YYYY HH:mm:ss");
    fs.appendFileSync(logFile, `[${time}] ${message}\n`);
  };

  const namazMapping = {
    "Fajr": "🌅 ফজরের নামাজের সময়! উঠো ও নামাজ আদায় করো।",
    "Dhuhr": "☀️ যোহরের নামাজের সময়! নামাজ আদায় করো।",
    "Asr": "🌤️ আসরের নামাজের সময়! নামাজ আদায় করো।",
    "Maghrib": "🌇 মাগরিবের নামাজের সময়! নামাজ আদায় করো।",
    "Isha": "🌙 এশার নামাজের সময়! নামাজ আদায় করো।"
  };

  // API থেকে আজকের নামাজের সময় নেওয়া
  const getNamazTimes = async () => {
    try {
      const res = await axios.get(
        "https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2"
      );
      if (!res.data?.data?.timings) {
        writeLog("❌ API থেকে timings পাওয়া যায়নি");
        return null;
      }
      return res.data.data.timings;
    } catch (err) {
      writeLog(`❌ API request failed: ${err.message}`);
      return null;
    }
  };

  // নামাজের জন্য scheduler
  const scheduleNamaz = async () => {
    const namazTimes = await getNamazTimes();
    if (!namazTimes) return;

    const now = moment().tz("Asia/Dhaka");

    for (const key of Object.keys(namazMapping)) {
      const apiTime = namazTimes[key];
      if (!apiTime) continue;

      const [hour, minute] = moment(apiTime, ["HH:mm", "HH:mm:ss"]).format("HH:mm").split(":").map(Number);
      let namazTime = moment().tz("Asia/Dhaka").hour(hour).minute(minute).second(0);

      // পেরিয়ে গেলে ignore
      if (namazTime.isBefore(now)) continue;

      const delay = namazTime.diff(now);

      setTimeout(async () => {
        const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
        const msg = 
`◢◤━━━━━━━━━━━━━━━━◥◣
🕒 সময়: ${moment().tz("Asia/Dhaka").format("HH:mm")}
${namazMapping[key]}
◥◣━━━━━━━━━━━━━━━━◢◤
📅 তারিখ: ${todayDate}
━━━━━━━━━━━━━━━━━━━━
ʙᴏᴛ ᴏᴡɴᴇʀ: ─꯭─⃝͎̽𓆩𝐒𝐢𝐲𝐚𝐦 𝐇𝐚𝐬𝐚𝐧 ‣᭄𓆪_
━━━━━━━━━━━━━━━━━━━━`;

        try {
          const allThreads = await api.getThreadList(1000, null, ["INBOX"]);
          const groups = allThreads.filter(t => t.isGroup);

          if (groups.length === 0) {
            writeLog(`⚠️ কোনো গ্রুপ পাওয়া যায়নি: ${key}`);
            return;
          }

          await Promise.all(
            groups.map(thread =>
              api.sendMessage({
                body: msg,
                attachment: fs.createReadStream(videoPath)
              }, thread.threadID)
            )
          );

          writeLog(`✅ নামাজ রিমাইন্ডার পাঠানো হয়েছে: ${key}`);
        } catch (e) {
          writeLog(`❌ Bot API Error for ${key}: ${e.message}`);
        }
      }, delay);
    }
  };

  // আজকের জন্য scheduler
  scheduleNamaz();

  // আগামী দিনের জন্য auto-reset
  const scheduleNextDay = () => {
    const now = moment().tz("Asia/Dhaka");
    const tomorrow = moment().tz("Asia/Dhaka").add(1, "day").startOf("day");
    const msUntilTomorrow = tomorrow.diff(now);

    setTimeout(function dailyReset() {
      scheduleNamaz(); // নতুন দিনের scheduler
      scheduleNextDay(); // পুনরায় setTimeout
    }, msUntilTomorrow);
  };

  scheduleNextDay();
};

module.exports.onStart = () => {};
