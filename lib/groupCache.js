// lib/groupCache.js

const groupMetaCache = new Map();

async function getGroupMeta(conn, groupId, forceRefresh = false) {
  if (!groupMetaCache.has(groupId) || forceRefresh) {
    try {
      console.log(`[groupMeta] Fetching metadata for ${groupId}`);
      const metadata = await conn.groupMetadata(groupId);
      groupMetaCache.set(groupId, metadata);
    } catch (err) {
      console.error(`❌ Failed to fetch metadata for ${groupId}:`, err.message);
      return null;
    }
  } else {
    console.log(`[groupMeta] Using cached metadata for ${groupId}`);
  }
  return groupMetaCache.get(groupId);
}

module.exports = { getGroupMeta };