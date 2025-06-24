
const {
  plugin,
  mode
} = require('../lib');

plugin({
  pattern: 'ping ?(.*)',
  desc: 'Check bot response speed',
  react: '🍄',
  fromMe: mode,
  type: 'info'
}, async (message, match) => {
  const start = new Date().getTime();
  
  const emojis = [
    '⛅🌦️🌤️', '💘💝💖', '👻⛄👀', '🪁🪃🎳',
    '🎀🎁🎈', '🙊🙉🙈',  '🌸✨💮', '🩷🌙💫', '🌈🌸🌟', '🍥🌺🎀',
    '🍓🍡💗', '🦋🎐💖', '💫🫧🌙', '💞🌸🐾',
    '🍰🎀🌼', '🍡🌼💗'
, '👻💀☠️', '🤍🩷🩶',
    '☁️🌨️🌧️', '🌦️🌥️⛅', '🌜🌚🌝', '🥀🌹💐',
    '☃️🪺🪹', '🍂🍄🌾', '🍁🌴🍀', '🐼🐹🐰',
    '👻⛄☃️', '⚡✨🌟',   '🌸✨💮', '🩷🌙💫'
  ];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const temp = await message.send('🏓 Pinging...');
  const end = new Date().getTime();
  const ping = end - start;

  const styledText = `◈ ${emoji}\n*╰┈➤ 𝐏O͒N͒𝐆: ${ping} 𝐌ʂ*`;

  await temp.edit(styledText);
});