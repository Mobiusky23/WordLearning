import type { WordDefinition } from '@/types/dictionary';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function searchWord(
  query: string,
  isEnToZh: boolean
): Promise<WordDefinition> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dictionary/search?q=${encodeURIComponent(
        query
      )}&lang=${isEnToZh ? 'en-zh' : 'zh-en'}`
    );

    if (!response.ok) {
      throw new APIError(
        '搜索失败',
        response.status,
        await response.text()
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : '网络错误'
    );
  }
} 