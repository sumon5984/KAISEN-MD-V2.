const { plugin } = require('../lib');
const { personalDB } = require('../lib');
const { getRandom, parsedJid } = require('../lib');

const emojis = '😁,😆,😂,🤣,😇,🙂,😘,😉,😜,🥳,🤯,😤,😰,🤔,😶'.split(',');

// ⚙️ Command to set AREACT value
plugin({
  pattern: 'areact ?(.*)',
  fromMe: true,
  desc: 'Enable/Disable auto reaction',
  type: 'mode',
}, async (message, match) => {
  if (!match) {
    return await message.send(
      `> *Usage:*\n` +
      `- .areact on | off\n` +
      `- .areact only_pm\n` +
      `- .areact only_group\n` +
      `- .areact react_only <jid>\n` +
      `- .areact not_react <jid>`
    );
  }

  await personalDB(['areact'], { content: match }, 'set');
  await message.send('✅ AREACT updated.');
});

// 🧾 Show current AREACT config
plugin({
  pattern: 'areactstatus',
  fromMe: true,
  desc: 'Show auto react setting',
  type: 'mode',
}, async (message) => {
  const settings = await personalDB(['areact'], {}, 'get');
  const config = settings.areact || 'not set';
  await message.send(`📌 *AREACT:*\n\`\`\`${config}\`\`\``);
});

// 🔁 Main auto-react logic
plugin({
  on: 'text',
  fromMe: false,
  type: 'auto_react',
}, async (message) => {
  try {
    if (message.fromMe) return; // ✅ Ignore self messages
    if (!message.text || message.text.trim() === '') return; // ✅ Ignore empty/media

    const settings = await personalDB(['areact'], {}, 'get');
    const config = settings.areact || '';

    if (!config || config.includes('off')) return;

    const jid = message.jid;

    // Filter: not_react
    if (config.includes('not_react') && parsedJid(config).includes(jid)) return;

    // Filter: react_only
    if (config.includes('react_only') && !parsedJid(config).includes(jid)) return;

    // Filter: only_pm
    if (config.includes('only_pm') && message.isGroup) return;

    // Filter: only_group
    if (config.includes('only_group') && !message.isGroup) return;

    // ✅ Send reaction
    const reaction = {
      text: getRandom(emojis),
      key: message.key,
    };

    console.log("✅ Reacting to:", jid, "→", reaction.text);
    await message.send(reaction, {}, 'react');

  } catch (err) {
    console.error('❌ Auto-react error:', err);
  }
});