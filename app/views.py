import json
from random import random as r
from flask import render_template
from app import app, models, db, db_session

@app.route('/')
def index():
    return render_template("index.html")

# TODO change this to serve factor dimensions rather than random floats
@app.route('/data')
def data(ndata=300):
    factors = db_session.query(models.Factor).all()
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

@app.route('/test')
def test():
    factors = db_session.query(models.Factor).all()
    return render_template('test.html',
            factors=factors
            )
