import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const db = getFirestore();

// User operations
export const createUser = async (userId: string, userData: any) => {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateUser = async (userId: string, data: any) => {
  await updateDoc(doc(db, 'users', userId), data);
};

// Reading operations
export const saveReading = async (userId: string, reading: any) => {
  const readingData = {
    ...reading,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'readings'), readingData);
  return docRef.id;
};

export const getReading = async (readingId: string) => {
  const readingDoc = await getDoc(doc(db, 'readings', readingId));
  return readingDoc.exists() ? { id: readingDoc.id, ...readingDoc.data() } : null;
};

export const getUserReadings = async (userId: string, limitCount: number = 20) => {
  const q = query(
    collection(db, 'readings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const toggleFavorite = async (readingId: string, isFavorite: boolean) => {
  await updateDoc(doc(db, 'readings', readingId), { isFavorite });
};

// Dream operations
export const saveDream = async (userId: string, dream: any) => {
  const dreamData = {
    ...dream,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'dreams'), dreamData);
  return docRef.id;
};

export const getUserDreams = async (userId: string, limitCount: number = 20) => {
  const q = query(
    collection(db, 'dreams'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Subscription operations
export const saveSubscription = async (userId: string, subscription: any) => {
  await setDoc(doc(db, 'subscriptions', userId), {
    ...subscription,
    updatedAt: serverTimestamp(),
  });
};

export const getSubscription = async (userId: string) => {
  const subDoc = await getDoc(doc(db, 'subscriptions', userId));
  return subDoc.exists() ? subDoc.data() : null;
};
