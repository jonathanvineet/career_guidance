
from flask import Flask, request, jsonify
from skills_extraction import skills_extractor
from flask_cors import CORS, cross_origin
from job_recommender import job_recommendation
from job_recommender import job_recommendation_from_job
import os

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/")
@app.route("/resume")
def index():
    return jsonify({"status": "running", "message": "CareerGAIde API is active"})

@app.route('/login',methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'POST':
        email = request.form.get("id", None)
        password = request.form.get("pass", None)
        print(email,password)
        if email == "test" and password == "test":
            return 'success'
        else:
            return 'fail'

@app.route('/parse',methods=['POST'])
@cross_origin(supports_credentials=True)
def parse():
    if request.method == 'POST':
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        resume_file = request.files['resume']
        if resume_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            # Save the uploaded file
        filename = resume_file.filename
        resume_path = os.path.join(filename)
        resume_file.save(resume_path)
        return skills_extractor(resume_path)

@app.route('/jobs',methods=['POST'])
@cross_origin(supports_credentials=True)
def job_recommend():
    if request.method == 'POST':
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        resume_file = request.files['resume']
        if resume_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            # Save the uploaded file
        filename = resume_file.filename
        resume_path = os.path.join(filename)
        resume_file.save(resume_path)
        skills=skills_extractor(resume_path)

        return job_recommendation(skills)

@app.route('/similar-jobs',methods=['POST'])
@cross_origin(supports_credentials=True)
def job_recommend_from_job():
    if request.method == 'POST':
        skills=request.form.get('skills')
        print(skills)
        return job_recommendation_from_job(skills)
        
@app.route('/search-jobs',methods=['POST'])
@cross_origin(supports_credentials=True)
def search_jobs():
    if request.method=='POST':
        skill=request.form.get('skill')
        # TODO: Implement job search functionality
        return jsonify({'message': 'Search functionality coming soon', 'skill': skill})

@app.route('/ai-job-fit', methods=['POST'])
@cross_origin(supports_credentials=True)
def ai_job_fit():
    try:
        data = request.get_json(silent=True) or request.form
        job_title = data.get('job_title', 'Software Engineer')
        company_name = data.get('company_name', 'Tech Company')
        job_description = data.get('job_description', '')
        
        skills = data.get('skills', [])
        if isinstance(skills, str):
            import json
            try:
                skills = json.loads(skills)
            except:
                skills = [s.strip() for s in skills.split(',') if s.strip()]
                
        missing_skills = data.get('missing_skills', [])
        if isinstance(missing_skills, str):
            import json
            try:
                missing_skills = json.loads(missing_skills)
            except:
                missing_skills = [s.strip() for s in missing_skills.split(',') if s.strip()]

        from ai_service import analyze_job_fit
        analysis = analyze_job_fit(skills, job_title, company_name, job_description, missing_skills)
        return jsonify(analysis)
    except Exception as e:
        print(f"Error in /ai-job-fit: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)


