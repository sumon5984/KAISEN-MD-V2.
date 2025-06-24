module.exports = {
  plugins: {
    antilink: {
      desc: "Enable or configure anti-link protection in the group.",
      example: "AntiLink is currently: {}.\nUse `.antilink on/off/info/action/kick/warn/null`.",
      status: "AntiLink has been {}.",
      disable: "AntiLink is already off.",
      info: "🔒 Status: {}\n✅ Allowed URLs: {}\n⚠️ Action on violation: {}",
      action_invalid: "❌ Invalid action. Use: `warn`, `kick`, or `null`.",
      action_update: "✅ AntiLink action updated to: {}",
      update: "🔄 Allowed: {}\n🚫 Blocked: {}",
      antilink_notset: "ℹ️ AntiLink is not configured for this group yet.",
    }
  }
}