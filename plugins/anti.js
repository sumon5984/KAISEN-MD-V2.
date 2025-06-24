const { getAntiLink, setAntiLink } = require('../lib/antilinkdb'); // you create this file

const lang = require('../lib/lang');

const { plugin } = require('../lib/');

plugin(
{
pattern: 'antilink ?(.*)',
desc: lang.plugins.antilink.desc,
type: 'group',
onlyGroup: true,
},
async (message, match) => {
const antilink = await getAntiLink(message.jid, message.id)
const status = antilink?.enabled ? 'on' : 'off'

// If no argument provided  
if (!match) {  
  return message.send(lang.plugins.antilink.example.format(status))  
  }  

  // Enable or disable  
  if (match === 'on' || match === 'off') {  
    if (match === 'off' && !antilink?.enabled)  
        return message.send(lang.plugins.antilink.disable)  
          await setAntiLink(message.jid, match === 'on', message.id)  
            return message.send(  
                lang.plugins.antilink.status.format(match === 'on' ? 'enabled' : 'disabled')  
                  )  
                  }  

                  // Info  
                  if (match === 'info') {  
                    if (!antilink) {  
                        return message.send(lang.plugins.antilink.antilink_notset)  
                          }  
                            return message.send(  
                                lang.plugins.antilink.info.format(  
                                      status,  
                                            antilink.allowedUrls?.join(', ') || 'none',  
                                                  antilink.action || 'null'  
                                                      )  
                                                        )  
                                                        }  

                                                        // Action change  
                                                        if (match.startsWith('action/')) {  
                                                          const action = match.split('/')[1]  
                                                            if (!['warn', 'kick', 'null'].includes(action))  
                                                                return message.send(lang.plugins.antilink.action_invalid)  

                                                                  await setAntiLink(message.jid, { action }, message.id)  
                                                                    return message.send(lang.plugins.antilink.action_update.format(action))  
                                                                    }  

                                                                    // Allow/Not allow URL update  
                                                                    const res = await setAntiLink(message.jid, { url: match }, message.id)  
                                                                    return message.send(  
                                                                      lang.plugins.antilink.update.format(  
                                                                          res.allow?.length ? res.allow.join(', ') : 'none',  
                                                                              res.notallow?.length ? res.notallow.join(', ') : 'none'  
                                                                                )  
                                                                                )

                                                                                }
                                                                                )

                                                                                