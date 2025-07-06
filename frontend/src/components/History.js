import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Volume2, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch translation history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const response = await axios.get(`${apiUrl}/api/translation/history`);
        setHistory(response.data.history);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load translation history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter history based on search
  const filteredHistory = history.filter(item =>
    item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sourceLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.targetLanguage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle copy to clipboard
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle text-to-speech
  const handleSpeak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get language name from code
  const getLanguageName = (code) => {
    const languageMap = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };
    return languageMap[code] || code.toUpperCase();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="loading-spinner mr-3"></div>
          <span className="text-white">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Translation History
          </h1>
          <p className="text-white text-opacity-80">
            View your recent translations and access them anytime
          </p>
        </div>

        {/* Search Bar */}
        <div className="card p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(`${item.originalText}\n\n${item.translatedText}`)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy both texts"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Translation Content */}
                <div className="grid grid-2 gap-4">
                  {/* Original Text */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-600">Original Text</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSpeak(item.originalText, item.sourceLanguage)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Listen"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopy(item.originalText)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {item.originalText}
                      </p>
                    </div>
                  </div>

                  {/* Translated Text */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-600">Translation</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSpeak(item.translatedText, item.targetLanguage)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Listen"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopy(item.translatedText)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {item.translatedText}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="card p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No translations found' : 'No translation history yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start translating text to see your history here'
              }
            </p>
          </motion.div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <motion.div
            className="mt-8 card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{history.length}</div>
                <div className="text-sm text-gray-600">Total Translations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {new Set(history.map(item => item.sourceLanguage)).size}
                </div>
                <div className="text-sm text-gray-600">Source Languages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(history.map(item => item.targetLanguage)).size}
                </div>
                <div className="text-sm text-gray-600">Target Languages</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default History; 