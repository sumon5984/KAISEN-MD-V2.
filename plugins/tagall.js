
const { plugin, isAdmin, isBotAdmin } = require('../lib');
const { getGroupMeta } = require('../lib/groupCache'); // Add this file separately below

plugin({
  pattern: 'tagall ?(.*)',
  type: 'group',
  fromMe: true, // false = allow group admins too
  onlyGroup: true,
  desc: 'Tag all group members with custom style',
}, async (m, text) => {
  try {
    const conn = m.client;
    const from = m.from;

    // Use safe metadata cache
    const groupInfo = await getGroupMeta(conn, from);
    if (!groupInfo) return m.reply("❌ Failed to fetch group information.");

    const participants = groupInfo.participants;
    const groupName = groupInfo.subject || "Unknown Group";
    const totalMembers = participants?.length || 0;
    if (totalMembers === 0) return m.reply("❌ No members found in this group.");

    if (!(await isBotAdmin(m))) return m.reply('❌ I must be an admin to tag everyone.');
    
    if (!(await isAdmin(m))) return m.reply('❌ You must be an admin to use this.');
    

    // Emojis list and random picker
    const emojis = ['⚡', '✨', '🎖️', '💎', '🔱', '💗', '❤‍🩹', '👻', '🌟', '🪄', '🎋', '🪼', '🍿', '👀', '👑', '🦋', '🐋', '🌻', '🌸', '🔥', '🍉', '🍧', '🍨', '🍦', '🧃', '🪀', '🎾', '🪇', '🎲', '🎡', '🧸', '🎀', '🎈', '🩵', '♥️', '🚩', '🏳️‍🌈', '🔪', '🎏', '🫐', '🍓', '🍇', '🐍', '🪻', '🪸', '💀'];
    const getEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    // Get message after command
    const msgText = text?.trim() || "ATTENTION EVERYONE";

    // Compose message
    let teks = `*▢ GROUP : ${groupName}*\n*▢ MEMBERS : ${totalMembers}*\n*▢ MESSAGE : ${msgText}*\n\n*╭┈─「 \`ɦเ αℓℓ ƒɾเεɳ∂ร 🥰\` 」┈❍*\n`;

    for (const mem of participants) {
      if (!mem.id) continue;
      teks += `*│${getEmoji()} ᩧ𝆺ྀི𝅥* @${mem.id.split('@')[0]}\n`;
    }

    teks += '*╰────────────❍*\n';

    const mentions = participants.map(p => p.id);

    await conn.sendMessage(from, {
      text: teks,
      mentions
    }, { quoted: m });

  } catch (err) {
    console.error('tagall error:', err);
    m.reply('❌ An error occurred while tagging members.');
  }
});