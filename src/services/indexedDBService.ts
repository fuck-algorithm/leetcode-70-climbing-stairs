/**
 * 统一的 IndexedDB 服务模块
 * 用于管理用户偏好设置和缓存数据
 */

export type Language = 'java' | 'python' | 'golang' | 'javascript';

const DB_NAME = 'AlgorithmVisualizerDB';
const DB_VERSION = 1;
const STORE_NAME = 'preferences';

// 缓存键
const KEYS = {
  LANGUAGE: 'preferred_language',
  PLAYBACK_SPEED: 'playback_speed',
  GITHUB_STARS: 'github_stars_cache',
} as const;

// GitHub Star 缓存有效期：1小时
const STAR_CACHE_DURATION = 60 * 60 * 1000;

interface StarCache {
  stars: number;
  timestamp: number;
}

interface PreferenceItem {
  key: string;
  value: unknown;
}

/**
 * 打开数据库连接
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

/**
 * 获取存储的值
 */
const getValue = async <T>(key: string): Promise<T | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result as PreferenceItem | undefined;
        resolve(result?.value as T ?? null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

/**
 * 设置存储的值
 */
const setValue = async <T>(key: string, value: T): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ key, value });
  } catch {
    // 忽略存储错误
  }
};

/**
 * 语言偏好服务
 */
export const languageService = {
  /**
   * 获取保存的语言偏好
   */
  async get(): Promise<Language | null> {
    return getValue<Language>(KEYS.LANGUAGE);
  },

  /**
   * 保存语言偏好
   */
  async set(language: Language): Promise<void> {
    return setValue(KEYS.LANGUAGE, language);
  },
};

/**
 * 播放速度服务
 */
export const playbackSpeedService = {
  /**
   * 获取保存的播放速度
   */
  async get(): Promise<number | null> {
    return getValue<number>(KEYS.PLAYBACK_SPEED);
  },

  /**
   * 保存播放速度
   */
  async set(speed: number): Promise<void> {
    return setValue(KEYS.PLAYBACK_SPEED, speed);
  },
};

/**
 * GitHub Star 缓存服务
 */
export const starCacheService = {
  /**
   * 获取缓存的 Star 数据
   */
  async get(): Promise<StarCache | null> {
    return getValue<StarCache>(KEYS.GITHUB_STARS);
  },

  /**
   * 保存 Star 数据到缓存
   */
  async set(stars: number): Promise<void> {
    const cache: StarCache = {
      stars,
      timestamp: Date.now(),
    };
    return setValue(KEYS.GITHUB_STARS, cache);
  },

  /**
   * 检查缓存是否有效（未过期）
   */
  isValid(cache: StarCache | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < STAR_CACHE_DURATION;
  },

  /**
   * 获取缓存有效期（毫秒）
   */
  getCacheDuration(): number {
    return STAR_CACHE_DURATION;
  },
};

/**
 * 导出所有服务
 */
export const indexedDBService = {
  language: languageService,
  playbackSpeed: playbackSpeedService,
  starCache: starCacheService,
};

export default indexedDBService;
