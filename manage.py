#!flask/bin/python
import csv
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import app, db, models, db_session

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def read_factors_csv():
    # clean up what's in there first
    db_session.query(models.Factor).delete()
    with open('app/static/factorscores.csv', 'rb') as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            print row[2]
            factor = models.Factor()
            factor.book = row[0]
            factor.label = row[1]
            factor.Factor1 = float(row[2])
            factor.Factor2 = float(row[3])
            factor.Factor3 = float(row[4])
            factor.variable = row[5]
            factor.clust = row[6]
            factor.poet = row[7]
            db_session.add(factor)
            db_session.commit()

if __name__ == "__main__":
    manager.run()
