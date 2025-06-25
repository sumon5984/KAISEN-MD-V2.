const { plugin } = require('../lib');


plugin({
  pattern: 'tagall ?(.*)',
  type: 'group',
  fromMe: false, // allow others too
  onlyGroup: true,
  desc: 'Tag all group members with custom style',
}, async (m, text) => {
  try {
    const conn = m.client;
    const from = m.from;

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants;
    const groupName = groupMetadata.subject || "Unknown Group";

    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const senderJid = m.participant || m.sender;

    const adminIds = participants
      .filter(p => p.admin !== null)
      .map(p => p.id);

    const isSenderAdmin = adminIds.includes(senderJid);
    const isBotAdmin = adminIds.includes(botJid);

    // Debug
    console.log('Sender:', senderJid);
    console.log('Bot:', botJid);
    console.log('Admins:', adminIds);

    if (!m.fromMe && !isSenderAdmin) {
      return m.reply('❌ Only group admins or bot owner can use this command.');
    }

    const msgText = text?.trim() || "ATTENTION EVERYONE";
    const emojis = ['⚡', '✨', '🎖️', '💎', '🔱', '💗', '❤‍🩹', '👻', '🌟', '🪄', '🎋', '🪼', '🍿', '👀', '👑', '🦋', '🐋', '🌻', '🌸', '🔥', '🍉', '🍧', '🍨', '🍦', '🧃', '🪀', '🎾', '🪇', '🎲', '🎡', '🧸', '🎀', '🎈', '🩵', '♥️', '🚩', '🏳️‍🌈', '🔪', '🎏', '🫐', '🍓', '🍇', '🐍', '🪻', '🪸', '💀'];
    const getEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    let tagText = `*▢ GROUP : ${groupName}*\n*▢ MESSAGE : ${msgText}*\n\n*╭┈─「 ɦเ αℓℓ ƒɾเεɳ∂ร 🥰 」┈❍*\n`;

    for (const p of participants) {
      tagText += `*│${getEmoji()} ᩧ𝆺ྀི𝅥* @${p.id.split('@')[0]}\n`;
    }

    tagText += '*╰────────────❍*';

    const mentions = participants.map(p => p.id);

    await conn.sendMessage(from, {
      text: tagText,
      mentions,
    }, { quoted: m });

  } catch (err) {
    console.error('tagall error:', err);
    m.reply('❌ An error occurred while tagging members.');
  }
});