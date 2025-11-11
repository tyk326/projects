#to run with flask: flask --app main run
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__) #__name__ is like 'this'. Creates an instance
CORS(app) #to serve frontend. https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def home():
    return "Welcome to this page!"

@app.route("/login", methods=["POST"])
def login():
    data = request.json()
    email = data.get("email")
    password = data.get("password")
    result = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if (result.user):
        return jsonify({"message": "Login Successful", "access_token": result.session.access_token})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True) 

# debug=True
# Automatic reload: The server restarts when you change the code.
# Debug mode: Shows detailed error pages in your browser with stack traces.