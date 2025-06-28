
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



const { uptime } = require("os");

async function readMore() {
  const readmore = String.fromCharCode(8206).repeat(4001);
  return readmore;
};

const clockString = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    return hours + ":" + minutes + ":" + seconds;
};

plugin({
  pattern: 'menu',
  desc: 'Displays bot command list',
  react: "👀",
  type: 'whatsapp',
  fromMe: mode
}, async (message, match) => {
    let [date, time] = new Date().toLocaleString("en-IN", { timeZone: config.TIMEZONE }).split(",");
    let menu = `╭━━━〔 ${BOT_INFO.split(';')[0]} ⁩〕━━━···▸\n┃╭──────────────···▸\n✧│ *ᴏᴡɴᴇʀ :*  ${BOT_INFO.split(';')[1]}\n✧│ *ᴜsᴇʀ :* ${message.pushName.replace(/[\r\n]+/gm, "")}\n✧│ *ᴘʟᴜɢɪɴs :* ${commands.length}\n✧│ *ᴅᴀᴛᴇ :* ${date}\n✧│ *ᴛɪᴍᴇ :* ${time}\n✧│ *ᴜᴘᴛɪᴍᴇ :* ${clockString(uptime())}\n✧│ *ᴠᴇʀsɪᴏɴ :* ᴠ${version}\n┃╰──────────────···▸\n╰━━━━━━━━━━━━━━━···▸\n\n\n${await readMore()}\n╭━━━━━━━━━━━━━━━···▸\n╽`;
    let cmnd = [], category = [];
    for (const command of plugins.commands) {
        const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)?.[2];
        if (!command.dontAddCommandList && cmd) {
            const type = (command.type || "misc").toUpperCase();
            cmnd.push({ cmd, type });
            if (!category.includes(type)) category.push(type);
        }
    }

    const [typFont, ptrnFont] = MENU_FONT.split(';').map(font => isNaN(font) || parseInt(font) > 35 ? null : font);
    cmnd.sort();
    for (const cmmd of category.sort()) {
        let typ;
        if (typFont && typFont !== '0') {
            typ = await fancy.apply(fancy[parseInt(typFont)-1], cmmd);
        } else {
            typ = cmmd.toUpperCase();
        }
        
        menu += `\n┃  ╭─────────────┅┄▻\n┃  │  *➻ ${typ}*\n┃  ╰┬────────────┅┄▻\n┃  ┌┤`;
        for (const { cmd, type } of cmnd.filter(({ type }) => type === cmmd)) {
            let ptrn;
            if (ptrnFont && ptrnFont !== '0') {
                ptrn = await fancy.apply(fancy[parseInt(ptrnFont)-1], cmd.trim().toUpperCase());
            } else {
                ptrn = cmd.charAt(0).toUpperCase() + cmd.slice(1).toLowerCase();
            }
            menu += `\n┃  │ ‣ ${ptrn}`;
        }
        menu += `\n┃  ╰─────────────···▸`;
    }
    menu += ` ╰━━━━━━━━━━━┈⊷\nmade with 🤍`;
    let url = BOT_INFO.split(';')[2];
    let options = BOT_INFO.includes('&gif') ? { gifPlayback: true, caption: menu } : { caption: menu };  
    url = url.replace(/&gif/g, '');
    if (isUrl(url)) await message.sendFromUrl(url, options);
    else await message.send(menu);
});
