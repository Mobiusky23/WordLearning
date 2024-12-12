import { useState, useEffect } from 'react';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 50;

interface SearchHistoryItem {
  query: string;
  isEnToZh: boolean;
  timestamp: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // 加载历史记录
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // 添加搜索记录
  const addHistory = (query: string, isEnToZh: boolean) => {
    const newItem: SearchHistoryItem = {
      query,
      isEnToZh,
      timestamp: Date.now(),
    };

    const newHistory = [
      newItem,
      ...history.filter(item => item.query !== query)
    ].slice(0, MAX_HISTORY);

    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // 清除历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // 获取搜索建议
  const getSuggestions = (
    query: string,
    isEnToZh: boolean,
    limit = 5
  ): string[] => {
    if (!query) return [];
    
    return history
      .filter(
        item =>
          item.isEnToZh === isEnToZh &&
          item.query.toLowerCase().startsWith(query.toLowerCase())
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(item => item.query);
  };

  return {
    history,
    addHistory,
    clearHistory,
    getSuggestions,
  };
} 