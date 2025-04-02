#to run with flask: flask --app main run
from flask import Flask, jsonify
from flask_cors import CORS
import csv

class Movie:
    def __init__(self, rank, title, year, episodes, rating, description, genre, tags, actors):
        self.rank = rank
        self.title = title
        self.year = year
        self.episodes = episodes
        self.rating = rating
        self.description = description
        self.genre = genre
        self.tags = tags
        self.actors = actors


app = Flask(__name__) #__name__ is like 'this'. Creates an instance
CORS(app) #to serve frontend. https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc


movies = []
with open("./kdrama_DATASET.csv", "r") as file:
    reader = csv.reader(file, delimiter=",")
    for x in reader:
        movies.append(Movie(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8]))

#get rid of labels
movies.pop(0)


# @app.route('/')
# def home():
#     return "Welcome to this page!"

@app.route('/network') #tells what url triggers the function
def networkInfo():
    info = []
    for movie in movies:
        info.append({"title": movie.title, "rank": movie.rank, "actors": movie.actors})
    return jsonify(info)