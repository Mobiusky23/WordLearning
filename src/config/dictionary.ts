export const YOUDAO_API_CONFIG = {
  baseUrl: 'https://openapi.youdao.com/api',
  appKey: process.env.YOUDAO_APP_KEY,
  appSecret: process.env.YOUDAO_APP_SECRET,
};

export const SUPPORTED_LANGUAGES = {
  'en-zh': {
    from: 'en',
    to: 'zh-CHS',
  },
  'zh-en': {
    from: 'zh-CHS',
    to: 'en',
  },
} as const; 