#to run with flask: flask --app main run
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import requests

# Load environment variables from .env
# load_dotenv()

app = Flask(__name__) #__name__ is like 'this'. Creates an instance
allowed_origins = ["http://192.168.12.54:5173", "http://localhost:5173"]
CORS(app, resources={r"/*": {"origins": allowed_origins}}) #to serve frontend. https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc

GEO_API_KEY = os.getenv("GEOAPIFY_API_KEY")
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# return lat lon from given address using geoapify api
def get_coords(address):
    # We use the 'search' endpoint for geocoding
    url = f"https://api.geoapify.com/v1/geocode/search?text={address}&apiKey={GEO_API_KEY}"
    
    response = requests.get(url)
    data = response.json()

    # Geoapify returns a list of "features" (results)
    if data['features']:
        # We take the first result [0]
        properties = data['features'][0]['properties']
        lon = properties['lon']
        lat = properties['lat']
        return lat, lon
    else:
        return None, None

@app.route('/', methods=['POST'])
def home():
    data = request.json
    address = data.get('address')

    lat,lon = get_coords(address)
    
    # We use a 2000 meter (2km) radius
    places_url = "https://api.geoapify.com/v2/places"
    params = {
        "categories": "catering.restaurant.korean",
        "filter": f"circle:{lon},{lat},32000",
        "bias": f"proximity:{lon},{lat}",
        "limit": 50,
        "apiKey": GEO_API_KEY
    }
    
    places_resp = requests.get(places_url, params=params).json()
    
    # Return the list of places to frontend
    return jsonify({
        'message': 'OK',
        'places': places_resp['features']
    })

@app.route('/details/<place_id>', methods=['GET'])
def details(place_id):
    print("Fetching details for place_id:", place_id)

    url = f"https://api.geoapify.com/v2/place-details"
    params = {
        "id": place_id,
        "features": "details",
        "apiKey": GEO_API_KEY
    }

    details_resp = requests.get(url, params=params).json()

    return jsonify({
        'message': 'OK',
        'details': details_resp['features'][0]
    })


if __name__ == "__main__":
    app.run(debug=True) 

# debug=True
# host='0.0.0.0' is to allow access from other devices on the network
# Automatic reload: The server restarts when you change the code.
# Debug mode: Shows detailed error pages in your browser with stack traces.