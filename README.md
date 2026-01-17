# 🎯 CareerGAIde - AI-Powered Job Recommendation System

An intelligent, full-stack web application that helps job seekers find their perfect career match through AI-powered resume analysis, skill extraction, and personality assessment. Built with React and Flask, featuring Supabase authentication and a responsive mobile-first design.

## ✨ Features

- 🔐 **Supabase Authentication**: Secure sign up, sign in, and session management
- 📄 **Resume Parsing**: Upload your resume (PDF/DOC) and automatically extract skills using OCR and NLP
- 🤖 **AI-Powered Job Recommendations**: Get personalized job matches using TF-IDF and Cosine Similarity algorithms
- 🧠 **Personality Assessment**: Take a comprehensive personality quiz to understand your career preferences
- 🔍 **Similar Jobs Finder**: Discover related job opportunities based on specific skills
- 📱 **Fully Responsive**: Mobile-first design that works seamlessly on all devices
- 💼 **Job Search**: Browse and search through thousands of job listings

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Supabase Client** - Authentication and database
- **Styled Components** - CSS-in-JS for quiz components
- **React Hot Toast** - Beautiful notifications
- **Anime.js** - Smooth animations
- **React Icons** - Icon library

### Backend
- **Flask 3** - Python web framework with CORS support
- **Pandas & NumPy** - Data processing and analysis
- **Scikit-learn** - Machine Learning (TF-IDF, Cosine Similarity)
- **PyPDF2 & PyMuPDF** - PDF text extraction
- **Tesseract OCR** - Image-based PDF text extraction
- **OpenCV** - Image preprocessing

### Database & Auth
- **Supabase** - PostgreSQL database and authentication service

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python 3.11** (recommended for compatibility) - [Download](https://www.python.org/)
- **Supabase Account** - [Sign up](https://supabase.com/)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/jonathanvineet/career_guidance.git
cd career_guidance
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Python virtual environment**:
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

4. **Configure Supabase**:
   - Create a project at [supabase.com](https://app.supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   - Add your credentials to `.env`:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the application**:
```bash
npm start
```

This will start both:
- **Frontend**: http://localhost:3000
- **Backend**: http://127.0.0.1:8000

## 📖 Detailed Setup Guide

For detailed setup instructions, see:
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Complete Supabase configuration guide
- [COMPLETE_SETUP.md](COMPLETE_SETUP.md) - Comprehensive setup documentation

## 📁 Project Structure

```
career_guidance/
├── backend/
│   ├── main.py                 # Flask API server
│   ├── job_recommender.py      # ML recommendation engine
│   ├── skills_extraction.py    # Resume parsing & skill extraction
│   ├── requirements.txt        # Python dependencies
│   ├── venv/                   # Virtual environment
│   └── data/                   # Job listings and skills data
├── src/
│   ├── Components/             # React components
│   │   ├── Logincard.js       # Login form with Supabase
│   │   ├── RegisterCard.js    # Registration form
│   │   └── quiz_components/   # Personality quiz components
│   ├── Pages/                  # Page components
│   │   ├── Home.js            # Landing page
│   │   ├── ResumeParse.js     # Resume upload page
│   │   ├── JobSearch.js       # Job listings page
│   │   └── Quiz.js            # Personality assessment
│   ├── contexts/              # React contexts
│   │   └── AuthContext.js     # Authentication state management
│   ├── Layout/                # Layout components
│   │   └── Header.js          # Navigation header
│   └── supabaseClient.js      # Supabase configuration
├── public/                     # Static files
├── .env                        # Environment variables (create this)
├── package.json               # Node dependencies
└── README.md                  # This file
```
│   ├── main.py                 # Flask API server
│   ├── job_recommender.py      # ML recommendation engine
│   ├── skills_extraction.py    # Resume parsing & skill extraction
│   ├── requirements.txt        # Python dependencies
│   └── data/
│       ├── final_jobs.csv      # Jobs database
│       ├── skills.csv          # Skills dictionary
│       └── ...
├── src/
│   ├── App.js                  # Main React component
│   ├── Pages/                  # Page components
│   │   ├── Home.js
│   │   ├── ResumeParse.js
│   │   ├── JobSearch.js
│   │   ├── Quiz.js
│   │   └── ...
│   ├── Components/             # Reusable UI components
│   ├── Layout/                 # Layout components
│   └── Constants/              # App constants
├── public/
│   └── index.html             # HTML entry point
└── package.json               # Node dependencies
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | User authentication (legacy) |
| `/parse` | POST | Extract skills from resume PDF |
| `/jobs` | POST | Get AI job recommendations based on skills |
| `/similar-jobs` | POST | Find similar jobs by skill set |
| `/search-jobs` | POST | Search jobs by keyword |

## 🎯 How It Works

1. **Sign Up/Sign In**: Create an account or log in with Supabase authentication
2. **Upload Resume**: Users upload their resume (PDF format)
3. **Skill Extraction**: The system uses NLP and OCR to identify and extract relevant skills
4. **Job Matching**: TF-IDF vectorization and cosine similarity calculate the best job matches
5. **Recommendations**: Top 10 most relevant jobs are displayed with match scores
6. **Personality Test**: Optional quiz helps refine career preferences and understand work style

## 🚀 Usage

### Running the Application

```bash
# Start both frontend and backend together
npm start
```

### Individual Commands

```bash
# Start only frontend
npm run start:frontend

# Start only backend  
npm run start:backend
```

### Building for Production

```bash
npm run build
```

## 🔐 Authentication

The app uses Supabase for authentication:
- Email/password sign up with email verification
- Secure session management
- Automatic token refresh
- Password reset capability

Create an account or use the demo features to explore the application.

## 📊 Dataset

The system includes real job listings scraped from Indeed with:
- 5000+ job postings
- Job titles and descriptions
- Company names and locations
- Required skills and qualifications
- Salary information (where available)

Data files located in `backend/data/`:
- `final_jobs.csv` - Main job listings database
- `skills.csv` - Skills dictionary for extraction

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.11 is installed: `python3.11 --version`
- Activate virtual environment: `source backend/venv/bin/activate`
- Reinstall dependencies: `pip install -r backend/requirements.txt`

### Frontend shows Supabase error
- Check `.env` file exists and has correct credentials
- Restart dev server: Stop and run `npm start` again
- Verify Supabase project is active at [app.supabase.com](https://app.supabase.com)

### Resume upload fails
- Ensure backend is running on port 8000
- Check file is PDF format
- Verify backend logs for errors

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for helping people find their dream jobs
- ML algorithms powered by Scikit-learn
- Authentication by Supabase
- UI inspired by modern design trends

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Made with 💼 by CareerGAIde Team**
