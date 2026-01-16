
from flask import Flask, request, jsonify
from skills_extraction import skills_extractor
from flask_cors import CORS, cross_origin
from job_recommender import job_recommendation
from job_recommender import job_recommendation_from_job
import os

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/resume")
def index():
    return 0

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

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)

