// lib/firestore.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// Generic fetch all from a collection
export async function fetchCollection(collectionName) {
  try {
    const q = query(collection(db, collectionName), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    // fallback without ordering
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// Generic add document
export async function addDocument(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Generic update document
export async function updateDocument(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// Generic delete document
export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

// Log a visit
export async function logVisit(visitData) {
  await addDoc(collection(db, 'visits'), {
    ...visitData,
    timestamp: serverTimestamp(),
  });
}

// Fetch all visits for analytics
export async function fetchVisits() {
  const snapshot = await getDocs(
    query(collection(db, 'visits'), orderBy('timestamp', 'desc'))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
