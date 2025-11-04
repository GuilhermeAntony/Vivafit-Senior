import AsyncStorage from '@react-native-async-storage/async-storage';
// Use legacy API to avoid deprecation warnings for getInfoAsync
import * as FileSystem from 'expo-file-system/legacy';

const EX_CACHE_KEY = 'exerciseCache_v1';
const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type CachedExercise = {
  id: number | string;
  name?: string;
  description?: string;
  imageRemote?: string;
  imageLocal?: string;
  fetchedAt?: number;
};

export async function getCachedExercise(id: number | string) {
  try {
    const raw = await AsyncStorage.getItem(EX_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, CachedExercise>;
    const key = String(id);
    const entry = map[key];
    if (!entry) return null;
    // check expiration
    if (entry.fetchedAt && (Date.now() - entry.fetchedAt) > EXPIRATION_MS) {
      // remove local image if present
      if (entry.imageLocal) {
        try { await FileSystem.deleteAsync(entry.imageLocal, { idempotent: true }); } catch (e) { }
      }
      delete map[key];
      try { await AsyncStorage.setItem(EX_CACHE_KEY, JSON.stringify(map)); } catch (e) { }
      return null;
    }
    return entry ?? null;
  } catch (e) {
    return null;
  }
}

export async function setCachedExercise(id: number | string, data: Partial<CachedExercise>) {
  try {
    const raw = await AsyncStorage.getItem(EX_CACHE_KEY);
    const map = raw ? JSON.parse(raw) as Record<string, CachedExercise> : {};
    // prune expired entries on write
    for (const k of Object.keys(map)) {
      const it = map[k];
      if (it.fetchedAt && (Date.now() - it.fetchedAt) > EXPIRATION_MS) {
        if (it.imageLocal) {
          try { await FileSystem.deleteAsync(it.imageLocal, { idempotent: true }); } catch (e) { }
        }
        delete map[k];
      }
    }
    map[String(id)] = { ...(map[String(id)] || {}), ...data, id, fetchedAt: Date.now() };
    await AsyncStorage.setItem(EX_CACHE_KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}

export async function downloadAndCacheImage(id: number | string, url: string) {
  if (!url) return null;
  try {
    const filename = `exercise_${String(id)}_${encodeURIComponent(url).slice(0,60)}.jpg`;
    // FileSystem.cacheDirectory nem sempre é exposto tipado; use fallback seguro
    const cacheDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || '';
    const local = `${cacheDir}${filename}`;
    // check if exists
    const info = await FileSystem.getInfoAsync(local);
    if (info.exists) return local;

    const dl = await FileSystem.downloadAsync(url, local);
    if (dl.status !== 200 && dl.status !== 201) return null;
    return dl.uri;
  } catch (e) {
    return null;
  }
}

export async function clearExerciseCache() {
  try {
    const raw = await AsyncStorage.getItem(EX_CACHE_KEY);
    if (!raw) return;
    const map = JSON.parse(raw) as Record<string, CachedExercise>;
    // remove files
    for (const k of Object.keys(map)) {
      const it = map[k];
      if (it.imageLocal) {
        try { await FileSystem.deleteAsync(it.imageLocal, { idempotent: true }); } catch(e){}
      }
    }
    await AsyncStorage.removeItem(EX_CACHE_KEY);
  } catch (e) {
    // ignore
  }
}
