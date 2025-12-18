
import React, { useState, useMemo } from 'react';
import { Post, ViewState } from './types';
import Editor from './Editor';
import MarkdownRenderer from './MarkdownRenderer';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Rise of AI-Native Applications',
    slug: 'ai-native-apps',
    excerpt: 'How language models are shifting the paradigm from rigid UI flows to dynamic, intent-based experiences.',
    content: `# AI-Native Applications\n\nThe software landscape is undergoing a massive shift. We're moving from user interfaces where humans learn where buttons are, to interfaces that learn what the human wants.\n\n## Key Concepts\n- **Intent Detection**: Understanding what the user actually wants to achieve.\n- **Dynamic Generation**: Creating UI components on the fly.\n- **Zero Latency**: Using Flash models for real-time interaction.\n\n\`\`\`typescript\n// Example of intent-based routing\nconst action = await gemini.classify(userInput);\nexecuteAction(action);\n\`\`\`\n\nStay tuned for more!`,
    publishedAt: 'May 12, 2024',
    tags: ['AI', 'Product', 'UX'],
    author: {
      name: 'Elena Vance',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      role: 'Head of Engineering'
    },
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000',
    readingTime: '6 min read'
  },
  {
    id: '2',
    title: 'Modern State Management with React',
    slug: 'modern-state-react',
    excerpt: 'Zustand vs Jotai vs Redux Toolkit: Which one should you choose for your next enterprise project?',
    content: `# State Management in 2024\n\nChoosing the right state management tool is critical for maintainability.\n\n## Comparison\n1. **Zustand**: Simple, fast, and hook-based.\n2. **Jotai**: Atomic state for high-performance needs.\n3. **Signals**: The newcomer making waves in reactivity.\n\n### Code Example\n\`\`\`javascript\nimport { create } from 'zustand';\n\nconst useStore = create((set) => ({\n  bears: 0,\n  increase: () => set((state) => ({ bears: state.bears + 1 })),\n}));\n\`\`\`\n\nWhich one do you prefer?`,
    publishedAt: 'April 28, 2024',
    tags: ['React', 'Performance'],
    author: {
      name: 'Mark Jurik',
      avatar: 'https://i.pravatar.cc/150?u=mark',
      role: 'Staff Engineer'
    },
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2000',
    readingTime: '4 min read'
  }
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [view, setView] = useState<ViewState>('feed');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [search, setSearch] = useState('');

  const filteredPosts = useMemo(() => 
    posts.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    ), [posts, search]
  );

  const handleSavePost = (data: Partial<Post>) => {
    const isNew = !currentPost;
    const newPost: Post = {
      id: currentPost?.id || Math.random().toString(36).substr(2, 9),
      slug: data.title?.toLowerCase().split(' ').join('-') || 'untitled',
      content: data.content || '',
      title: data.title || 'Untitled',
      excerpt: data.excerpt || data.content?.slice(0, 150) + '...' || '',
      tags: data.tags || [],
      publishedAt: data.publishedAt || new Date().toLocaleDateString(),
      readingTime: data.readingTime || '1 min read',
      author: {
        name: 'You (Guest)',
        avatar: 'https://i.pravatar.cc/150?u=you',
        role: 'Tech Enthusiast'
      },
      coverImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=2000`
    };

    if (isNew) {
      setPosts([newPost, ...posts]);
    } else {
      setPosts(posts.map(p => p.id === currentPost.id ? newPost : p));
    }
    setView('feed');
    setCurrentPost(null);
  };

  const deletePost = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this article forever?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div 
            onClick={() => { setView('feed'); setCurrentPost(null); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">DEVFLOW</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-12">
            <div className="relative w-full group">
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, tags, or authors..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900 transition-all"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button 
            onClick={() => { setView('editor'); setCurrentPost(null); }}
            className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 active:scale-95 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Draft Article</span>
          </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-grow">
        {view === 'feed' && (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-3xl">
                <h1 className="text-6xl font-black text-white tracking-tighter mb-6 leading-none">
                  Engineering <br/><span className="text-blue-500">Excellence.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Deep dives into software architecture, developer productivity, and the future of AI in engineering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map(post => (
                <article 
                  key={post.id}
                  onClick={() => { setCurrentPost(post); setView('post'); }}
                  className="group relative flex flex-col h-full bg-slate-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 hover:bg-slate-900/40 transition-all duration-500 cursor-pointer"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                      {post.tags.map(t => <span key={t} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{t}</span>)}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                      <span>{post.publishedAt}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span>{post.readingTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={post.author.avatar} className="w-9 h-9 rounded-2xl border border-white/10" />
                        <div>
                          <p className="text-sm font-bold text-slate-200">{post.author.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{post.author.role}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCurrentPost(post); setView('editor'); }}
                          className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={(e) => deletePost(e, post.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {view === 'post' && currentPost && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-[60vh] relative overflow-hidden">
              <img src={currentPost.coverImage} className="w-full h-full object-cover scale-105 blur-[2px] opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/80 to-slate-950" />
              <div className="absolute inset-0 flex items-center justify-center pt-20">
                <div className="max-w-4xl px-6 text-center">
                  <div className="flex justify-center space-x-2 mb-8">
                    {currentPost.tags.map(t => <span key={t} className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">{t}</span>)}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-8">{currentPost.title}</h1>
                  <div className="flex items-center justify-center space-x-4">
                    <img src={currentPost.author.avatar} className="w-14 h-14 rounded-[1.25rem] border-2 border-white/10" />
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">{currentPost.author.name}</p>
                      <p className="text-slate-400 text-sm font-medium">{currentPost.publishedAt} • {currentPost.readingTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-32 -mt-10 relative z-10">
              <div className="bg-slate-950 p-10 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl shadow-black/50">
                <MarkdownRenderer content={currentPost.content} />
              </div>
              
              <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center">
                <button onClick={() => setView('feed')} className="flex items-center space-x-3 text-slate-500 hover:text-white font-bold tracking-tight transition group">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  <span>Back to the flow</span>
                </button>
                <button onClick={() => setView('editor')} className="px-8 py-3 bg-slate-900 border border-white/10 rounded-2xl text-slate-200 font-bold hover:bg-slate-800 transition shadow-xl active:scale-95">Edit Post</button>
              </div>
            </div>
          </div>
        )}

        {view === 'editor' && (
          <Editor 
            initialPost={currentPost || undefined}
            onCancel={() => { setView('feed'); setCurrentPost(null); }}
            onSave={handleSavePost}
          />
        )}
      </main>

      <footer className="py-20 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center">
              <span className="font-black text-white">D</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">DEVFLOW</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-12">Built with passion for the developer community.</p>
          <div className="flex justify-center space-x-8 text-xs font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition">Github</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">Discord</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
