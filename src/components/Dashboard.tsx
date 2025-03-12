import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookMarked, 
  Share2, 
  Check, 
  Newspaper, 
  LogOut,
  Search,
  Plus,
  X
} from 'lucide-react';
import { useSignOut } from '@nhost/react'
import { useAuthStore } from '../store/authStore';

const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    summary: "New developments in artificial intelligence are revolutionizing medical diagnosis and treatment planning...",
    source: "Tech Health Journal",
    sentiment: "positive",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    summary: "World leaders have agreed to ambitious new targets for reducing carbon emissions...",
    source: "Environmental News",
    sentiment: "neutral",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&q=80&w=400"
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [topics, setTopics] = useState(['Technology', 'Climate']);
  const [newTopic, setNewTopic] = useState('');
  const [showTopicInput, setShowTopicInput] = useState(false);
  const { signOut } = useSignOut()
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

 
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
      setShowTopicInput(false);
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">NewsHub</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Topics</h2>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div key={topic} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span>{topic}</span>
                    <button
                      onClick={() => removeTopic(topic)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {showTopicInput ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded"
                      placeholder="Enter topic"
                    />
                    <button
                      onClick={addTopic}
                      className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTopicInput(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Topic
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Search</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search articles..."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              {SAMPLE_ARTICLES.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{article.source}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.sentiment}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.summary}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-600 hover:text-indigo-600">
                        <BookMarked className="h-5 w-5 mr-1" />
                        Save
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-indigo-600">
                        <Share2 className="h-5 w-5 mr-1" />
                        Share
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-indigo-600">
                        <Check className="h-5 w-5 mr-1" />
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}