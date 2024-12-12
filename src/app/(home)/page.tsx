'use client';

import { useState } from 'react';
import { SearchBox } from "./components/SearchBox";
import { SearchResult } from "./components/SearchResult"; 
import { AuthButtons } from "./components/AuthButtons";
import type { SearchState } from '@/types/dictionary';

export default function HomePage() {
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
  });

  // 创建一个包含当前状态的对象
  const searchStateObj = {
    isLoading: searchState.isLoading,
    error: searchState.error,
    data: searchState.data,
    onChange: setSearchState,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-neutral-900">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-blue-100/50 dark:border-blue-900/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          {/* Logo */}
          <a href="/" className="font-medium text-xl text-blue-500">
            词典
          </a>
          
          {/* 认证按钮 */}
          <AuthButtons />
        </div>
      </header>

      {/* 主要内容区 - 两栏布局 */}
      <main className="flex-1 pt-16">
        <div className="container mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] gap-6 p-4">
          {/* 左侧搜索区域 */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col">
            <div className="sticky top-20 space-y-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <SearchBox searchState={searchStateObj} />
            </div>
          </div>

          {/* 右侧结果区域 */}
          <div className="w-full lg:w-[55%] xl:w-[60%] min-h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <SearchResult 
              isLoading={searchState.isLoading}
              data={searchState.data}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 