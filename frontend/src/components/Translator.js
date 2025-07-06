import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Volume2, FileText, Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Translator = () => {
  // Tab state
  const [tab, setTab] = useState('text');

  // Text translation states
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // File translation states
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState('');
  const [translatedFileUrl, setTranslatedFileUrl] = useState('');

  // Handle text translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }
    setIsTranslating(true);
    setTranslatedText('');
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/translation/translate`, {
        text: sourceText,
        sourceLanguage: 'en',
        targetLanguage: 'fr',
      });
      setTranslatedText(response.data.translatedText);
      toast.success('Translation completed!');
    } catch (error) {
      toast.error('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

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
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranslatedFileUrl('');
    setFileStatus('');
  };

  // Handle file translation
  const handleFileTranslate = async () => {
    if (!file) {
      toast.error('Please select a .txt file');
      return;
    }
    if (!file.name.endsWith('.txt')) {
      toast.error('Only .txt files are supported');
      return;
    }
    setFileStatus('Translating...');
    setTranslatedFileUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sourceLanguage', 'en');
      formData.append('targetLanguage', 'fr');
      const apiUrl = process.env.REACT_APP_API_URL || '';
      // This endpoint should be implemented in your backend
      const response = await axios.post(`${apiUrl}/api/translation/translate-file`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Create a download link for the translated file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setTranslatedFileUrl(url);
      setFileStatus('Done');
      toast.success('File translated!');
    } catch (error) {
      setFileStatus('');
      toast.error('File translation failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab${tab === 'text' ? ' active' : ''}`}
            onClick={() => setTab('text')}
          >
            Text Translation
          </button>
          <button
            className={`tab${tab === 'file' ? ' active' : ''}`}
            onClick={() => setTab('file')}
          >
            File Translation
          </button>
        </div>

        {/* Text Translation Tab */}
        {tab === 'text' && (
          <div className="card p-8 fade-in">
            <div className="mb-6">
              <label className="block mb-2 font-medium">Enter Text</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="input textarea"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Type your English text here..."
                  rows={4}
                  disabled={isTranslating}
                  style={{ resize: 'vertical' }}
                />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleSpeak(sourceText, 'en-US')}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    title="Listen"
                    disabled={!sourceText}
                  >
                    <Volume2 size={20} />
                  </button>
                  <button
                    onClick={() => handleCopy(sourceText)}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    title="Copy"
                    disabled={!sourceText}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Translated Text</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="input textarea"
                  value={translatedText}
                  readOnly
                  placeholder="French translation will appear here"
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleSpeak(translatedText, 'fr-FR')}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    title="Listen"
                    disabled={!translatedText}
                  >
                    <Volume2 size={20} />
                  </button>
                  <button
                    onClick={() => handleCopy(translatedText)}
                    className="p-1 text-gray-400 hover:text-gray-200"
                    title="Copy"
                    disabled={!translatedText}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="btn btn-primary w-full text-lg"
              style={{ marginTop: 24 }}
            >
              {isTranslating ? (
                <>
                  <div className="loading-spinner"></div>
                  Translating...
                </>
              ) : (
                'Translate Text'
              )}
            </button>
          </div>
        )}

        {/* File Translation Tab */}
        {tab === 'file' && (
          <div className="card p-8 fade-in">
            <div className="mb-6">
              <label className="block mb-2 font-medium">Upload .txt File</label>
              <label className="btn btn-secondary cursor-pointer">
                <FileText className="w-5 h-5 mr-2" />
                {file ? file.name : 'Choose .txt File'}
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <button
              onClick={handleFileTranslate}
              disabled={!file || fileStatus === 'Translating...'}
              className="btn btn-primary w-full text-lg"
              style={{ marginTop: 24 }}
            >
              {fileStatus === 'Translating...' ? (
                <>
                  <div className="loading-spinner"></div>
                  Translating...
                </>
              ) : (
                'Translate File'
              )}
            </button>
            {fileStatus && fileStatus !== 'Translating...' && (
              <span className="block text-green-500 font-medium mt-4">{fileStatus}</span>
            )}
            {translatedFileUrl && (
              <a
                href={translatedFileUrl}
                download={`translated_${file.name}`}
                className="btn btn-secondary flex items-center gap-2 mt-4"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download className="w-4 h-4" />
                Download Translated File
              </a>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Translator; 