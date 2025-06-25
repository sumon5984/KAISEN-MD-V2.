
const { 
  plugin,
  getRandom,
  parsedJid,
  personalDB
}= require('../lib');


plugin({
    pattern: 'areact ?(.*)',
    desc: 'auto react to messages',
    type: 'misc',
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        '> Example :\n' +
          '- areact on | off\n' +
          '- areact not_react 5434723@g.us\n' +
          '- areact react_only 89734823@g.us\n' +
          '- areact only_pm\n' +
          '- areact only_group'
      );
    await personalDB({ AREACT: match }, message.id);
    await message.send('😄 AREACT setting updated');
  }
);
const emojis = '😁,😆,😅,😂,🥹,🤣,🥲,☺️,😇,🙂,🙃,😘,😉,😙,🥸,🤓,😜,🙁,😞,☹️,😣,🥳,😫,😖,😒,😢,🤯,😤,🥵,😤,🥶,🫢,😰,🤔,🫤,😑,🫨,🙄,🤫,🤥,😶,🫥,😶‍🌫,🥶'.split(',');


plugin(
  {
    on: 'text',
    fromMe: false,
    type: 'auto_react',
  },
  async (message, match, ctx) => {
    const AREACT = ctx?.AREACT || [];
    if (AREACT.includes('false')) return;
    if (AREACT.includes('not_react')) {
      const not_gids = parsedJid(AREACT);
      if (not_gids.includes(message.jid)) return;
    }
    if (AREACT.includes('react_only')) {
      const react_gids = parsedJid(AREACT);
      if (!react_gids.includes(message.jid)) return;
    }
  const onlyPm = AREACT.includes('only_pm');
    const onlyGroup = AREACT.includes('only_group');
    const isReact =
      !message.fromMe &&
      (onlyPm ? !message.isGroup : true) &&
      (onlyGroup ? message.isGroup : true);

    if (!isReact) return;
    const react = {
      text: getRandom(emojis),
      key: message.key,
    };
    return await message.send(react, {}, 'react');
  }
);

