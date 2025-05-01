import endent from 'endent';

// 新增：定义 OpenAIStreamOptions 类型
export interface OpenAIStreamOptions {
  baseUrl: string;
  model: string;
  apiKey: string;
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
}

const createPrompt = (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
) => {
  // 新增：提示模型使用<think>标签包裹思考过程，然后输出最终代码
  const thinkInstruction = '在你的回复中，请先将思考过程用 <think> 和 </think> 标签包裹，然后输出代码。代码部分请不要包含注释，直接输出可以运行的代码。';
  if (inputLanguage === '自然语言') {
    return endent`
    ${thinkInstruction}
    You are an expert programmer in all programming languages. Translate the natural language to "${outputLanguage}" code. Do not include \`\`\` or comments.

    Example translating from natural language to JavaScript:

    Natural language:
    打印数字从 0 到 9.

    JavaScript code:
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }

    Natural language:
    ${inputCode}

    ${outputLanguage} code (no \`\`\` and no comments):
    `;
  } else if (outputLanguage === '自然语言') {
    return endent`
      ${thinkInstruction}
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to natural language in plain Chinese Simplified that the average adult could understand. Respond as bullet points starting with -.

      Example translating from JavaScript to natural language:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Natural language:
      打印数字从 0 到 9.
      
      ${inputLanguage} code:
      ${inputCode}

      Natural language:
     `;
  } else {
    return endent`
      ${thinkInstruction}
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\` or comments.

      Example translating from JavaScript to Python:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }

      Python code:
      for i in range(10):
        print(i)

      ${inputLanguage} code:
      ${inputCode}

      ${outputLanguage} code (no \`\`\` and no comments):
     `;
  }
};

// 添加缓存
const cache = new Map<string, string>();

export const OpenAIStream = async (options: OpenAIStreamOptions) => {
  const { baseUrl, model, apiKey, inputLanguage, outputLanguage, inputCode } = options;
  
  // 生成缓存键
  const cacheKey = `${inputLanguage}-${outputLanguage}-${inputCode}`;
  
  // 检查缓存
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  const res = await fetch(baseUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: '你是一个专业的代码转换工具。请确保转换后的代码保持原有的功能和结构。同时，请保持代码的格式和注释。将思考过程放在<think>标签中。'
          },
          {
            role: 'user',
            content: createPrompt(inputLanguage, outputLanguage, inputCode)
          }
        ]
      },
      parameters: {
        temperature: 0.2,
        max_tokens: 4000,
        result_format: 'message'
      }
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('API请求失败:', errorText);
    throw new Error(`API请求失败: ${errorText}`);
  }

  const data = await res.json();
  const content = data.output?.choices?.[0]?.message?.content || '';

  // 处理响应内容
  const thinkMatch = content.match(/<think>(.*?)<\/think>/s);
  const thought = thinkMatch ? thinkMatch[1].trim() : '';
  const code = content.replace(/<think>.*?<\/think>/s, '').trim()
    .replace(/^```\w*\n?|\n?```$/g, '').trim();

  // 构造响应对象
  const response = JSON.stringify({
    thought,
    code
  });

  // 缓存响应
  cache.set(cacheKey, response);

  return response;
};
