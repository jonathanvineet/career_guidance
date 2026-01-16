# 🎯 CareerGAIde - AI-Powered Job Recommendation System

An intelligent web application that helps job seekers find their perfect career match through resume analysis, skill extraction, and personality assessment.

## ✨ Features

- 📄 **Resume Parsing**: Upload your resume (PDF/DOC) and automatically extract skills
- 🤖 **AI-Powered Job Recommendations**: Get personalized job matches based on your skills using ML algorithms
- 🧠 **Personality Assessment**: Take a comprehensive personality quiz to understand your career preferences
- 🔍 **Similar Jobs Finder**: Discover related job opportunities based on specific skills
- 👤 **User Authentication**: Secure login and registration system
- 💼 **Job Search**: Browse and search through thousands of job listings

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Beautiful notifications
- **Anime.js** - Smooth animations

### Backend
- **Flask** - Python web framework
- **Pandas & NumPy** - Data processing
- **Scikit-learn** - Machine Learning (TF-IDF, Cosine Similarity)
- **spaCy** - Natural Language Processing for skill extraction
- **PyPDF2 & PyMuPDF** - PDF text extraction
- **Tesseract OCR** - Image-based PDF text extraction

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **Tesseract OCR** (for image-based PDFs)
- **Poppler** (for PDF to image conversion)

#### Install System Dependencies (macOS)
```bash
brew install tesseract
brew install poppler
```

#### Install System Dependencies (Ubuntu/Debian)
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install poppler-utils
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy English model:
```bash
python -m spacy download en_core_web_sm
```

5. Start the Flask server:
```bash
python main.py
```

Backend will run on: `http://127.0.0.1:8000`

### Frontend Setup

1. Install Node dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

## 📁 Project Structure

```
job_recommednation/
├── backend/
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
| `/login` | POST | User authentication |
| `/parse` | POST | Extract skills from resume |
| `/jobs` | POST | Get job recommendations |
| `/similar-jobs` | POST | Find similar jobs by skills |
| `/search-jobs` | POST | Search jobs by keyword |

## 🎯 How It Works

1. **Upload Resume**: Users upload their resume (PDF/DOC format)
2. **Skill Extraction**: The system uses spaCy NLP to identify and extract relevant skills
3. **Job Matching**: TF-IDF vectorization and cosine similarity calculate the best job matches
4. **Recommendations**: Top 10 most relevant jobs are displayed with missing skills highlighted
5. **Personality Test**: Optional quiz helps refine career preferences

## 🧪 Test Credentials

- **Email**: `test`
- **Password**: `test`

## 📊 Dataset

The system includes job listings from Indeed with:
- Job titles
- Company names
- Locations
- Required skills
- Job descriptions

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for helping people find their dream jobs
- ML algorithms powered by Scikit-learn
- NLP capabilities provided by spaCy

---

**Made with 💼 by CareerGAIde Team**
