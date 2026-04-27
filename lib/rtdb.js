// lib/rtdb.js — Firebase Realtime Database helpers
import { rtdb } from './firebase';
import { ref, get, set, push, update, remove, onValue } from 'firebase/database';

// ── Fetch all items under a path as an array ──
export async function fetchRTDB(path) {
  try {
    const snapshot = await get(ref(rtdb, path));
    if (!snapshot.exists()) return [];
    const val = snapshot.val();

    if (typeof val !== 'object' || val === null) return [val];

    const values = Object.values(val);

    // If ALL children are plain objects → it's a collection of records
    if (values.every(v => typeof v === 'object' && v !== null && !Array.isArray(v))) {
      return Object.entries(val).map(([id, data]) => ({ id, ...data }));
    }

    // Otherwise the node itself IS the single record
    return [{ id: path, ...val }];
  } catch (e) {
    console.error(`[RTDB] fetchRTDB(${path}) error:`, e);
    return [];
  }
}

// ── Add item ──
export async function addRTDB(path, data) {
  const newRef = push(ref(rtdb, path));
  await set(newRef, { ...data, createdAt: Date.now() });
  return newRef.key;
}

// ── Update item ──
export async function updateRTDB(path, id, data) {
  // If id === path it means this was a flat/single-record node — update at root
  const nodePath = id === path ? path : `${path}/${id}`;
  await update(ref(rtdb, nodePath), { ...data, updatedAt: Date.now() });
}

// ── Delete item ──
export async function deleteRTDB(path, id) {
  const nodePath = id === path ? path : `${path}/${id}`;
  await remove(ref(rtdb, nodePath));
}

// ── Log a visit ──
export async function logVisitRTDB(visitData) {
  const newRef = push(ref(rtdb, 'visits'));
  await set(newRef, { ...visitData, timestamp: Date.now() });
}

// ── Fetch visits — sorted newest first ──
export async function fetchVisitsRTDB() {
  const items = await fetchRTDB('visits');
  // Sort newest first (timestamp stored as Date.now() number)
  return items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

// ── Real-time listener ──
export function listenRTDB(path, callback) {
  const unsubscribe = onValue(ref(rtdb, path), (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const val = snapshot.val();
    const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    callback(arr);
  });
  return unsubscribe;
}
