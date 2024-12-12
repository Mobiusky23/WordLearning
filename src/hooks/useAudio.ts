import { useState, useEffect, useCallback } from 'react';

interface AudioState {
  isPlaying: boolean;
  error: boolean;
  audio: HTMLAudioElement | null;
}

export function useAudio(url?: string) {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    error: false,
    audio: null,
  });

  // 预加载音频
  useEffect(() => {
    if (!url) return;

    const audio = new Audio(url);
    audio.preload = 'auto';
    
    setState(prev => ({ ...prev, audio }));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [url]);

  // 播放处理
  const play = useCallback(async () => {
    if (!state.audio) {
      setState(prev => ({ ...prev, error: true }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isPlaying: true, error: false }));
      await state.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      setState(prev => ({ ...prev, error: true }));
    }
  }, [state.audio]);

  // 监听音频结束
  useEffect(() => {
    if (!state.audio) return;

    const audio = state.audio;
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [state.audio]);

  return {
    play,
    isPlaying: state.isPlaying,
    error: state.error,
  };
} 