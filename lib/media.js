const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function downloadMedia(message) {
  const mime = message.mimetype || '';
  const type = mime.split('/')[0]; // 'image', 'video', etc.

  const stream = await downloadContentFromMessage(message, type);
  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  return buffer;
}

module.exports = { downloadMedia };