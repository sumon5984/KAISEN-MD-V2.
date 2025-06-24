const { groupDB } = require('./database'); // adjust the path if needed

// Get AntiLink settings for a group
async function getAntiLink(jid) {
  const data = await groupDB(['link'], { jid }, 'get');
  let value = data.link;

  if (!value || value === 'false') {
    return {
      enabled: false,
      allowedUrls: [],
      action: 'warn'
    };
  }

  if (typeof value === 'string') {
    value = JSON.parse(value);
  }

  return {
    enabled: value.enabled || false,
    allowedUrls: value.allowedUrls || [],
    action: value.action || 'warn'
  };
}

// Set AntiLink settings
async function setAntiLink(jid, update) {
  const current = await getAntiLink(jid);

  if (typeof update === 'boolean') {
    current.enabled = update;
  } else if (typeof update === 'object') {
    if (update.action) current.action = update.action;

    if (update.url) {
      const url = update.url.toLowerCase().trim();
      const index = current.allowedUrls.indexOf(url);
      if (index === -1) current.allowedUrls.push(url);
      else current.allowedUrls.splice(index, 1);
    }
  }

  await groupDB(['link'], { jid, content: current }, 'set');

  return {
    allow: current.allowedUrls,
    notallow: [] // can extend later
  };
}

module.exports = {
  getAntiLink,
  setAntiLink
};