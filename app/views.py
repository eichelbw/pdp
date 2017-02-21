import json
from random import random as r
from flask import render_template
from app import app, models, db, db_session

@app.route('/')
def index():
    return render_template("index.html")

# TODO include poet in this data structure once we figure out mouseover
@app.route('/data')
def data(ndata=300):
    factors = db_session.query(models.Factor).all()
    return json.dumps([{
        '_id': f.id,
        'x': f.Factor1,
        'y': f.Factor2,
        'z': f.Factor3,
        'c': f.clust,
        } for f in factors])

# route to test things!
@app.route('/test')
def test():
    factors = db_session.query(models.Factor).all()
    return render_template('test.html',
            factors=factors
            )
