
const {
  plugin,
  commands,
  mode
} = require('../lib');

const { BOT_INFO, MENU_FONT } = require("../config");
const { version } = require('../package.json');
const { fancy, readMore, isUrls } = require("../lib/extra");

plugin({
  pattern: 'menu',
  desc: 'Displays bot command list',
  react: "👀",
  type: 'whatsapp',
  fromMe: mode
}, async (message, match) => {
  const owner = BOT_INFO.split(';')[1];
  const botName = BOT_INFO.split(';')[0];
  let url = BOT_INFO.split(';')[2];

  const botFancy = await fancy(botName, 4); // Anime style

  let menu = `╭─〔* ${botFancy} *〕─⊰
┃💖 *Owner:* ${owner}
┃🔮 *User:* ${message.pushName.replace(/[\r\n]+/gm, "")}
┃🍓 *Commands:* ${commands.length}
┃⚙️ *Version:* v${version}
╰⊹──────────────────⊱

${await readMore()}
🍒 *Command Categories:*\n`;

  let cmnd = [], category = [];

  for (const command of commands) {
    const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğöç1234567890]*)/)?.[2];
    if (!command.dontAddCommandList && cmd) {
      const type = (command.type || "misc").toUpperCase();
      cmnd.push({ cmd, type });
      if (!category.includes(type)) category.push(type);
    }
  }

  // Emoji list
  let emojis = ['⚡', '✨', '🎖️', '💎', '💗', '❤‍🩹', '👻', '🌟', '🪄', '🎋', '🪼', '🍿', '👀', '👑', '🦋', '🐋', '🌻', '🌸', '🔥', '🍉', '🍧', '🍨', '🪀', '🎾', '🪇', '🎲', '🎡', '🧸', '🎀', '🎈', '🩵', '♥️', '🚩', '🏳️‍🌈', '🔪', '🎏', '🫐', '🍓', '🪸', '💀'];
  const getEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
  const emoji = getEmoji();

  const [typFont, ptrnFont] = MENU_FONT.split(';').map(f => isNaN(f) || parseInt(f) > 35 ? null : f);
  cmnd.sort();

  for (const cat of category.sort()) {
    const typ = typFont && typFont !== '0'
      ? await fancy(cat, parseInt(typFont))
      : `🌟 ${cat}`;

    menu += `\n${emoji} *${typ}*\n`;

    for (const { cmd, type } of cmnd.filter(c => c.type === cat)) {
      const styled = ptrnFont && ptrnFont !== '0'
        ? await fancy(cmd.trim(), parseInt(ptrnFont))
        : `${cmd}`;
      menu += ` ${styled}\n`;
    }
  }

  menu += `\n🩷 Made with `;


  const isGif = BOT_INFO.includes('&gif');
  url = url.replace(/&gif/g, '');

  try {
    if (isUrls(url)) {
      if (isGif) {
     
        await message.client.sendMessage(message.jid, {
          video: { url },
          gifPlayback: true,
          caption: menu
        }, { quoted: message });
      } else {

        await message.client.sendMessage(message.jid, {
          image: { url },
          caption: menu
        }, { quoted: message });
      }
    } else {
      await message.send(menu);
    }
  } catch (e) {
    console.error("menu image error", e);
    await message.send(menu + `\n\n⚠️ *Image load failed, sending text only.*`);
  }
});