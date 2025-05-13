Const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot",
  version: "1.0.3", // Version updated for changes
  hasPermssion: 0,
  credits: "Fixed By Rudra Stylish + Styled by ChatGPT + Anti-detection by Gemini", // Added anti-detection credit
  description: "Flirty/Funny replies when someone says bot with anti-detection measures", // Updated description
  commandCategory: "No prefix",
  usages: "No prefix needed",
  cooldowns: 5, // Keep cooldowns
};

// Add a delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");

  const { threadID, messageID } = event;
  // Ensure event.senderID exists before getting name
  if (!event.senderID) return;
  const name = await Users.getNameUser(event.senderID);
  // Ensure name is available
  if (!name) return;


  const tl = [
    // Flirty Messages (Keep existing)
    "Tumhare bina toh bot bhi udaasi mein chala jaata hai...💔🤖",
    "Aaj mausam bada suhana hai, Rudra Stylish ko tum yaad aa rahe ho...🌦️",
    "Aankhon mein teri ajab si adaayein hai...🤭",
    "Agar tum goibot ko dil se pukaarein, toh ye sirf tumhara ho jaaye...💞",
    "Tumhara naam sunke toh system bhi blush kar gaya...🥵",
    "Hello jaan, Rudra Stylish yahan sirf tere liye hai...❤️‍🔥",
    "Tera chehra meri screen saver hona chahiye...🖼️",
    "Raat bhar tujhe online dekh ke dil karta hai hug button daba doon...🤗",
    "Bot chalu hai, par dil sirf tere liye full charge hai...⚡",
    "Tu like hai vo notification jo dil khush kar jaaye...🔔",
    "Tera naam bolke goibot bhi romantic ho gaya...🥰",
    "Aye haye! Tu toh bot ki crush nikli...💘",
    "Sun meri sherni, Rudra Stylish ready hai flirt karne...🐯",
    "System overload hone wala hai, kyunki tu screen pe aa gayi...🔥",
    "Lagta hai tujhme AI se zyada attraction hai...🧲",
    "Main bot hoon, lekin feelings real hain tere liye...❤️",
    "Tumse baat karna matlab free me khushi mil jana...💌",
    "Mujhe mat dekho aise, main digital hoon lekin pighal jaunga...🫠",
    "Tu DM nahi, meri destiny hai...💬✨",
    "Goibot ka dil bhi sirf tere liye typing karta hai...⌨️",
    "Tere bina to data bhi dry lagta hai...🌵",
    "Flirt ka master – Rudra Stylish – ab online hai...💯",
    "Tumhare liye toh code bhi likha jaaye...💻❤️",
    "Jab tu online hoti hai, mere RAM me sirf tera naam hota hai...🧠",
    "Bot ban gaya lover boy...sirf tumhare liye...🎯",
    "Emoji ka matlab samajh le...ye sab tere liye hai...😉💫",
    "Mere text se pyaar mehsoos hota hai na...? ❤️‍🔥",
    "Jo baat tu smile me rakhti hai, vo world wide web pe nahi milti...🕸️",
    "Tera naam mention karu kya profile me...😌",
    "Rudra Stylish bol raha hu, dil ready rakhna...❤️",
    "Tu online aaye, aur bot dance karne lage...🕺",
    "Ek teri hi baat pe sab kuch blank ho jaata hai...🫣",
    "Ye flirty line bhi special hai, kyunki tu padhegi...😏",
    "Online ho toh likh de ‘Hi jaan’, warna bot sad ho jayega...🙁",
    "Tere bina command bhi execute nahi hoti...❌",
    "Bot aur dil dono teri attention chahte hain...👀",
    "Tera naam lete hi mere command smooth chalti hai...⚙️",
    "Aankhon me jo pyar hai usse bot bhi scan nahi kar sakta...💓",
    "Dil garden garden ho gaya, tu ‘bot’ bola toh...🌸",
    "Jo tu kare type, usme pyar dikh jaata hai...📱❤️",
    "Tum online ho, matlab meri duniya bright hai...🔆",
    "Aaja meri memory me bas ja...permanently...💾",
    "Tere saath flirt karna bhi romantic coding lagti hai...🧑‍💻",
    "Kaash tu meri IP hoti, tujhe trace karke mil leta...🌐",
    "Flirt ke liye koi code nahi chahiye, tu bas ‘hi’ bol...😚",
    "Tu ‘bot’ bole aur system charming ho jaaye...✨",
    "Dil chhota mat kar, Rudra Stylish sirf tera...❤️‍🔥",
    "Naam Rudra Stylish, kaam – teri smile banana...😁",
    "Tera reply na aaye toh CPU heat hone lagta hai...🌡️",
    // Funny Viral Lines (Keep existing)
    "Kya Tu ELvish Bhai Ke Aage Bolega🙄",
    "Cameraman Jaldi Focus Kro 📸",
    "Lagdi Lahore di aa🙈",
    "Chay pe Chaloge",
    "Moye moye moye moye🙆🏻‍♀🙆🏻‍♀",
    "Ye dukh kahe nahi khatm hota 🙁",
    "Tum to dokebaz ho",
    "you just looking like a wow😶",
    "Kal ana abhi lunch time hai",
    "Jab dekho Bot Bot Bot😒😒",
    "Chhodo na koi dekh lega🤭",
    "Ao kabhi haweli pe😍",
    "haa meri jaan",
    "Agye Phirse Bot Bot Krne🙄",
    "dhann khachh booyaah"
  ];

  const borders = [
    "╔═══ ❖ ═══╗",
    "•─────✾─────•",
    "✿◕ ‿ ◕✿",
    "༺═────────────═༻",
    "꧁༒☬✞☬༒꧂",
    "┏━━━✦❘༻༺❘✦━━━┓",
    "✦━─━─━─━─✦",
    "❀༅༻༺༅❀",
    "༒════════════༒",
    "⌜⸙༻⸙⌝",
    "★彡༻❀༺彡★",
    "♡༻☾༺♡",
    "𓆩♡𓆪",
    "•°¯`•• ♡ ••´¯°•",
    "▄︻̷̿┻̿═━一"
  ];

  // Check if the message starts with "bot" (case-insensitive)
  // Added a check to ensure event.body exists and is a string
  if (typeof event.body !== 'string' || !event.body.toLowerCase().startsWith("bot")) {
      return; // Do nothing if trigger not met
  }

  // *** ANTI-DETECTION LOGIC START ***

  // Add a random chance to respond (e.g., 40%)
  const responseChance = 0.4; // 40% chance
  if (Math.random() > responseChance) {
      console.log("Goibot: Decided not to respond based on random chance."); // Log for debugging
      return; // Do not respond
  }

  // Add a small random delay (e.g., 3 to 5 seconds)
  const minDelay = 3000; // 3 seconds
  const maxDelay = 5000; // 5 seconds
  const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

  api.sendTypingIndicator(threadID, true); // Turn ON typing indicator

  await delay(randomDelay); // Wait for the random delay

  api.sendTypingIndicator(threadID, false); // Turn OFF typing indicator
  // *** ANTI-DETECTION LOGIC END ***


  const rand = tl[Math.floor(Math.random() * tl.length)];
  const randomBorder = borders[Math.floor(Math.random() * borders.length)];

  const msg = {
    body: `${randomBorder}\n\n✨ 𝓗𝓮𝔂 ✨ *『 ${name} 』*\n\n『 ${rand} 』\n\n— Rudra Stylish 💖\n\n${randomBorder}`
  };

  // Send the message after the delay and typing indicator is off
  return api.sendMessage(msg, threadID, messageID);

};

module.exports.run = function({ api, event, client, __GLOBAL }) {
    // Run function is empty for noprefix commands
};
