import { CodeBlock } from '@/components/CodeBlock'; 
import { LanguageSelect, languages } from '@/components/LanguageSelect'; 
import { TextBlock } from '@/components/TextBlock'; 
import { FileUploader } from '@/components/FileUploader'; 
import { TranslateBody } from '@/types/types'; 
import Head from 'next/head'; 
import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/router';

export default function Home() { 
  const [inputLanguage, setInputLanguage] = useState<string>('自然语言'); 
  const [outputLanguage, setOutputLanguage] = useState<string>('Python'); 
  const [inputCode, setInputCode] = useState<string>(''); 
  const [outputCode, setOutputCode] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [hasTranslated, setHasTranslated] = useState<boolean>(false); 
  // 收集think标签中的思考内容 
  const [thoughtProcess, setThoughtProcess] = useState<string>(''); 
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false); 
  const router = useRouter();
  const handleTranslate = async () => { 
    try {
      // 初始化状态
      setThoughtProcess(''); 
      setOutputCode('');
      setHasTranslated(false);
      setLoading(true);

      const maxCodeLength = 16000; 
      
      // 输入验证
      if (inputLanguage === outputLanguage) { 
        alert('请选择一个不同的编程语言.'); 
        return; 
      } 
      if (!inputCode) { 
        alert('请输入一些代码.'); 
        return; 
      } 
      if (inputCode.length > maxCodeLength) { 
        alert(`请输入不超过 ${maxCodeLength} 个字符，当前您已经输入了 ${inputCode.length} 个字符.`); 
        return; 
      } 

      // 创建请求
      const body: TranslateBody = { 
        inputLanguage, 
        outputLanguage, 
        inputCode 
      }; 

      // 发送请求
      const response = await fetch('/api/translate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body), 
      }); 
      
      if (!response.ok) { 
        throw new Error('请检查base_url,需要是.../chat/completions/终结点');
      } 

      const responseText = await response.text();
      
      try {
        const result = JSON.parse(responseText);
        if (result.thought) {
          setThoughtProcess(result.thought);
        }
        if (result.code) {
          setOutputCode(result.code);
          copyToClipboard(result.code);
        }
        setHasTranslated(true);
      } catch (e) {
        console.error('解析响应失败:', e);
        throw new Error('无法解析服务器响应');
      }

    } catch (error) {
      console.error('转译错误:', error);
      alert(error instanceof Error ? error.message : '转译过程中发生错误，请重试');
    } finally {
      setLoading(false);
    }
  }; 
  const copyToClipboard = (text: string) => { 
    const el = document.createElement('textarea'); 
    el.value = text; 
    document.body.appendChild(el); 
    el.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(el); 
  }; 
  useEffect(() => { 
    if (outputLanguage) {
      // 只在语言改变时重置状态
      setOutputCode('');
      setThoughtProcess('');
      setHasTranslated(false);
      setLoading(false); // 确保加载状态被重置
    }
  }, [outputLanguage]); 

  const handleFileUploadComplete = (files: File[]) => {
    console.log('文件上传完成:', files);
    // 这里可以添加处理上传完成后的逻辑
  };

  // 添加重置函数
  const handleReset = () => {
    setOutputCode('');
    setThoughtProcess('');
    setHasTranslated(false);
    setLoading(false);
  };

  return ( 
    <> 
      <Head> 
        <title>AI 代码生成工具</title> 
        <meta name="description" content="使用将代码从一种语言转换成另一种语言." /> 
        <meta name="viewport" content="width=device-width, initial-scale=1" /> 
        <meta name="keywords" content="AI Code Converter,Code Convert AI, Code Generate AI,Code Translator,AICodeHelper,free,online" /> 
        <link rel="canonical" href="https://code.ikiwi.com" /> 
        <link rel="icon" href="/code.png" /> 
      </Head> 
      <div style={{display:'flex', minHeight:'100vh', background:'#fff'}}> 
        {/* 侧边栏 */}
        <div style={{width:200, background:'#f5f5f5', borderRight:'1px solid #eee', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:32}}>
          <img src="/code.png" alt="ArkB Logo" style={{width:80, marginBottom:32}} />
          <button onClick={()=>router.push('/history')} style={{width:'80%', marginBottom:16, padding:'10px 0', borderRadius:8, border:'none', background:'#1976d2', color:'#fff', fontWeight:'bold', cursor:'pointer'}}>历史记录</button>
          <button onClick={()=>router.push('/profile')} style={{width:'80%', marginBottom:16, padding:'10px 0', borderRadius:8, border:'none', background:'#1976d2', color:'#fff', fontWeight:'bold', cursor:'pointer'}}>个人中心</button>
        </div>
        {/* 主内容区 */}
        <div style={{flex:1}}>
          <div className="h-100 flex justify-start items-center pl-10 pt-2 bg-white"> 
            <img className="w-50 h-50" alt="AICodeConverter" src="code.png" /> 
            <h1 className="text-black font-bold text-2xl"><span className="text-blue-500 ml-2"></span></h1> 
          </div> 
          <div className="flex h-full min-h-screen flex-col items-center bg-white px-4 pb-20 text-neutral-800 sm:px-10"> 
            <div className="mt-2 flex flex-col items-center justify-center sm:mt-1"> 
              <h2 className="text-4xl font-bold leading-[1.5] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-0">ArkBridge 方舟桥</h2> 
              <div className="mt-5 text-xl text-center leading-2">翻译并解释一种 <span className="text-blue-500 font-bold">编程语言</span> 或者 <span className="text-blue-500 font-bold">自然语言</span> 到 另一种 <span className="text-blue-500 font-bold">编程语言</span></div> 
            </div> 
            <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4"> 
              <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4"> 
                <div className="text-center text-xl font-bold">原始输入</div> 
                <LanguageSelect 
                  language={inputLanguage} 
                  onChange={(value) => { 
                    setInputLanguage(value); 
                    setHasTranslated(false); 
                  }} 
                /> 
                <div className="flex space-x-2 mb-2"> 
                  <button 
                    className={`px-4 py-2 rounded-md ${!showFileUpload ? 'bg-blue-500' : 'bg-gray-500'}`} 
                    onClick={() => setShowFileUpload(false)} 
                  > 
                    单文件模式 
                  </button> 
                  <button 
                    className={`px-4 py-2 rounded-md ${showFileUpload ? 'bg-blue-500' : 'bg-gray-500'}`} 
                    onClick={() => setShowFileUpload(true)} 
                  > 
                    工程模式 
                  </button> 
                </div> 
                {showFileUpload ? ( 
                  <FileUploader 
                    inputLanguage={inputLanguage} 
                    outputLanguage={outputLanguage} 
                    onUploadComplete={handleFileUploadComplete} 
                  /> 
                ) : ( 
                  <> 
                    {inputLanguage === '自然语言' ? ( 
                      <TextBlock 
                        text={inputCode} 
                        editable={!loading} 
                        onChange={(value) => { 
                          setInputCode(value); 
                          setHasTranslated(false); 
                        }} 
                      /> 
                    ) : ( 
                      <CodeBlock 
                        code={inputCode} 
                        editable={!loading} 
                        onChange={(value) => { 
                          setInputCode(value); 
                          setHasTranslated(false); 
                        }} 
                      /> 
                    )} 
                  </> 
                )} 
              </div> 
              <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4"> 
                <div className="text-center text-xl font-bold">转换后的语言</div> 
                <LanguageSelect 
                  language={outputLanguage} 
                  onChange={(value) => { 
                    setOutputLanguage(value); 
                    setOutputCode(''); 
                  }} 
                /> 
                {( 
                  <TextBlock text={outputCode} /> 
                ) } 
                {/* 可折叠的思考过程区域 */}
                <details className="mt-4 w-full max-w-[1200px] text-left bg-[#1f2937] p-3 rounded"> 
                  <summary className="cursor-pointer text-blue-400">代码释意</summary> 
                  <div className="mt-2 p-4 bg-[#1f2937] rounded">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300"> 
                      {thoughtProcess || '暂无代码释意'} 
                    </pre>
                  </div>
                </details>
              </div> 
            </div> 
            <div className="mt-5 text-center text-sm"> 
              {loading 
                ? '别着急，我们的模型正在为您转译'// Generating 
                : hasTranslated 
                  ? '复制到剪贴板!' 
                  : '选择语言类型并输入自然语言文字或者代码，然后点击 "转译" 按钮'} 
            </div> 
            <div className="mt-5 flex items-center space-x-2"> 
              <button 
                className="w-[140px] cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600 active:bg-blue-700" 
                onClick={() => handleTranslate()} 
                disabled={loading} 
              > 
                {loading ? '转译中...' : '转译'} 
              </button>
              {hasTranslated && (
                <button 
                  className="w-[140px] cursor-pointer rounded-md bg-gray-500 px-4 py-2 font-bold hover:bg-gray-600 active:bg-gray-700"
                  onClick={handleReset}
                >
                  重新转译
                </button>
              )}
            </div> 
          </div> 
        </div>
      </div>
    </> 
  ); 
} 