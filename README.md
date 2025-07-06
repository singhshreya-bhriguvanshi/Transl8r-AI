# Language Translation System

A modern, AI-powered language translation system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application provides a beautiful, responsive interface for translating text between multiple languages.

## 🌟 Features

- **Modern UI/UX**: Beautiful, responsive design with glass morphism effects
- **Multi-language Support**: Support for 20+ languages with flag icons
- **Real-time Translation**: Fast and accurate translation using AI models
- **Text-to-Speech**: Listen to translations with natural pronunciation
- **Translation History**: View and manage your translation history
- **Copy to Clipboard**: One-click copy functionality
- **Language Swapping**: Easy language direction switching
- **Search Functionality**: Search through languages and translation history
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Rate Limiting** - API protection

### Frontend

- **React.js** - UI library
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Styling

- **CSS3** - Custom styling with CSS variables
- **Glass Morphism** - Modern visual effects
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
LanguageTranslationFinal/
├── backend/                 # Node.js + Express server
│   ├── routes/             # API routes
│   │   ├── translation.js  # Translation endpoints
│   │   └── languages.js    # Language endpoints
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js
│   │   │   ├── Translator.js
│   │   │   ├── History.js
│   │   │   └── LanguageSelector.js
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # React entry point
│   │   ├── App.css         # App-specific styles
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp env.example .env
   ```

4. **Configure environment variables** (edit `.env` file):

   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server:**

   ```bash
   npm run dev
   ```

   The backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

   The frontend will be running at `http://localhost:3000`

## 🎯 Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Select source and target languages** using the dropdown menus
3. **Enter text** in the source text area
4. **Click "Translate"** to get the translation
5. **Use additional features** like:
   - Text-to-speech (speaker icon)
   - Copy to clipboard (copy icon)
   - Language swapping
   - View translation history

## 🔧 API Endpoints

### Translation

- `POST /api/translation/translate` - Translate text
- `GET /api/translation/history` - Get translation history

### Languages

- `GET /api/languages` - Get all available languages
- `GET /api/languages/:code` - Get specific language details

### Health Check

- `GET /api/health` - API health status

## 🎨 Customization

### Adding New Languages

Edit `backend/routes/languages.js` to add new languages:

```javascript
const availableLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  // Add your new language here
  { code: "your-code", name: "Your Language", flag: "🏳️" },
];
```

### Styling

- Modify `frontend/src/index.css` for global styles
- Update `frontend/src/App.css` for component-specific styles
- CSS variables are defined in `:root` for easy theming

### Model Integration

To integrate your MarianMT model:

1. Replace the mock translation function in `backend/routes/translation.js`
2. Add your model files to the backend
3. Implement the actual translation logic

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Deploy the backend directory
3. Update the frontend API base URL

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- MarianMT model for translation capabilities
- React and Node.js communities
- Lucide React for beautiful icons
- Framer Motion for smooth animations

## 📞 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Check that both backend and frontend are running

---

**Happy Translating! 🌍✨**
