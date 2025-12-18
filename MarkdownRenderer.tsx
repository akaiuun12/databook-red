
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLang = '';

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.trim().slice(3);
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${index}`} className="my-6 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{codeLang || 'code'}</span>
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
              </div>
              <pre className="p-5 overflow-x-auto font-mono text-sm leading-relaxed text-blue-100">
                <code>{codeContent.join('\n')}</code>
              </pre>
            </div>
          );
          codeContent = [];
          codeLang = '';
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      const key = `line-${index}`;
      if (line.startsWith('# ')) {
        elements.push(<h1 key={key} className="text-4xl font-extrabold text-white mt-12 mb-6 tracking-tight">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={key} className="text-3xl font-bold text-slate-100 mt-10 mb-5 border-b border-slate-800 pb-2">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={key} className="text-2xl font-semibold text-slate-200 mt-8 mb-4">{line.slice(4)}</h3>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(<li key={key} className="ml-6 mb-2 list-disc text-slate-300">{line.slice(2)}</li>);
      } else if (line.match(/^\d+\. /)) {
        elements.push(<li key={key} className="ml-6 mb-2 list-decimal text-slate-300">{line.replace(/^\d+\. /, '')}</li>);
      } else if (line.trim() === '') {
        elements.push(<div key={key} className="h-4" />);
      } else {
        // Simple inline bold handling
        const bolded = line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-blue-400 font-bold">{part}</strong> : part);
        elements.push(<p key={key} className="mb-4 text-slate-300 leading-relaxed text-lg">{bolded}</p>);
      }
    });

    return elements;
  };

  return <div className="max-w-none">{parseMarkdown(content)}</div>;
};

export default MarkdownRenderer;
