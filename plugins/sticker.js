const {
  plugin,
  mode,
  config
} = require('../lib');
const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

plugin(
  {
    pattern: "sticker",
    fromMe: mode,
    desc: 'make stickers',
    react: "🔁",
    type: 'converter',
  },
  async (message, match) => {
    // Validate input
    if (!/image|video|webp/.test(message.mime)) {
      return await message.send('> Please reply to an image/video/sticker message');
    }

    let buffer;

    // If the message is a reply
    if (message.reply_message?.mime) {
      buffer = await message.reply_message.download();
    } else if (/image|video|webp/.test(message.mime)) {
      // For direct message
      const media = message.msg?.message?.[message.type + 'Message'] || message.msg?.message?.[Object.keys(message.msg?.message || {})[0]];
      const mediaType = message.mime.split('/')[0];

      const stream = await downloadContentFromMessage(media, mediaType);
      buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
    } else {
      return await message.send('```Invalid media type.```');
    }

    // Send sticker
    return await message.sendSticker(message.jid, buffer, {
      author: config.STICKER_DATA.split(/[|;,]/)[0] || config.STICKER_DATA,
      packname: config.STICKER_DATA.split(/[|;,]/)[1],
    });
  }
);