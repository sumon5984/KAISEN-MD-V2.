const {
	plugin,
	isAdmin,
	isBotAdmin,
	linkPreview,
	config
} = require('../lib');
const { 
	downloadContentFromMessage,
	jidNormalizedUser
} = require('@whiskeysockets/baileys');


plugin({
	pattern: 'promote ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'promote group member'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (!message.send_message.sender) return message.send('_please reply to a user_', {
		linkPreview: linkPreview()
	})
	await message.client.groupParticipantsUpdate(message.jid,
		[message.send_message.sender], "promote");
	message.send(`_@${message.send_message.sender.split('@')[0]} promoted as admin successfully_`, {
		mentions: [message.send_message.sender],
		linkPreview: linkPreview()
	})
});
plugin({
    pattern: 'kick ?(.*)',
    type: 'group',
    fromMe: true,
    onlyGroup: true,
    desc: "Kick group member(s)"
}, async (message, match) => {
    if (!await isBotAdmin(message)) {
        return await message.send('_❌ Bot must be admin first!_', { linkPreview: linkPreview() });
    }

    const groupMetadata = await message.client.groupMetadata(message.jid).catch(e => {});
    if (!groupMetadata) return await message.send('_❌ Failed to fetch group info._');

    const participants = groupMetadata.participants || [];
    const admins = participants.filter(p => p.admin !== null).map(p => p.id);
    const botNumber = message.user;

    if (match.toLowerCase() === "all") {
        let kicked = 0, failed = 0;

        for (const p of participants) {
            const id = p.id;

            if (admins.includes(id) || id === botNumber) continue;

            try {
                await message.client.groupParticipantsUpdate(message.jid, [id], "remove");
                kicked++;
                await sleep(2000);
            } catch (e) {
                failed++;
                console.error(`❌ Failed to kick ${id}:`, e);
            }
        }

        return await message.send(`👥 Kick All Report:\n✅ Kicked: *${kicked}*\n❌ Failed: *${failed}*`);
    }

    let user = match || (message.quoted ? message.quoted.sender : null);
    if (!user) return await message.send('_❌ Please reply to a user or give number to kick._');

    user = user.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    if (user === botNumber) {
        return await message.send("_🤖 I can't kick myself!_");
    }

    if (admins.includes(user)) {
        return await message.send("_❌ Can't kick an admin!_");
    }

   try {
        await message.client.groupParticipantsUpdate(message.jid, [user], "remove");
        return await message.send(`👢 _@${user.split('@')[0]} has been kicked._`, {
            mentions: [user]
        });
    } catch (e) {
        console.error("Kick error:", e);
        return await message.send('_❌ Failed to kick user. Maybe already left or permission denied._');
    }
});
plugin({
	pattern: 'demote ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: "demote group member"
}, async (message, match) => {
	let admin = await isAdmin(message);
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (!message.send_message.sender) return message.send('_please reply to a user_', {
		linkPreview: linkPreview()
	});
	await message.client.groupParticipantsUpdate(message.jid,
		[message.send_message.sender], "demote");
	return await message.send(`_@${message.send_message.sender.split('@')[0]} demoted from admin successfully_`, {
		mentions: [message.send_message.sender],
		linkPreview: linkPreview()
	})
});


plugin({
	pattern: 'revoke ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'revoke group link'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	await message.client.groupRevokeInvite(message.jid);
	return await message.send('_successfully revoked group link_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'invite ?(.*)',
	type: 'group',
	onlyGroup: true,
	fromMe: true,
	desc: 'get group link'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	const code = await message.client.groupInviteCode(message.jid);
	return await message.send(`https://chat.whatsapp.com/${code}`, {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'lock ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'change group privacy to only admins edit'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	await message.client.groupSettingUpdate(message.jid, 'locked');
	return await message.send('_successfully changed group settings_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'mute ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'mute group'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	await message.client.groupSettingUpdate(message.jid, 'announcement');
	return await message.send('_group muted_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'unmute ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'unmute a group'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	await message.client.groupSettingUpdate(message.jid, 'not_announcement');
	return await message.send('_group unmuted_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'gdesc ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'update group description'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (message.text > 400) return await message.send('_can`t be updated_', {
		linkPreview: linkPreview()
	})
	let txt = match || ' ';
	await message.client.groupUpdateDescription(message.jid, txt);
	return await message.send('_updated successfully_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'unlock ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'chamge group privacy to members can edit'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	await message.client.groupSettingUpdate(message.jid, 'unlocked');
	return await message.send('_successfully changed group settings_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'left ?(.*)',
	type: 'group',
	onlyGroup: true,
	desc: 'left from group',
	fromMe: true
}, async (message, match) => {
	await message.client.groupLeave(message.jid)
});

plugin({
	pattern: 'gname ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'update group name'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (message.text > 75) return await message.send('_can`t be updated_', {
		linkPreview: linkPreview()
	})
	let txt = message.text || ' ';
	await message.client.groupUpdateSubject(message.jid, txt);
	return await message.send('_group name updated_', {
		linkPreview: linkPreview()
	})
});



plugin({
  pattern: 'gpp ?(.*)',
  type: 'group',
  fromMe: true,
  onlyGroup: true,
  desc: 'update group icon'
}, async (message, match) => {
  if (!await isBotAdmin(message)) {
    return await message.send('_bot must be admin first_');
  }

  if (!message.reply_message || !message.reply_message.imageMessage) {
    return await message.send('_Please reply to an image message_');
  }

  const media = message.reply_message.imageMessage;
  const stream = await downloadContentFromMessage(media, 'image');

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  // Upload the new profile picture
  await message.client.query({
    tag: 'iq',
    attrs: {
      to: jidNormalizedUser(message.jid),
      type: 'set',
      xmlns: 'w:profile:picture'
    },
    content: [{
      tag: 'picture',
      attrs: { type: 'image' },
      content: buffer
    }]
  });

  return await message.send('_Group profile updated_');
});

plugin({
	pattern: 'fullgpp ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: 'update group icon'
}, async (message, match) => {
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (!message.reply_message.image) return await message.send('_please reply to a image message_');
	await message.updateProfilePicture(message.jid, await message.reply_message.download());
	return message.send('_profile photo updated_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'join ?(.*)',
	type: 'owner',
	fromMe: true,
	desc: 'join a group using group link'
}, async (message, match) => {
	if (!match || !match.match(/^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]/)) return await message.send('_invalid url_', {
		linkPreview: linkPreview()
	});
	let urlArray = (match).trim().split('/');
	if (!urlArray[2] == 'chat.whatsapp.com') return await message.send('_url must be a whatsapp group link_', {
		linkPreview: linkPreview()
	})
	const response = await message.client.groupAcceptInvite(urlArray[3]);
	return await message.send('_successfully joind_', {
		linkPreview: linkPreview()
	})
});

plugin({
	pattern: 'add ?(.*)',
	type: 'group',
	fromMe: true,
	onlyGroup: true,
	desc: "add member's to group"
}, async (message, match) => {
	match = message.send_message.sender || match;
	if (!match) return await message.send('_please reply to a user_');
	match = match.replaceAll(' ', '');
	if (!await isBotAdmin(message)) return await message.send('_bot must be admin first_', {
		linkPreview: linkPreview()
	})
	if (match) {
		let users = match.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
		let info = await message.client.onWhatsApp(users);
		ex = info.map((jid) => jid.jid);
		if (!ex.includes(users)) return await message.send('user not in whatsapp');
		const su = await message.client.groupParticipantsUpdate(message.jid,
			[users], "add");
		if (su[0].status == 403) {
			await message.send('_Couldn\'t add. Invite sent!_');
			return await message.sendGroupInviteMessage(users);
		} else if (su[0].status == 408) {
			await message.send("Couldn\'t add because they left the group recently. Try again later.", {
				linkPreview: linkPreview()
			})
			const code = await message.client.groupInviteCode(message.jid);
			return await message.client.sendMessage(users, {
				text: `https://chat.whatsapp.com/${code}`
			})
		} else if (su[0].status == 401) {
			await message.send('Couldn\'t add because they blocked the bot number.', {
				linkPreview: linkPreview()
			})
		} else if (su[0].status == 200) {
			return await message.send(`@${users.split('@')[0]} Added to the group.`, {
				mentions: [users],
				linkPreview: linkPreview()
			})
		} else if (su[0].status == 409) {
			return await message.send("Already in the group.", {
				mentions: [users],
				linkPreview: linkPreview()
			})
		} else {
			return await message.send(su);
		}
	}
});

plugin({
	pattern: 'ginfo ?(.*)',
	fromMe: true,
	desc: 'Shows group invite info',
	type: 'group'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('*Need Group Link*\n_Example : ginfo group link_')
	const [link, invite] = match.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i) || []
	if (!invite) return await message.reply('*Invalid invite link*')
	try {
		const response = await message.client.groupGetInviteInfo(invite)
		await message.send("id: " + response.id + "\nsubject: " + response.subject + "\nowner: " + `${response.owner ? response.owner.split('@')[0] : 'unknown'}` + "\nsize: " + response.size + "\nrestrict: " + response.restrict + "\nannounce: " + response.announce + "\ncreation: " + require('moment-timezone')(response.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') + "\ndesc" + response.desc)
	} catch (error) {
		await message.reply('*Invalid invite link*')
	}
})