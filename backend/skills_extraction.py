import spacy
from spacy.matcher import Matcher
import PyPDF2
import os
import csv
import fitz
from pdf2image import convert_from_path
import cv2
import numpy as np
import pytesseract

# Load the Spacy English model
nlp = spacy.load('en_core_web_sm')

# Read skills from CSV file
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, 'data', 'skills.csv')
with open(file_path, 'r') as file:
    csv_reader = csv.reader(file)
    skills = [row for row in csv_reader]

# Create pattern dictionaries from skills
skill_patterns = [[{'LOWER': skill}] for skill in skills[0]]

# Create a Matcher object
matcher = Matcher(nlp.vocab)

# Add skill patterns to the matcher
for pattern in skill_patterns:
    matcher.add('Skills', [pattern])

# Function to classify the Resume type
def classifier(pdf_file):
    with open(pdf_file,"rb") as f:
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
        else :
            return 'image'

# Function to extract skills from text
def extract_skills(text):
    doc = nlp(text)
    matches = matcher(doc)
    skills = set()
    for match_id, start, end in matches:
        skill = doc[start:end].text
        skills.add(skill)
    return skills

# Function to extract text from text-PDF
def extract_text_from_pdf(file_path:str):
    with open(file_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

#Function to extract text from image-PDF
def extract_text_from_image(file_path:str):
    # poppler_path is only needed on Windows, on macOS/Linux it's in PATH
    import platform
    if platform.system() == 'Windows':
        # User needs to install poppler and set path
        pages = convert_from_path(file_path, 350)
    else:
        pages = convert_from_path(file_path, 350)
    extracted_text = []
    for page in pages:
        # Step 2: Preprocess the image (deskew)
        preprocessed_image = deskew(np.array(page))

        # Step 3: Extract text using OCR
        # On macOS: brew install tesseract
        # tesseract_cmd will auto-detect if in PATH
        import platform
        if platform.system() == 'Windows':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        text = pytesseract.image_to_string(preprocessed_image).replace("\n"," ")
        extracted_text.append(text)
    return text

def deskew(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    coords = np.column_stack(np.where(gray > 0))
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

def skills_extractor(file_name):
        # Extract text from PDF - file_name is already the full path from Flask
        pdf_type=classifier(file_name)
        print("pdf_type: " + pdf_type)
        if(pdf_type=='text'):
            resume_text = extract_text_from_pdf(file_name)
        else :
            resume_text = extract_text_from_image(file_name)
        # Extract skills from resume text
        skills = list(extract_skills(resume_text))
        return skills

