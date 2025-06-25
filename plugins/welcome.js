const { plugin, groupDB, config } = require('../lib');

plugin(
  {
    pattern: 'welcome ?(.)',
    desc: 'Set or control welcome message',
    react: '👋',
    type: 'group',
    fromMe: true,
    onlyGroup: true,
  },
  async (message, match) => {
    match = (match || '').trim();

    const { welcome } =
      (await groupDB(['welcome'], { jid: message.jid, content: {} }, 'get')) || {};
    const status = welcome?.status === 'true' ? 'true' : 'false';
    const currentMsg = welcome?.message || '';

    if (match.toLowerCase() === 'get') {
      if (status === 'false') {
        return await message.send(
          `_*Example:* welcome Hello &mention_\n_status: off_\nVisit ${config.BASE_URL}info/welcome_`
        );
      }
      return await message.send(`_*Welcome Message:*_\n${currentMsg}`);
    }

    if (match.toLowerCase() === 'on') {
      if (status === 'true') return await message.send('_already activated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'true', message: currentMsg },
      }, 'set');
      return await message.send('*welcome activated*');
    }

    if (match.toLowerCase() === 'off') {
      if (status === 'false') return await message.send('_already deactivated_');
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status: 'false', message: currentMsg },
      }, 'set');
      return await message.send('*welcome deactivated*');
    }

    if (match.length) {
      await groupDB(['welcome'], {
        jid: message.jid,
        content: { status, message: match },
      }, 'set');
      return await message.send('*welcome message saved*');
    }

    return await message.send(
      '_Example:_\nwelcome Hello &mention\nwelcome on/off/get'
    );
  }
);


/*

plugin(
  {
    pattern: 'welcome ?(.*)',
    desc: 'Set, enable, disable, or read the welcome-message',
    react: '😅',
    type: 'greetings',
    fromMe: true,
    onlyGroup: true
  },
  async (message, match) => {
    // Normalise the user’s argument
    match = (match || '').trim();

    // Pull current settings for this group
    let welcomeData =
      (await groupDB(['welcome'], { jid: message.jid, content: {} }, 'get')) || {};
    let status = welcomeData.status === 'true' ? 'true' : 'false';

    // ─── GET ──────────────────────────────────────────────────────────────────
    if (match.toLowerCase() === 'get') {
      if (status === 'false') {
        return await message.send(
          `_*Example:* welcome get_\n_welcome hi &mention_\n_*for more:* visit ${config.BASE_URL}info/welcome_`
        );
      }
      if (!welcomeData.message) return await message.send('*Not Found*');
      return await message.send(welcomeData.message);
    }

    // ─── ON ───────────────────────────────────────────────────────────────────
    if (match.toLowerCase() === 'on') {
      if (status === 'true') return await message.send('_already activated_');

      await groupDB(
        ['welcome'],
        { jid: message.jid, content: { status: 'true', message: welcomeData.message || '' } },
        'set'
      );
      return await message.send('*successfull*');
    }

    // ─── OFF ──────────────────────────────────────────────────────────────────
    if (match.toLowerCase() === 'off') {
      if (status === 'false') return await message.send('_already deactivated_');

      await groupDB(
        ['welcome'],
        { jid: message.jid, content: { status: 'false', message: welcomeData.message || '' } },
        'set'
      );
      return await message.send('*successfull*');
    }

    // ─── NEW MESSAGE STRING ──────────────────────────────────────────────────
    if (match.length) {
      await groupDB(
        ['welcome'],
        { jid: message.jid, content: { status, message: match } },
        'set'
      );
      return await message.send('*success*');
    }

    // ─── HELP ────────────────────────────────────────────────────────────────
    return await message.send(
      '_*welcome get*_\n_*welcome* thank you for joining &mention_\n*_welcome false_*'
    );
  }
);


*/



plugin(
  {
    pattern: 'goodbye ?(.*)',
    desc: 'Set or control goodbye message',
    react: '👏',
    type: 'group',
    fromMe: true,
    onlyGroup: true,
  },
  async (message, match) => {
    match = (match || '').trim();

    const { exit } =
      (await groupDB(['exit'], { jid: message.jid, content: {} }, 'get')) || {};
    const status = exit?.status === 'true' ? 'true' : 'false';
    const currentMsg = exit?.message || '';

    if (match.toLowerCase() === 'get') {
      if (status === 'false') {
        return await message.send(
          `_*Example:* goodbye get_\n_goodbye bye &mention_\n_*for more:* visit ${config.BASE_URL}info/goodbye_`
        );
      }
      if (!currentMsg) return await message.send('*Not Found*');
      return await message.send(currentMsg);
    }

    if (match.toLowerCase() === 'on') {
      if (status === 'true') return await message.send('_already activated_');
      await groupDB(
        ['exit'],
        { jid: message.jid, content: { status: 'true', message: currentMsg } },
        'set'
      );
      return await message.send('*goodbye activated*');
    }

    if (match.toLowerCase() === 'off') {
      if (status === 'false') return await message.send('_already deactivated_');
      await groupDB(
        ['exit'],
        { jid: message.jid, content: { status: 'false', message: currentMsg } },
        'set'
      );
      return await message.send('*goodbye deactivated*');
    }

    if (match.length) {
      await groupDB(
        ['exit'],
        { jid: message.jid, content: { status, message: match } },
        'set'
      );
      return await message.send('*goodbye message saved*');
    }

    return await message.send(
      '_Example:_\ngoodbye Bye &mention\n\nTurn on/off:\ngoodbye on\ngoodbye off\ngoodbye get'
    );
  }
);