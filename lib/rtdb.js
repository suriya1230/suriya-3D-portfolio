// lib/rtdb.js — Firebase Realtime Database helpers
// Replaces Firestore for all portfolio data
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
    // e.g. { "-abc": { title: "...", bio: "..." }, "-def": { ... } }
    if (values.every(v => typeof v === 'object' && v !== null && !Array.isArray(v))) {
      return Object.entries(val).map(([id, data]) => ({ id, ...data }));
    }

    // Otherwise the node itself IS the single record (flat key-value pairs)
    // e.g. { title: "Suriya S", bio: "...", location: "Chennai" }
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
  await update(ref(rtdb, `${path}/${id}`), { ...data, updatedAt: Date.now() });
}

// ── Delete item ──
export async function deleteRTDB(path, id) {
  await remove(ref(rtdb, `${path}/${id}`));
}

// ── Log a visit ──
export async function logVisitRTDB(visitData) {
  const newRef = push(ref(rtdb, 'visits'));
  await set(newRef, { ...visitData, timestamp: Date.now() });
}

// ── Fetch visits ──
export async function fetchVisitsRTDB() {
  return fetchRTDB('visits');
}

// ── Real-time listener ──
export function listenRTDB(path, callback) {
  const unsubscribe = onValue(ref(rtdb, path), (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const val = snapshot.val();
    const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    callback(arr);
  });
  return unsubscribe; // call this to stop listening
}