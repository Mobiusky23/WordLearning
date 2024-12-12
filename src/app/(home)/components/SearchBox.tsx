'use client';

import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, Clock, History } from "lucide-react";
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { searchWord } from '@/services/dictionary';
import type { SearchState, WordDefinition } from '@/types/dictionary';

interface SearchBoxProps {
  searchState: {
    isLoading: boolean;
    error?: string;
    data?: WordDefinition;
    onChange: (state: SearchState) => void;
  };
}

export function SearchBox({ searchState }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isEnToZh, setIsEnToZh] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { addHistory, getSuggestions } = useSearchHistory();
  const suggestions = getSuggestions(query, isEnToZh);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setShowSuggestions(false);

    searchState.onChange({ isLoading: true });
    try {
      const data = await searchWord(query, isEnToZh);
      searchState.onChange({
        isLoading: false,
        data
      });
      addHistory(query, isEnToZh);
    } catch (error) {
      searchState.onChange({
        isLoading: false,
        error: error instanceof Error ? error.message : '搜索失败,请稍后重试'
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* 语言切换 */}
      <div className="flex p-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <Button 
          variant={isEnToZh ? "default" : "ghost"}
          onClick={() => setIsEnToZh(true)}
          className="flex-1 rounded-lg"
        >
          英 → 中
        </Button>
        <Button
          variant={!isEnToZh ? "default" : "ghost"}
          onClick={() => setIsEnToZh(false)}
          className="flex-1 rounded-lg"
        >
          中 → 英
        </Button>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <div className="relative">
          <Input
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={isEnToZh ? "输入英文单词..." : "输入中文..."}
            className="h-12 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-0 focus-visible:ring-2 focus-visible:ring-blue-500/50"
            disabled={searchState.isLoading}
          />
          {query && !searchState.isLoading && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 搜索建议 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white dark:bg-neutral-800 rounded-xl border border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 text-sm transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Clock className="w-4 h-4 text-blue-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* 搜索按钮 */}
        <Button 
          onClick={handleSearch} 
          disabled={searchState.isLoading}
          className="w-full mt-3 h-12 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {searchState.isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          搜索
        </Button>
      </div>

      {/* 错误提示 */}
      {searchState.error && (
        <p className="text-sm text-red-500 text-center mt-3">
          {searchState.error}
        </p>
      )}
    </div>
  );
} 