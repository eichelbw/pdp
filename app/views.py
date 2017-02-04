import json
from random import random as r
from flask import render_template
# from flask.json import jsonify
from app import app

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/data')
def data(ndata=300):
    return json.dumps([{
        '_id': i,
        'x': r(),
        'y': r(),
        'z': r(),
        'lp_x': r(),
        'lp_y': r(),
        'lp_z': r(),
        'hp_x': r(),
        'hp_y': r(),
        'hp_z': r()
        } for i in range(ndata)])
