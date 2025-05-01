import { TranslateBody } from '@/types/types';
// 修改：同时引入类型
import { OpenAIStream, OpenAIStreamOptions } from '@/utils';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode } =
      (await req.json()) as TranslateBody;

    // 从环境变量读取
    const options: OpenAIStreamOptions = {
      baseUrl: process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL!,
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL!,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
      inputLanguage,
      outputLanguage,
      inputCode,
    };

    // 直接返回原始流，客户端负责拆分和过滤
    const openaiStream = await OpenAIStream(options);
    return new Response(openaiStream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;