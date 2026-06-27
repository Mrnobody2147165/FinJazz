import { onSnapshot } from 'firebase/firestore';

/**
 * Wraps Firestore onSnapshot with consistent error handling.
 * Returns an unsubscribe function.
 */
export const createSubscription = (queryOrRef, onData, onError) => {
  return onSnapshot(
    queryOrRef,
    (snapshot) => {
      onData(snapshot);
    },
    (error) => {
      console.error('[Firestore] Subscription error:', error.code, error.message);
      onError?.(error);
    }
  );
};

export const mapSnapshotDocs = (snapshot) =>
  snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

export const mapSingleDoc = (snapshot) =>
  snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
