const express = require('express');
const router = express.Router();

// Available languages for translation
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' }
];

// GET /api/languages
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      languages: availableLanguages,
      count: availableLanguages.length
    });
  } catch (error) {
    console.error('Languages error:', error);
    res.status(500).json({
      error: 'Failed to fetch languages',
      message: error.message
    });
  }
});

// GET /api/languages/:code
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    const language = availableLanguages.find(lang => lang.code === code);
    
    if (!language) {
      return res.status(404).json({
        error: 'Language not found',
        code: code
      });
    }

    res.json({
      success: true,
      language: language
    });
  } catch (error) {
    console.error('Language error:', error);
    res.status(500).json({
      error: 'Failed to fetch language',
      message: error.message
    });
  }
});

module.exports = router; 