import crypto from 'crypto';
import { YOUDAO_API_CONFIG } from '@/config/dictionary';

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1秒
  maxDelay: 5000,  // 5秒
};

// 指数退避算法
function getRetryDelay(retryCount: number): number {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(2, retryCount),
    RETRY_CONFIG.maxDelay
  );
  return delay + Math.random() * 100; // 添加随机抖动
}

function generateSign(query: string, salt: string, curtime: string) {
  const str = YOUDAO_API_CONFIG.appKey + truncate(query) + salt + curtime + YOUDAO_API_CONFIG.appSecret;
  return crypto.createHash('sha256').update(str).digest('hex');
}

function truncate(q: string): string {
  const len = q.length;
  return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
}

export async function translateWord(query: string, from: string, to: string) {
  let lastError: Error | null = null;
  
  for (let retry = 0; retry <= RETRY_CONFIG.maxRetries; retry++) {
    try {
      const salt = Date.now().toString();
      const curtime = Math.round(Date.now() / 1000).toString();
      const sign = generateSign(query, salt, curtime);

      const params = new URLSearchParams({
        q: query,
        from,
        to,
        appKey: YOUDAO_API_CONFIG.appKey!,
        salt,
        sign,
        signType: 'v3',
        curtime,
        ext: 'mp3',
        voice: '0',
        strict: 'true',
        vocabId: 'computers'
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${YOUDAO_API_CONFIG.baseUrl}?${params}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errorCode !== '0') {
        throw new Error(data.msg || '翻译失败');
      }

      console.log('API Response:', data);

      return data;
      
    } catch (error) {
      lastError = error as Error;
      
      // 如果是最后一次重试,或者是取消请求,直接抛出错误
      if (
        retry === RETRY_CONFIG.maxRetries ||
        error instanceof DOMException && error.name === 'AbortError'
      ) {
        throw new Error(
          `翻译服务异常 (已重试${retry}次): ${lastError.message}`
        );
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, getRetryDelay(retry)));
      console.log(`Retrying... (${retry + 1}/${RETRY_CONFIG.maxRetries})`);
    }
  }

  throw lastError;
} 