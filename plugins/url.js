const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const { CMD_NAME } = require('../config');
const { plugin, mode } = require('../lib');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

plugin({
  pattern: 'url',
  desc: 'Convert media to Catbox URL',
  react: "⛰️",
  fromMe: mode,
  type: "converter"
}, async (message, match) => {
  try {
    const quoted = message.reply_message || message;
    const mime = quoted?.msg?.mimetype;

    if (!mime) return await message.reply("❌ Please reply to an image, video, or audio message.");

    // Download media buffer
    const mtype = mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted.msg, mtype);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Temp file creation
    const ext = mime.includes("jpeg") ? ".jpg" :
                mime.includes("png") ? ".png" :
                mime.includes("video") ? ".mp4" :
                mime.includes("audio") ? ".mp3" : "";
    const filename = `catbox_upload_${Date.now()}${ext}`;
    const filepath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(filepath, buffer);

    // Upload to Catbox
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(filepath), filename);
    form.append('reqtype', 'fileupload');

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    fs.unlinkSync(filepath); // Delete temp file

    if (!res.data || !res.data.startsWith("https://")) {
      throw "❌ Catbox response invalid or empty.";
    }

    const url = res.data;
    await message.reply(
      `✅ *Media Uploaded Successfully*\n` +
      `*Type:* ${mime}\n` +
      `*Size:* ${formatBytes(buffer.length)}\n` +
      `*URL:* ${url}\n\n` +
      `> *${CMD_NAME}*`
    );
  } catch (err) {
    console.error(err);
    const msg = err.code === 'ETIMEDOUT'
      ? "❌ Catbox timeout. Please try again later."
      : `❌ Error: ${err.message || err}`;
    await message.reply(msg);
  }
});

function formatBytes(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}