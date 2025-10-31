#to run with flask: flask --app main run
from flask import Flask, jsonify
from flask_cors import CORS
import csv

app = Flask(__name__) #__name__ is like 'this'. Creates an instance
CORS(app) #to serve frontend. https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc


# @app.route('/')
# def home():
#     return "Welcome to this page!"


@app.route('/network') #tells what url triggers the function
def networkInfo():
    info = []
    for movie in movies:
        info.append({"title": movie.title, "rank": movie.rank, "actors": movie.actors})
    return jsonify(info)