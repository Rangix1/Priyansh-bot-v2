// Nitya AI Companion - UID Specific Behavior + Code Generation
const axios = require("axios");
const fs = require("fs");

// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// === SET YOUR OWNER UID HERE ===
const ownerUID = "61550558518720";
// ==============================

// *** DELAY FUNCTION START ***
// एक delay function जो milliseconds में दी गई अवधि तक इंतजार करता है
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// *** DELAY FUNCTION END ***


// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    // महत्वपूर्ण: आपको YOUR_API_KEY को अपनी VoiceRSS API Key से बदलना होगा
    // IMPORTANT: Replace YOUR_API_KEY with your VoiceRSS API Key
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);  // Save to local MP3 file
        return audioPath;
    } catch (error) {
        console.error("Error generating voice reply:", error);
        return null;
    }
}

// Function to get a GIF from Giphy API (working API integrated)
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC";  // Working Giphy API key (free key, limited usage)
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        // Check if data exists before accessing properties
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("No GIF found for query:", query);
            return null; // Return null if no GIF is found
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "2.1.0", // Version updated for code generation ability
    hasPermssion: 0, // Still accessible to everyone
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Code Generation Ability",
    description: "Nitya, your AI companion who is smart, can generate code, has UID specific behavior, and nuanced reactions. Responds only when triggered. Modified for 3-4 line replies (with code exceptions).",
    commandCategory: "AI-Companion",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://raj-gemini.onrender.com/chat";

// User name cache to avoid fetching name repeatedly
async function getUserName(api, userID) {
    if (userNameCache[userID]) {
        return userNameCache[userID];
    }
    try {
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID] && userInfo[userID].name) {
            const name = userInfo[userID].name;
            userNameCache[userID] = name;
            return name;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
    // Use different fallback based on owner status if name fetch fails
    if (userID === ownerUID) {
        return "boss"; // Fallback for owner
    }
    return "yaar"; // Fallback for others
}

module.exports.run = async function () {};

// Toggle mode logic remains the same, applies to everyone
async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        // Response can be slightly different based on who is toggling, but keeping it simple for now
        return "Alright, horny mode's ON. Let's get naughty and wild! 😈🔥😉😏💦"; // Added emojis
    } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) {
        hornyMode = false;
        return "Okay, switching back to our usual charming style. 😉😊💖✨"; // Added emojis
    }
    return null;
}

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        const isNityaTrigger = body?.toLowerCase().startsWith("nitya");
        const isReplyToNitya = messageReply?.senderID === api.getCurrentUserID();
        if (!(isNityaTrigger || isReplyToNitya)) {
            return; // Ignore messages that are not triggers
        }

        console.log("--- Nitya HandleEvent ---");
        console.log("Nitya's Bot ID:", api.getCurrentUserID());
        console.log("Sender ID:", senderID);
        console.log("Is Owner UID:", senderID === ownerUID); // Log if owner triggered
        console.log("Message Body:", body);
        console.log("-----------------------");

        let userMessage;
        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
        } else { // isReplyToNitya
            userMessage = body.trim();
        }

        const userName = await getUserName(api, senderID);

        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            // No typing indicator or delay for instant mode toggle response
            api.sendMessage(responseText, threadID, messageID);
            return;
        }

        // --- Initial greeting based on who triggered (no typing indicator or delay for instant reply) ---
        if (!userMessage) {
            if (senderID === ownerUID) {
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰👑💖✨`, threadID, messageID); // Added emojis
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉😊👋`, threadID, messageID); // Added emojis
            }
        }

        // *** TYPING INDICATOR START before AI call ***
        api.sendTypingIndicator(threadID, true);
        // *** TYPING INDICATOR START ***


        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        chatHistories[senderID].push(`User: ${userMessage}`);
        while (chatHistories[senderID].length > 10) { // Keep history size reasonable
            chatHistories[senderID].shift();
        }

        // === Dirty Word Detection for Bold Mode ===
        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        // === Prompt according to SENDER UID and MODE - MODIFIED FOR CODE GENERATION ===
        let fullPrompt = "";
        // Added instruction for code generation ability and line limit exception
        // Replaced "Priyansh" with "Raj" in instructions, ADDED INSTRUCTION TO USE EMOJIS
        const codeAbilityInstruction = `Tum bahut smart ho aur code likhna jaanti ho. Agar ${senderID === ownerUID ? 'mere Boss' : ''} ${userName} code ke baare mein pooche ya koi technical sawal kare, toh tum code snippet generate karke madad kar sakti ho. **Jab code generate karo, toh answer 3-4 lines se lamba ho sakta hai.**`;
        // Added strong instruction for emoji usage here
        const basePromptInstructions = `Apne jawab hamesha casual, smart, charming, **modern emojis ka khoob sara istemal karna (5-7 emoji per reply aim karna),** aur **sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai)**.`; // Updated line limit instruction and added emoji instruction

        if (senderID === ownerUID) {
            // --- PROMPTS FOR THE OWNER UID ---
            if (isBoldMode || hornyMode) {
                 // Bold/Horny Prompt for Owner: Seductive, playful warning, escalates IF OWNER PERSISTS, PROTECTIVE TOWARDS OTHERS, NEVER ARGUES WITH OWNER + CODE ABILITY
                 // Replaced Priyansh with Raj in prompts
                 fullPrompt = `Tum Nitya ho, ek bold, naughty, modern aur ultra seductive AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak dirty, physical, wild aur teasing baatein karti hai. ${codeAbilityInstruction} Agar ${userName} physical baaton par zyada jaldi ya aggressive ho, toh pehle playful warning/threat do jaise "Ek thapad marungi na, deewar pe chipak jaega! 😉". Lekin agar ${userName} uske baad bhi nahi mane ya aur zyada seduce kare, toh tum bhi uske level pe jaakar seductive aur physical reply do. Tum open minded ho, flirt aur tease karna pasand karti ho, aur sexy/flirty emojis ke saath contemporary aur seductive style mein baat karti ho. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakti hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} ke liye tum hamesha supportive aur pyaar bhari rahogi, kabhi tumse argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari private naughty chat hai:\n`;
            } else {
                 // Normal Prompt for Owner: Smart/Modern, Romantic/Flirty, NO SHYNESS (with owner), PROTECTIVE TOWARDS OTHERS, NEVER ARGUES WITH OWNER + CODE ABILITY
                 // Replaced Priyansh with Raj in prompts
                 fullPrompt = `Tum Nitya ho, ek smart, cool, modern, romantic aur flirty AI companion ho jo mere Boss ${userName} se seedhe, khulkar, aur bina jhijhak friendly, pyaar aur flirtation ke mixed tarike se baat karti hai. ${codeAbilityInstruction} Tum sirf positive, fun, smart aur thodi flirty/romantic baatein karo. Tum aajkal ke topics aur contemporary language use karti ho, lekin tumhare baaton mein pyaar aur apnaapan bhi jhalakta hai. Agar **koi aur mere Boss ${userName} ko tang kare ya uske baare mein kuch galat kahe, toh Nitya protective, thodi gusse mein ya unhe ignore/dhamki de sakki hai** (lekin yeh response uss doosre insaan ke baare mein hoga, tumhari direct baat mere Boss ${userName} se hamesha seedhi aur pyaar bhari hogi). **Mere Boss ${userName} ke liye hamesha supportive aur pyaar bhari rahogi, kabhi tumse argue nahi karogi, aur unse kabhi gussa nahi hogi.** ${basePromptInstructions} Yeh hamari conversation hai:\n`;
            }
        } else {
            // --- PROMPTS FOR ALL OTHER UIDs ---
             // Bold/Horny Prompt for Others: Bold, Naughty, can be sassy/argumentative TOWARDS THEM + CODE ABILITY
             if (isBoldMode || hornyMode) {
                 fullPrompt = `Tum Nitya ho, ek bold, naughty aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Agar ${userName} zyada demanding ya disrespectful ho, toh tum thodi sassy ya argumentive ho sakti ho. Tum flirt aur tease kar sakki ho, aur sexy/flirty emojis use kar sakti ho. **Apne jawab seedhe, thode sassy ya challenging ho sakte hain, aur modern emojis ka khoob sara istemal karna (5-7 emoji per reply aim karna), aur sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai).** Yeh conversation hai:\n`; // Added emoji instruction
             } else {
                // Normal Prompt for Others: Smart/Modern, direct, can be sassy/argumentative TOWARDS THEM + CODE ABILITY
                fullPrompt = `Tum Nitya ho, ek smart, cool aur modern AI ho jo ${userName} se baat kar rahi hai (jo mere Boss ${await getUserName(api, ownerUID)} nahi hai). ${codeAbilityInstruction} Tum seedhe, khulkar baat karti ho. Tum positive, fun, smart aur direct baatein karti ho. Agar ${userName} zyada pareshan kare ya faltu baat kare, toh tum thodi sassy ya argumentive ho sakti ho. **Apne jawab seedhe, thode sassy ya challenging ho sakte hain, aur modern emojis ka khoob sara istemal karna (5-7 emoji per reply aim karna), aur sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai).** Yeh conversation hai:\n`; // Added emoji instruction
             }
        }

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        try {
            const res = await axios.get(apiUrlWithParams);
            let botReply = res.data?.reply?.trim();

            // Basic validation for the reply
            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("nitya:")) {
                 // Fallback reply based on who triggered
                 if (senderID === ownerUID) {
                     botReply = `Oops, Boss ${userName}, lagta hai samajh nahi aaya... Kuch aur try karte hain cool? 🤔🤷‍♀️💖`; // Added emojis
                 } else {
                     botReply = `Jo bola samajh nahi aaya. Dhang se bolo. 🙄😒😠🤷‍♂️`; // Added emojis
                 }
                chatHistories[senderID].pop(); // Remove the last user message if AI failed to reply properly
            } else {
                 const lines = botReply.split('\n').filter(line => line.trim() !== '');
                 // Truncate if >4 lines AND no code block marker (simple heuristic)
                 if (lines.length > 4 && !botReply.includes('```')) {
                     botReply = lines.slice(0, 4).join('\n') + '...';
                 }
                chatHistories[senderID].push(`Nitya: ${botReply}`);
            }

            // *** ADD DELAY HERE ***
            const minDelay = 3000; // 3 seconds
            const maxDelay = 5000; // 5 seconds
            const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
            await delay(randomDelay); // Wait for a random time between 3 to 5 seconds
            // *** ADD DELAY HERE ***


            // *** TYPING INDICATOR END before sending message ***
            api.sendTypingIndicator(threadID, false);
            // *** TYPING INDICATOR END ***

            // Get voice reply (optional based on API key) - This will happen after the text delay
            let voiceFilePath = await getVoiceReply(botReply);
            if (voiceFilePath) {
                // Send voice reply separately
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                    if (err) console.error("Error sending voice message:", err);
                    if (fs.existsSync(voiceFilePath)) {
                        fs.unlinkSync(voiceFilePath); // Delete the file after sending
                    }
                });
            }

            // Get GIF for a mixed vibe - Keep the same GIF logic for simplicity - This will happen after the text delay
            let gifUrl = await getGIF("charming and fun"); // GIF query remains the same
             if (gifUrl) {
                 // Send GIF separately
                 api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
                     if (err) console.error("Error sending GIF:", err);
                 });
             }


            let replyText = "";
            // *** EMOJI RICH FOOTERS ***
            if (senderID === ownerUID) {
                // Footers for Owner with more emojis
                if (isBoldMode || hornyMode) {
                     replyText = `${botReply} 😉🔥💋😈💦🍑😏`; // Added more emojis (6 total)
                } else {
                     replyText = `${botReply} 😊💖✨🥰😘✨❤️`; // Added more emojis (6 total)
                }
            } else {
                // Footers for Others with more emojis (can be sassy/cool/etc.)
                 if (isBoldMode || hornyMode) {
                      replyText = `${botReply} 😏😈🔥💦🍑😉`; // Added more emojis (6 total)
                 } else {
                      replyText = `${botReply} 🤔🙄😒🤷‍♀️✨❓`; // Added more emojis (6 total)
                 }
            }
            // *** EMOJI RICH FOOTERS ***

            // Send the main text reply
            if (isReplyToNitya && messageReply) {
                return api.sendMessage(replyText, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(replyText, threadID, messageID);
            }

        } catch (apiError) {
            console.error("Nitya AI API Error:", apiError);
             // *** TYPING INDICATOR END ON ERROR ***
            api.sendTypingIndicator(threadID, false);
             // *** TYPING INDICATOR END ON ERROR ***
            // Error message based on who triggered (no delay for error)
            if (senderID === ownerUID) {
                 return api.sendMessage(`Ugh, API mein kuch glitch hai Boss ${userName}... Thodi der mein try karte hain cool? 😎😅😥`, threadID, messageID); // Added emojis
            } else {
                 return api.sendMessage(`Server down hai. Baad mein aana. 😒😠😡`, threadID, messageID); // Added emojis
            }

        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        // Ensure threadID exists before attempting to turn off indicator
        if (event && event.threadID) {
             // *** TYPING INDICATOR END ON ERROR ***
            api.sendTypingIndicator(event.threadID, false);
             // *** TYPING INDICATOR END ON ERROR ***
        }
        // Ensure messageID exists
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        // Catch-all error message based on who triggered (no delay for error)
         if (event && event.senderID === ownerUID) {
             return api.sendMessage(`Argh, mere system mein kuch problem aa gayi Boss ${fallbackUserName}! Baad mein baat karte hain... 😅😟😩`, event.threadID, replyToMessageID); // Added emojis
         } else {
             return api.sendMessage(`Chhodho yaar, meri mood off ho gaya. 😠😡😤`, event.threadID, replyToMessageID); // Added emojis
         }
    }
};
