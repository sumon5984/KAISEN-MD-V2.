const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');

// Initialize auth state
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['Bot', 'Chrome', '1.0']
  });

  // Auto save credentials on update
  sock.ev.on('creds.update', saveCreds);

  // Connection closed handling
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        startBot();
      } else {
        console.log("Logged out.");
      }
    } else if (connection === 'open') {
      console.log("✅ Bot connected!");
    }
  });

  // Listen for incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const msgText = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const lowerText = msgText.toLowerCase().trim();

    // Auto-reply logic
    if (lowerText === 'hi') {
      const replyText = "Hi 👋, how can I help you?";
      await sock.sendMessage(from, { text: replyText }, { quoted: m });
    }
  });
}

startBot();