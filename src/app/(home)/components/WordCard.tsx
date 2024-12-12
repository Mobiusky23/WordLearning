'use client';

import { useState } from 'react';
import { Volume2, Star, Loader2 } from 'lucide-react';
import type { WordDefinition } from '@/types/dictionary';
import { Button } from "@/components/ui/button";
import { useAudio } from '@/hooks/useAudio';

interface WordCardProps {
  data: WordDefinition;
}

export function WordCard({ data }: WordCardProps) {
  const ukAudio = useAudio(data.extra?.pronunciation?.uk);
  const usAudio = useAudio(data.extra?.pronunciation?.us);

  return (
    <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50">
      <div className="space-y-4">
        {/* 单词头部 */}
        <div className="flex items-start justify-between border-b border-blue-100/50 dark:border-blue-900/50 pb-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-medium">{data.word}</h3>
              {data.phonetic && (
                <span className="text-sm text-blue-500 dark:text-blue-400 font-medium">
                  {data.phonetic}
                </span>
              )}
            </div>
            
            {/* 发音按钮 */}
            {data.extra?.pronunciation && (
              <div className="flex gap-3">
                {data.extra.pronunciation.uk && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={ukAudio.play}
                    disabled={ukAudio.isPlaying}
                  >
                    {ukAudio.isPlaying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    <span className="ml-1">英音</span>
                  </Button>
                )}
                {data.extra.pronunciation.us && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={usAudio.play}
                    disabled={usAudio.isPlaying}
                  >
                    {usAudio.isPlaying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    <span className="ml-1">美音</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* 收藏按钮 - 后续实现 */}
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => {/* TODO */}}
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>

        {/* 基本释义 */}
        <div className="space-y-4">
          {data.meanings.map((meaning, index) => (
            <div key={index} className="space-y-2">
              {meaning.partOfSpeech && (
                <div className="text-sm font-medium text-blue-500 dark:text-blue-400">
                  {meaning.partOfSpeech}
                </div>
              )}
              <ul className="space-y-3">
                {meaning.definitions.map((def, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="flex gap-2">
                      <span className="text-blue-400">{idx + 1}.</span>
                      <span>{def.definition}</span>
                    </div>
                    {def.example && (
                      <p className="mt-1.5 pl-5 text-sm text-blue-500 dark:text-blue-400">
                        例: {def.example}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 网络释义 */}
        {data.extra?.webTranslation && data.extra.webTranslation.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-blue-100/50 dark:border-blue-900/50">
            <div className="text-sm font-medium text-blue-500 dark:text-blue-400">
              网络释义
            </div>
            <ul className="space-y-2">
              {data.extra.webTranslation.map((item, index) => (
                <li key={index} className="text-sm">
                  <div className="flex gap-2">
                    <span className="text-blue-400">{index + 1}.</span>
                    <div>
                      <span className="font-medium">{item.key}</span>
                      <span className="mx-2">-</span>
                      <span>{item.value.join('; ')}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 音频错误提示 */}
        {(ukAudio.error || usAudio.error) && (
          <p className="text-sm text-red-500 mt-2">
            无法播放发音,请稍后重试
          </p>
        )}
      </div>
    </div>
  );
} 