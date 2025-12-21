import { useState, useEffect } from 'react';
import styled from 'styled-components';

const REPO_URL = 'https://github.com/fuck-algorithm/leetcode-70-climbing-stairs';
const REPO_API_URL = 'https://api.github.com/repos/fuck-algorithm/leetcode-70-climbing-stairs';
const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

interface CacheData {
  stars: number;
  timestamp: number;
}

// IndexedDB操作
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GitHubStarsDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
  });
};

const getFromCache = async (): Promise<CacheData | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(CACHE_KEY);
      request.onsuccess = () => {
        const data = request.result;
        if (data && Date.now() - data.timestamp < CACHE_DURATION) {
          resolve(data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

const saveToCache = async (stars: number): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');
    store.put({ key: CACHE_KEY, stars, timestamp: Date.now() });
  } catch {
    // 忽略缓存错误
  }
};

const Corner = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
`;

const GitHubLink = styled.a`
  width: 80px;
  height: 80px;
  display: block;
  
  &:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
  
  @keyframes octocat-wave {
    0%, 100% { transform: rotate(0); }
    20%, 60% { transform: rotate(-25deg); }
    40%, 80% { transform: rotate(10deg); }
  }
`;

const SVG = styled.svg`
  fill: #151513;
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
`;

const StarBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 85px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    width: 14px;
    height: 14px;
    fill: #333;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 45px;
  right: 85px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  
  ${Corner}:hover & {
    opacity: 1;
    visibility: visible;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid rgba(0, 0, 0, 0.8);
  }
`;

export default function GitHubCorner() {
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    const fetchStars = async () => {
      // 先尝试从缓存获取
      const cached = await getFromCache();
      if (cached) {
        setStars(cached.stars);
        return;
      }

      // 从API获取
      try {
        const response = await fetch(REPO_API_URL);
        if (response.ok) {
          const data = await response.json();
          const starCount = data.stargazers_count || 0;
          setStars(starCount);
          await saveToCache(starCount);
        }
      } catch {
        // 获取失败时尝试使用旧缓存
        try {
          const db = await openDB();
          const transaction = db.transaction(['cache'], 'readonly');
          const store = transaction.objectStore('cache');
          const request = store.get(CACHE_KEY);
          request.onsuccess = () => {
            if (request.result) {
              setStars(request.result.stars);
            }
          };
        } catch {
          // 忽略错误，使用默认值0
        }
      }
    };

    fetchStars();
  }, []);

  return (
    <Corner>
      <StarBadge onClick={() => window.open(REPO_URL, '_blank')}>
        <svg viewBox="0 0 16 16">
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
        </svg>
        {stars}
      </StarBadge>
      <Tooltip>点击去 GitHub 仓库 Star 支持一下 ⭐</Tooltip>
      <GitHubLink 
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="点击去 GitHub 仓库 Star 支持一下"
      >
        <SVG width="80" height="80" viewBox="0 0 250 250">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path 
            className="octo-arm" 
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" 
            fill="currentColor" 
          />
          <path 
            className="octo-body" 
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" 
            fill="currentColor" 
          />
        </SVG>
      </GitHubLink>
    </Corner>
  );
}