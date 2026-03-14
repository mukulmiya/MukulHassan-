const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(
		process.env.NODE_ENV == "development"
			? "./handlerEvents.dev.js"
			: "./handlerEvents.js"
	)(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	// --- [ HELP FUNCTION: GET ALL COMMANDS ] ---
	const getAllCommandNames = () => {
		const commandNames = [];
		for (const cmd of global.GoatBot.commands.values()) {
			if (cmd.config && cmd.config.name) {
				commandNames.push(cmd.config.name.toLowerCase());
				if (cmd.config.aliases && Array.isArray(cmd.config.aliases)) {
					commandNames.push(...cmd.config.aliases.map(a => a.toLowerCase()));
				}
			}
		}
		return commandNames;
	};

	return async function (event) {
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		// --- [ START: FIXED NO PREFIX SYSTEM ] ---
		if (global.GoatBot.config.noPrefixMode && event.body && !event.body.startsWith(global.GoatBot.config.prefix)) {
			const commandNames = getAllCommandNames();
			const firstWord = event.body.trim().split(/\s+/)[0].toLowerCase();
			
			if (commandNames.includes(firstWord)) {
				event.body = global.GoatBot.config.prefix + event.body;
			}
		}
		// --- [ END: FIXED NO PREFIX SYSTEM ] ---

		const message = createFuncMessage(api, event);

		await handlerCheckDB(usersData, threadsData, event);
		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat) return;

		const {
			onAnyEvent, onFirstChat, onStart, onChat,
			onReply, onEvent, handlerEvent, onReaction,
			typ, presence, read_receipt
		} = handlerChat;

		onAnyEvent();

		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onFirstChat();
				onChat();
				onStart();
				onReply();
				break;

			case "event":
				handlerEvent();
				onEvent();
				break;

			case "message_reaction":
				onReaction();

				const isAdmin = global.GoatBot.config.adminBot.includes(event.userID);

				// অ্যাডমিন "👎" দিলে ইউজার রিমুভ হবে
				if (event.reaction === "👎" && isAdmin) {
					api.removeUserFromGroup(event.senderID, event.threadID, err => {
						if (err) console.log(err);
					});
				}

				// অ্যাডমিন রাগের ইমোজি দিলে মেসেজ আনসেন্ড হবে
				if (
					isAdmin &&
					(event.reaction === "😡" ||
					 event.reaction === "😠" ||
					 event.reaction === "😾")
				) {
					message.unsend(event.messageID);
				}
				break;

			case "typ":
				typ();
				break;

			case "presence":
				presence();
				break;

			case "read_receipt":
				read_receipt();
				break;

			default:
				break;
		}
	};
};
