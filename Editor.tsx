
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import MarkdownRenderer from './MarkdownRenderer';
import { Post } from './types';

interface EditorProps {
  onSave: (post: Partial<Post>) => void;
  onCancel: () => void;
  initialPost?: Post;
}

const Editor: React.FC<EditorProps> = ({ onSave, onCancel, initialPost }) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [tags, setTags] = useState(initialPost?.tags.join(', ') || '');
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState<'split' | 'write'>('split');

  const handleAiDraft = async () => {
    if (!title) return alert('Enter a title/topic first for the AI to work with.');
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Write a professional, deep technical blog post in Markdown format about "${title}". 
        Include:
        - A high-level introduction
        - Sub-sections with headers (##)
        - Relevant code examples if applicable
        - A summary conclusion
        Focus on architectural clarity and best practices.`,
      });
      if (response.text) setContent(response.text);
    } catch (err) {
      console.error(err);
      alert('AI Generation failed. Check your API key or connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiRefine = async () => {
    if (!content) return alert('Write some content first to refine.');
    setIsRefining(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `As a senior technical editor, refine the following technical content to be more precise, grammatically correct, and engaging, while preserving its Markdown structure. CONTENT:\n\n${content}`,
      });
      if (response.text) setContent(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!title) return alert('Enter a title first for the AI image generator.');
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A cinematic, abstract, high-tech background image for a blog post titled "${title}". Use deep obsidian, slate, and vibrant red accents. Futuristic architectural style, clean lines, no text.`,
            },
          ],
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setCoverImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
      alert('Image generation failed.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = () => {
    if (!title || !content) return alert('Title and Content are required.');
    onSave({
      title,
      content,
      coverImage: coverImage || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readingTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="h-20 flex-shrink-0 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-10 bg-white/50 dark:bg-black/50 backdrop-blur-xl z-30">
        <div className="flex items-center space-x-6">
          <h2 className="text-xl font-black tracking-tighter">Studio</h2>
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={() => setPreviewMode('write')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition ${previewMode === 'write' ? 'bg-white dark:bg-slate-700 shadow-sm text-red-600' : 'text-slate-500'}`}>Write</button>
            <button onClick={() => setPreviewMode('split')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition ${previewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-red-600' : 'text-slate-500'}`}>Split</button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleAiDraft} disabled={isGenerating} className="flex items-center space-x-2 bg-red-600/10 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition">
            <svg className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>Draft AI</span>
          </button>
          <button onClick={onCancel} className="px-6 py-2 rounded-xl text-slate-500 hover:text-red-600 transition font-black uppercase text-[10px] tracking-widest">Discard</button>
          <button onClick={handleSave} className="px-8 py-2.5 rounded-xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-xl shadow-red-900/20 transition">Publish</button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <div className={`${previewMode === 'write' ? 'w-full' : 'w-1/2'} h-full flex flex-col border-r border-black/5 dark:border-white/5 custom-scrollbar overflow-y-auto`}>
          <div className="p-12 space-y-8 max-w-4xl mx-auto w-full">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-5xl font-black focus:outline-none placeholder:opacity-20 tracking-tighter"
              placeholder="Entry Title..."
            />
            <div className="flex items-center space-x-4">
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-slate-500/5 px-4 py-2 rounded-lg text-xs font-bold focus:outline-none" placeholder="Tags (comma separated)..." />
              <button onClick={handleGenerateCover} className="p-2 hover:bg-red-600/10 rounded-lg text-red-600 transition"><svg className={`w-5 h-5 ${isGeneratingImage ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
            </div>
            {coverImage && <img src={coverImage} className="w-full h-48 object-cover rounded-2xl border border-red-500/10" />}
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[500px] bg-transparent font-mono text-sm focus:outline-none resize-none leading-relaxed"
              placeholder="System ready. Start writing in Markdown..."
            />
          </div>
        </div>

        {previewMode === 'split' && (
          <div className="w-1/2 h-full bg-white dark:bg-black overflow-y-auto custom-scrollbar p-20">
            <div className="max-w-2xl mx-auto opacity-90">
              <MarkdownRenderer content={`# ${title || 'Entry Preview'}\n\n${content}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
