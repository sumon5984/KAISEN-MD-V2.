
const { plugin, parsedJid, getRandom, config } = require('../lib/');

plugin(
  {
    pattern: 'areact ?(.*)',
    desc: 'auto react to messages',
    type: 'misc',
    fromMe: true
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        '> Example :\n- areact on | off\n- areact not_react 2364723@g.us\n- areact react_only 72534823@g.us\n- areact only_pm\n- areact only_group'
      )
    
    // Store the setting in config or database
    config.AREACT = match;
    await message.send('AREACT updated successfully');
  }
)

const emojis =
  '😁,😆,😅,😂,🥹,🤣,🥲,☺️,😇,🙂,🙃,😘,😉,😙,🥸,🤓,😜,🙁,😞,☹️,😣,🥳,😫,😖,😒,😢,🤯,😤,🥵,😤,🥶,🫢,😰,🤔,🫤,😑,🫨,🙄,🤫,🤥,😶,🫥,😶‍🌫,🥶'.split(
    ','
  )

plugin({ 
  on: 'all', 
  fromMe: false, 
  type: 'auto_react',
  allowBot: false
}, async (message, match) => {
  // Check if auto-react is enabled
  const areactSetting = config.AREACT || 'on';
  const on_off = areactSetting.includes('off');
  if (on_off) return;

  // Skip if it's not a text message
  if (!message.text || message.text.trim() === '') return;

  // Handle not_react jids (exclude these from auto-react)
  const not_react_jids = areactSetting.includes('not_react');
  if (not_react_jids) {
    const not_gids = parsedJid(areactSetting.split('not_react')[1]?.trim() || '') || [];
    if (not_gids.includes(message.jid)) return;
  }

  // Handle react_only jids (only react in these chats)
  const react_jids = areactSetting.includes('react_only');
  if (react_jids) {
    const gids = parsedJid(areactSetting.split('react_only')[1]?.trim() || '') || [];
    if (!gids.includes(message.jid)) return;
  }

  // Handle only_pm and only_group settings
  const onlyPm = areactSetting.includes('only_pm');
  const onlyGroup = areactSetting.includes('only_group');
  
  const isReact =
    !message.fromMe &&
    (onlyPm ? !message.isGroup : true) &&
    (onlyGroup ? message.isGroup : true) &&
    (!onlyPm || !message.isGroup) &&
    (!onlyGroup || message.isGroup);

  if (!isReact) return;

  // Send random emoji reaction
  const randomEmoji = getRandom(emojis);
  return await message.client.sendMessage(message.jid, {
    react: {
      text: randomEmoji,
      key: message.key
    }
  });
});
