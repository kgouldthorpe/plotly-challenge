from .app import db


class BellyButton(db.Model):
    __tablename__ = 'belly_button'

    sample = db.Column(db.Integer, primary_key=True)
    ETHNICITY = db.Column(db.String(100))
    GENDER = db.Column(db.String(5))
    AGE = db.Column(db.Integer)
    LOCATION = db.Column(db.String(100))
    BBTYPE = db.Column(db.String(50))
    WFREQ = db.Column(db.Integer)

    def __repr__(self):
        return '<Belly Button %r>' % (self.name)
