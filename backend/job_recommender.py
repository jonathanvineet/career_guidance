import ast
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def parse_skill_set(value):
    # skills_in_jd is stored as a Python set literal, e.g. "{'python', 'sql'}"
    try:
        return list(ast.literal_eval(value))
    except (ValueError, SyntaxError):
        return value.split()

def job_recommendation(skills_list):
    # Read the jobs data from the CSV file
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'data', 'final_jobs.csv')
    jobs_df = pd.read_csv(csv_path)
    
    # Create a TF-IDF vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # Transform the job descriptions into TF-IDF vectors
    job_tfidf = vectorizer.fit_transform(jobs_df['skills_in_jd'])
    
    # Transform user skills into TF-IDF vectors
    user_skills_tfidf = vectorizer.transform([' '.join(skills_list)])
    
    # Calculate cosine similarity between user skills and all job descriptions
    cos_similarities = cosine_similarity(user_skills_tfidf, job_tfidf).flatten()
    
    # Get the indices of top 10 job recommendations with highest similarity scores
    top_job_indices = np.argsort(cos_similarities)[::-1]
    
    # Get the top 10 job recommendations
    top_jobs_df = jobs_df.iloc[top_job_indices].copy()
    top_jobs_df['similarity'] = cos_similarities[top_job_indices].round(3)
    
    # Drop duplicate job titles
    top_jobs_df = top_jobs_df.drop_duplicates(subset=['job_title'])
    
    have = {s.lower() for s in skills_list}
    top_jobs_df['missing_skills'] = top_jobs_df['skills_in_jd'].apply(lambda x: sorted({s.lower() for s in parse_skill_set(x)} - have))

    return top_jobs_df.head(10).to_json(orient='records')  # Returning JSON formatted string

def job_recommendation_from_job(skills_list):
    # The client posts skills as one comma-separated form field
    if isinstance(skills_list, str):
        skills_list = [s.strip() for s in skills_list.split(',') if s.strip()]
    skills_list = list(skills_list)
    # Read the jobs data from the CSV file
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'data', 'final_jobs.csv')
    jobs_df = pd.read_csv(csv_path)
    # Create a TF-IDF vectorizer
    vectorizer = TfidfVectorizer(stop_words='english')
    
    # Transform the job descriptions into TF-IDF vectors
    job_tfidf = vectorizer.fit_transform(jobs_df['skills_in_jd'])
    
    # Transform user skills into TF-IDF vectors

    user_skills_tfidf = vectorizer.transform([' '.join(skills_list)])
    
    # Calculate cosine similarity between user skills and all job descriptions
    cos_similarities = cosine_similarity(user_skills_tfidf, job_tfidf).flatten()
    
    # Get the indices of top 10 job recommendations with highest similarity scores
    top_job_indices = np.argsort(cos_similarities)[::-1]
    
    # Get the top 10 job recommendations
    top_jobs_df = jobs_df.iloc[top_job_indices].copy()
    top_jobs_df['similarity'] = cos_similarities[top_job_indices].round(3)
    
    # Drop duplicate job titles
    top_jobs_df = top_jobs_df.drop_duplicates(subset=['job_title'])


    return top_jobs_df.head(10).to_json(orient='records')  # Returning JSON formatted string
