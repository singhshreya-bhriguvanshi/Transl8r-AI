const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const os = require('os');

// Configure multer for file uploads
const upload = multer({
  dest: os.tmpdir(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow text files
    if (file.mimetype === 'text/plain' || 
        file.mimetype === 'text/html' || 
        file.mimetype === 'application/json' ||
        file.originalname.endsWith('.txt') ||
        file.originalname.endsWith('.html') ||
        file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only text files are allowed'), false);
    }
  }
});

// Mock translation function (replace with actual model integration)
const mockTranslate = async (text, sourceLang, targetLang) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock translation logic
  const mockTranslations = {
    'en-fr': {
      'hello': 'bonjour',
      'goodbye': 'au revoir',
      'thank you': 'merci',
      'how are you': 'comment allez-vous'
    },
    'fr-en': {
      'bonjour': 'hello',
      'au revoir': 'goodbye',
      'merci': 'thank you',
      'comment allez-vous': 'how are you'
    },
    'en-es': {
      'hello': 'hola',
      'goodbye': 'adiós',
      'thank you': 'gracias',
      'how are you': '¿cómo estás?'
    },
    'es-en': {
      'hola': 'hello',
      'adiós': 'goodbye',
      'gracias': 'thank you',
      '¿cómo estás?': 'how are you'
    }
  };

  const key = `${sourceLang}-${targetLang}`;
  const lowerText = text.toLowerCase();
  
  if (mockTranslations[key] && mockTranslations[key][lowerText]) {
    return mockTranslations[key][lowerText];
  }
  
  // Fallback: return text with language indicator
  return `[${targetLang.toUpperCase()}] ${text}`;
};

// POST /api/translation/translate
router.post('/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    const langPair = `${sourceLanguage}-${targetLanguage}`;
    // Call the Python FastAPI server
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8008';
    const response = await axios.post(`${pythonApiUrl}/translate/${langPair}`, { text });
    if (response.data.error) {
      return res.status(400).json({ error: response.data.error });
    }
    res.json({
      success: true,
      originalText: text,
      translatedText: response.data.translation,
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({ error: 'Translation failed', message: error.message });
  }
});

// GET /api/translation/history
router.get('/history', async (req, res) => {
  try {
    // Mock translation history (replace with database integration)
    const mockHistory = [
      {
        id: 1,
        originalText: 'Hello',
        translatedText: 'Bonjour',
        sourceLanguage: 'en',
        targetLanguage: 'fr',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        originalText: 'Thank you',
        translatedText: 'Gracias',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    res.json({
      success: true,
      history: mockHistory
    });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message
    });
  }
});

// File translation endpoint
router.post('/translate-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { sourceLanguage, targetLanguage } = req.body;
    if (!sourceLanguage || !targetLanguage) {
      return res.status(400).json({ error: 'Source and target languages are required' });
    }

    const langPair = `${sourceLanguage}-${targetLanguage}`;
    
    // Read the uploaded file
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);

    // Create form data for the FastAPI server
    const form = new FormData();
    form.append('file', Buffer.from(fileContent), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Send to FastAPI server
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8008';
    const response = await axios.post(
      `${pythonApiUrl}/translate-file/${langPair}`, 
      form, 
      { 
        responseType: 'stream',
        headers: {
          ...form.getHeaders(),
          'Content-Length': form.getLengthSync()
        }
      }
    );

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="translated_${req.file.originalname}"`);
    
    // Pipe the response from FastAPI to the client
    response.data.pipe(res);

  } catch (error) {
    console.error('File translation error:', error.message);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError.message);
      }
    }

    if (error.response) {
      // Error from FastAPI server
      res.status(error.response.status).json({ 
        error: 'File translation failed', 
        message: error.response.data?.error || error.message 
      });
    } else {
      res.status(500).json({ 
        error: 'File translation failed', 
        message: error.message 
      });
    }
  }
});

module.exports = router; 