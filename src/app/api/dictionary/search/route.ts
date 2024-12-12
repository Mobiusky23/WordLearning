import { NextResponse } from 'next/server';
import { translateWord } from '@/lib/dictionary';
import { SUPPORTED_LANGUAGES } from '@/config/dictionary';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') as keyof typeof SUPPORTED_LANGUAGES;

    if (!query) {
      return NextResponse.json(
        { error: '请输入要查询的内容' },
        { status: 400 }
      );
    }

    if (!lang || !SUPPORTED_LANGUAGES[lang]) {
      return NextResponse.json(
        { error: '不支持的语言类型' },
        { status: 400 }
      );
    }

    const { from, to } = SUPPORTED_LANGUAGES[lang];
    const result = await translateWord(query, from, to);

    // 转换为统一的数据格式
    return NextResponse.json({
      word: query,
      phonetic: result.basic?.phonetic,
      meanings: [
        {
          partOfSpeech: '',
          definitions: [
            // 优先使用翻译结果，如果没有则使用基本释义
            ...(result.translation || []).map((trans: string) => ({
              definition: trans,
            })),
            ...(result.basic?.explains || []).map((explain: string) => ({
              definition: explain,
            })),
          ],
        },
      ],
      extra: {
        webTranslation: result.web?.map((item: any) => ({
          key: item.key,
          value: item.value,
        })),
        pronunciation: {
          uk: result.basic?.['uk-speech'],
          us: result.basic?.['us-speech'],
        },
      },
    });
  } catch (error) {
    console.error('Dictionary API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务异常' },
      { status: 500 }
    );
  }
} 