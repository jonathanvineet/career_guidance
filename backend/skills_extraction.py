import PyPDF2
import os
import csv
import fitz
from pdf2image import convert_from_path
import cv2
import numpy as np
import pytesseract
import re

# Read skills from CSV file
current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, 'data', 'skills.csv')

# Load skills from CSV
SKILLS_LIST = []
try:
    with open(file_path, 'r') as file:
        csv_reader = csv.reader(file)
        skills_row = next(csv_reader)
        SKILLS_LIST = [skill.strip().lower() for skill in skills_row]
except Exception as e:
    print(f"Warning: Could not load skills from CSV: {e}")
    # Fallback skills list
    SKILLS_LIST = [
        'python', 'java', 'javascript', 'c++', 'c#', 'sql', 'html', 'css',
        'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring',
        'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'git', 'jenkins',
        'mysql', 'mongodb', 'postgresql', 'oracle', 'redis', 'elasticsearch',
        'machine learning', 'deep learning', 'tensorflow', 'keras', 'pytorch',
        'numpy', 'pandas', 'scikit-learn', 'matplotlib', 'seaborn',
        'excel', 'tableau', 'power bi', 'looker',
        'agile', 'scrum', 'jira', 'confluence',
        'rest api', 'graphql', 'soap', 'microservices',
        'linux', 'windows', 'macos', 'unix',
        'communication', 'leadership', 'teamwork', 'problem solving',
        'project management', 'data analysis', 'business analysis'
    ]

# Function to classify the Resume type
def classifier(pdf_file):
    """Determine if PDF is text-based or image-based"""
    try:
        with open(pdf_file, "rb") as f:
            pdf = fitz.open(f)
            res = []
            for page in pdf:
                image_area = 0.0
                text_area = 0.0
                for b in page.get_text("blocks"):
                    if '<image:' in b[4]:
                        r = fitz.Rect(b[:4])
                        image_area = image_area + abs(r)
                    else:
                        r = fitz.Rect(b[:4])
                        text_area = text_area + abs(r)
                if image_area == 0.0 and text_area != 0.0:
                    res.append(1)
                if text_area == 0.0 and image_area != 0.0:
                    res.append(0)
            if 1 in res and 0 in res:
                return 'text'
            elif 1 in res:
                return 'text'
            else:
                return 'image'
    except Exception as e:
        print(f"Classifier error: {e}. Assuming text-based PDF")
        return 'text'

# Function to extract skills from text using keyword matching
def extract_skills(text):
    """Extract skills from text using keyword matching"""
    text_lower = text.lower()
    found_skills = set()
    
    # Search for skills in the text
    for skill in SKILLS_LIST:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill.title())
    
    return found_skills

# Function to extract text from text-PDF
def extract_text_from_pdf(file_path: str):
    """Extract text from text-based PDF"""
    try:
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text() or ''
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# Function to extract text from image-PDF
def extract_text_from_image(file_path: str):
    """Extract text from image-based PDF using OCR"""
    try:
        import platform
        if platform.system() == 'Windows':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        pages = convert_from_path(file_path, 350)
        extracted_text = []
        
        for page in pages:
            # Preprocess the image (deskew)
            preprocessed_image = deskew(np.array(page))
            
            # Extract text using OCR
            text = pytesseract.image_to_string(preprocessed_image).replace("\n", " ")
            extracted_text.append(text)
        
        return " ".join(extracted_text)
    except Exception as e:
        print(f"Error extracting text from image PDF: {e}")
        return ""

def deskew(image):
    """Deskew image for better OCR results"""
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray = cv2.bitwise_not(gray)
        coords = np.column_stack(np.where(gray > 0))
        if len(coords) == 0:
            return image
        
        angle = cv2.minAreaRect(coords)[-1]
        
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated
    except Exception as e:
        print(f"Error deskewing image: {e}")
        return image

def skills_extractor(file_name):
    """Main function to extract skills from resume PDF"""
    try:
        # Determine PDF type
        pdf_type = classifier(file_name)
        print("pdf_type: " + pdf_type)
        
        # Extract text based on PDF type
        if pdf_type == 'text':
            resume_text = extract_text_from_pdf(file_name)
        else:
            resume_text = extract_text_from_image(file_name)
        
        # Extract skills from resume text
        skills = list(extract_skills(resume_text))
        
        print(f"Extracted skills: {skills}")
        return skills if skills else []
    except Exception as e:
        print(f"Error in skills_extractor: {e}")
        return []

