const {
	plugin,
	mode,
	getCompo,
	sleep,
	config
} = require('../lib');
const {
WA_DEFAULT_EPHEMERAL,
	downloadContentFromMessage,
jidNormalizedUser } = require('@whiskeysockets/baileys');


plugin({
        pattern: 'whois ?(.*)',
        fromMe: mode,
        type: 'info',
        desc: 'get user bio and image'
}, async (message, match) => {
                let user = (message.reply_message.sender || match).replace(/[^0-9]/g, '');
                if (!user) return message.send('😅 reply to message')
                user += '@s.whatsapp.net';
                try {
                        pp = await message.client.profilePictureUrl(user, 'image')
                } catch {
                        pp = 'https://i.imgur.com/b3hlzl5.jpg'
                }
                let status = await message.client.fetchStatus(user)
                const date = new Date(status.setAt);
                const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                };
                const setAt = date.toLocaleString('en-US', options);
                await message.send({
                        url: pp
                }, {
                        caption: `*Name :* ${await message.getName(user)}\n*About :* ${status.status}\n*About Set Date :* ${setAt}`,
                        quoted: message.data
                }, 'image')
})


plugin({
	pattern: 'jid',
	fromMe: mode,
	desc: 'get jid',
	react: "💯",
	type: "general"
}, async (message) => {
	if (message.reply_message.sender) {
		await message.send(message.reply_message.sender)
	} else {
		await message.send(message.from)
	}
});
plugin({
	pattern: 'block',
	desc: 'block a user',
	react: "😂",
	type: "owner",
	fromMe: true
}, async (message) => {
	if (message.isGroup) {
		await message.client.updateBlockStatus(message.reply_message.sender, "block") // Block user
	} else {
		await message.client.updateBlockStatus(message.from, "block")
	}
}); 
plugin({
	pattern: 'unblock',
	desc: 'unblock a person',
	react: "🥹",
	type: "owner",
	fromMe: true
}, async (message) => {
	if (message.isGroup) {
		await message.client.updateBlockStatus(message.reply_message.sender, "unblock") // Unblock user
	} else {
		await message.client.updateBlockStatus(message.from, "unblock") // Unblock user
	}
});

plugin({
    pattern: "pp",
  desc: "Change bot's profile picture (reply to image)",
  react: "😳",
  type: "owner",
  fromMe: true
}, async (message, match) => {
  try {
    const conn = message.client;
    const quoted = message.reply_message;

    if (!quoted || !quoted.imageMessage) {
      return await message.reply("😟 Please reply to an image message.");
    }

    // Download image
    const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Update bot profile picture
    await conn.query({
      tag: 'iq',
      attrs: {
        to: jidNormalizedUser(message.botNumber),
        type: 'set',
        xmlns: 'w:profile:picture'
      },
      content: [{
        tag: 'picture',
        attrs: { type: 'image' },
        content: buffer
      }]
    });

    return await message.reply("😊 Profile picture updated successfully.");
  } catch (err) {
    console.error("PP command error:", err);
    return await message.reply("🥲 An error occurred while updating profile picture.");
  }
});
plugin({
  pattern: "fullpp",
  desc: "Change bot's profile picture (reply to full image)",
  react: "😳",
  type: "owner",
  fromMe: true
}, async (message, match) => {
  try {
    const conn = message.client;
    const quoted = message.reply_message;

    if (!quoted || !quoted.imageMessage) {
      return await message.reply("😟 Please reply to a full image message.");
    }

    // Download the image as buffer
    const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Update full profile picture using raw XML request
    await conn.query({
      tag: 'iq',
      attrs: {
        to: jidNormalizedUser(message.botNumber),
        type: 'set',
        xmlns: 'w:profile:picture'
      },
      content: [{
        tag: 'picture',
        attrs: { type: 'image' },
        content: buffer
      }]
    });

    return await message.reply("✅ Full profile picture updated successfully.");
  } catch (err) {
    console.error("FullPP command error:", err);
    return await message.reply("🥲 An error occurred while updating full profile picture.");
  }
});


plugin({
	pattern: 'clear ?(.*)',
	fromMe: true,
	desc: 'delete whatsapp chat',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.chatModify({
		delete: true,
		lastMessages: [{
			key: message.data.key,
			messageTimestamp: message.messageTimestamp
		}]
	}, message.jid)
	await message.send('_Cleared_')
})

plugin({
	pattern: 'archive ?(.*)',
	fromMe: true,
	desc: 'archive whatsapp chat',
	type: 'whatsapp'
}, async (message, match) => {
	const lstMsg = {
		message: message.message,
		key: message.key,
		messageTimestamp: message.messageTimestamp
	};
	await message.client.chatModify({
		archive: true,
		lastMessages: [lstMsg]
	}, message.jid);
	await message.send('_Archived_')
})

plugin({
	pattern: 'unarchive ?(.*)',
	fromMe: true,
	desc: 'unarchive whatsapp chat',
	type: 'whatsapp'
}, async (message, match) => {
	const lstMsg = {
		message: message.message,
		key: message.key,
		messageTimestamp: message.messageTimestamp
	};
	await message.client.chatModify({
		archive: false,
		lastMessages: [lstMsg]
	}, message.jid);
	await message.send('_Unarchived_')
})

plugin({
	pattern: 'chatpin ?(.*)',
	fromMe: true,
	desc: 'pin a chat',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.chatModify({
		pin: true
	}, message.jid);
	await message.send('_Pined_')
})

plugin({
	pattern: 'unpin ?(.*)',
	fromMe: true,
	desc: 'unpin a msg',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.chatModify({
		pin: false
	}, message.jid);
	await message.send('_Unpined_')
})

plugin({
	pattern: 'setbio ?(.*)',
	fromMe: true,
	desc: 'To change your profile status',
	type: 'whatsapp'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.send('*Need Status!*\n*Example: setbio Hey there! I am using WhatsApp*.')
	await message.client.updateProfileStatus(match)
	await message.send('_Profile status updated_')
})

plugin({
	pattern: 'setname ?(.*)',
	fromMe: true,
	desc: 'To change your profile name',
	type: 'whatsapp'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.send('*Need Name!*\n*Example: setname your name*.')
	await message.client.updateProfileName(match)
	await message.send('_Profile name updated_')
})

plugin({
	pattern: 'disappear  ?(.*)',
	fromMe: true,
	desc: 'turn on default disappear messages',
	type: 'whatsapp'
}, async (message, match) => {
	await message.client.sendMessage(
		message.jid, {
			disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL
		}
	)
	await message.send('_disappearmessage activated_')
})

plugin({
	pattern: 'getprivacy ?(.*)',
	fromMe: true,
	desc: 'get your privacy settings',
	type: 'privacy'
}, async (message, match) => {
	const {
		readreceipts,
		profile,
		status,
		online,
		last,
		groupadd,
		calladd
	} = await message.client.fetchPrivacySettings(true);
	const msg = `*♺ my privacy*

*ᝄ name :* ${message.client.user.name}
*ᝄ online:* ${online}
*ᝄ profile :* ${profile}
*ᝄ last seen :* ${last}
*ᝄ read receipt :* ${readreceipts}
*ᝄ about seted time :*
*ᝄ group add settings :* ${groupadd}
*ᝄ call add settings :* ${calladd}`;
	let img;
	try {
		img = {
			url: await message.client.profilePictureUrl(message.user.jid, 'image')
		};
	} catch (e) {
		img = {
			url: "https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg"
		};
	}
	await message.send(img, {
		caption: msg
	}, 'image');
})
plugin({
	pattern: 'lastseen ?(.*)',
	fromMe: true,
	desc: 'to change lastseen privacy',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change last seen privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateLastSeenPrivacy(match)
	await message.send(`_Privacy settings *last seen* Updated to *${match}*_`);
})
plugin({
	pattern: 'online ?(.*)',
	fromMe: true,
	desc: 'to change online privacy',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change *online*  privacy settings_`);
	const available_privacy = ['all', 'match_last_seen'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateOnlinePrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
})
plugin({
	pattern: 'mypp ?(.*)',
	fromMe: true,
	desc: 'privacy setting profile picture',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change *profile picture*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateProfilePicturePrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
})
plugin({
	pattern: 'mystatus ?(.*)',
	fromMe: true,
	desc: 'privacy for my status',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change *status*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateStatusPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
})
plugin({
	pattern: 'read ?(.*)',
	fromMe: true,
	desc: 'privacy for read message',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change *read and receipts message*  privacy settings_`);
	const available_privacy = ['all', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateReadReceiptsPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
})
plugin({
	pattern: 'groupadd ?(.*)',
	fromMe: true,
	desc: 'privacy for group add',
	type: 'privacy'
}, async (message, match, cmd) => {
	if (!match) return await message.send(`_*Example:-* ${cmd} all_\n_to change *group add*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.client.updateGroupsAddPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
})
