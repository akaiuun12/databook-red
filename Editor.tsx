
import React, { useState } from 'react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleAiDraft = async () => {
    if (!title) return alert('Enter a title/topic first for the AI to work with.');
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Write a high-quality technical blog post in Markdown about "${title}". Include code examples.`,
      });
      if (response.text) setContent(response.text);
    } catch (err) {
      console.error(err);
      alert('AI generation failed. Check your API key or network.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title || !content) return alert('Title and Content are required.');
    onSave({
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            {initialPost ? 'Edit Article' : 'New Publication'}
          </h2>
          <p className="text-slate-500 mt-1">Compose your thoughts in Markdown.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition font-medium">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition">Publish Now</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="relative group">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Article Title..."
            />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('write')}
                className={`text-sm font-bold uppercase tracking-widest pb-2 transition border-b-2 ${activeTab === 'write' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Editor
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`text-sm font-bold uppercase tracking-widest pb-2 transition border-b-2 ${activeTab === 'preview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                Live Preview
              </button>
            </div>
            <button 
              onClick={handleAiDraft}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold border border-blue-500/20 disabled:opacity-50 transition"
            >
              <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{isGenerating ? 'Writing Draft...' : 'Gemini AI Draft'}</span>
            </button>
          </div>

          {activeTab === 'write' ? (
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] bg-slate-900/30 border border-slate-800 rounded-2xl px-6 py-6 text-slate-300 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-900 transition resize-none leading-relaxed"
              placeholder="Start your story with Markdown..."
            />
          ) : (
            <div className="min-h-[600px] bg-slate-900/20 border border-slate-800 rounded-2xl p-10 overflow-y-auto">
              {content ? <MarkdownRenderer content={content} /> : <p className="text-slate-600 italic text-center py-20">Nothing to preview yet.</p>}
            </div>
          )}

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Category Tags</label>
            <input 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="e.g. React, TypeScript, AI Engineering (comma separated)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
