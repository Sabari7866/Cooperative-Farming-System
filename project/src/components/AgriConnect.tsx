import React, { useState } from 'react';
import Icon from './Icon';
import toast from 'react-hot-toast';

export default function AgriConnect() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Ravi Kumar',
            title: 'Dealing with late blight in tomatoes',
            content: 'Has anyone tried any effective organic solutions for late blight? Due to the recent unseasonal rains, my half-acre plot is showing early signs.',
            category: 'pest_control',
            upvotes: 24,
            replies: 5,
            time: '2 hours ago'
        },
        {
            id: 2,
            author: 'Suresh Menon',
            title: 'Subsidies for drip irrigation in Tamil Nadu',
            content: 'I recently applied for the PMKSY subsidy for micro-irrigation. The process took about 3 weeks. If you need help with the documentation, let me know!',
            category: 'finance',
            upvotes: 45,
            replies: 12,
            time: '5 hours ago'
        },
        {
            id: 3,
            author: 'Lakshmi Agro Farms',
            title: 'Best companion crops for Sugarcane?',
            content: 'Planning my next sugarcane cycle. What are the best short-duration companion crops to maximize yield without competing for nutrients?',
            category: 'best_practices',
            upvotes: 18,
            replies: 8,
            time: '1 day ago'
        }
    ]);

    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) {
            toast.error('Please enter both title and content.');
            return;
        }

        const post = {
            id: Date.now(),
            author: 'You (Farmer)',
            title: newPost.title,
            content: newPost.content,
            category: newPost.category,
            upvotes: 0,
            replies: 0,
            time: 'Just now'
        };

        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '', category: 'general' });
        setIsPosting(false);
        toast.success('Your discussion was posted successfully!');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
                        <Icon name="Users" className="h-7 w-7 text-emerald-600" />
                        உழவன் Connect Forum
                    </h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Community Knowledge Hub</p>
                </div>
                <button
                    onClick={() => setIsPosting(!isPosting)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg transition-colors flex items-center gap-2"
                >
                    <Icon name="Plus" className="h-4 w-4" />
                    {isPosting ? 'Cancel Post' : 'Start Discussion'}
                </button>
            </div>

            {/* Create Post Area */}
            {isPosting && (
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 animate-fadeIn">
                    <h3 className="text-lg font-black text-slate-900 mb-4 uppercase">Create New Discussion</h3>
                    <form onSubmit={handlePost} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Discussion Title..."
                                value={newPost.title}
                                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={newPost.category}
                                onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                            >
                                <option value="general">General Farming</option>
                                <option value="pest_control">Pest & Diseases</option>
                                <option value="finance">Finance & Subsidies</option>
                                <option value="best_practices">Best Practices</option>
                            </select>
                        </div>
                        <div>
                            <textarea
                                placeholder="Describe your question or insight in detail..."
                                rows={4}
                                value={newPost.content}
                                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors">
                                Publish Post
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 pb-4 overflow-x-auto custom-scrollbar">
                {['All Topics', 'Pest Control', 'Finance', 'Best Practices', 'Markets'].map((tag, i) => (
                    <button key={i} className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] whitespace-nowrap transition-colors ${i === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        {tag}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <span className="text-emerald-700 font-black text-xs">{post.author.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">{post.author}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-400 text-xs font-semibold">{post.time}</span>
                                    <span className="ml-auto bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{post.category.replace('_', ' ')}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed mb-4 line-clamp-2">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-sm">
                                        <Icon name="ArrowUpCircle" className="h-5 w-5" />
                                        {post.upvotes}
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm">
                                        <Icon name="MessageSquare" className="h-5 w-5" />
                                        {post.replies} Replies
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm ml-auto">
                                        <Icon name="Share2" className="h-4 w-4" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
