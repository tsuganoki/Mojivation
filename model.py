"""Models and database functions for Tilia's project."""

from flask_sqlalchemy import SQLAlchemy

# This is the connection to the PostgreSQL database; we're getting this through
# the Flask-SQLAlchemy helper library. On this, we can find the `session`
# object, where we do most of our interactions (like committing, etc.)

db = SQLAlchemy()


##############################################################################
# Model definitions

class User(db.Model):
    """User of to-do website."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(64))
    email = db.Column(db.String(64), nullable=True)
    password = db.Column(db.String(64), nullable=True)
    
    def __repr__(self):
        """Provide helpful representation when printed."""
        return f"<User user_id={self.user_id} email={self.email}>"

class Task(db.model):
	"""tasks stored in to-do website"""

	__tablename__ = "tasks"

	task_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
	msg = db.Column(db.String(264))
	user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
	is_complete = db.Column(db.boolean)
	due_date = db.Column(db.DateTime)


    def __repr__(self):
    	return f"<Task task_id{self.task_id} msg {self.msg[:16]}>"


    user = db.relationship("User", backref=db.backref("tasks", order_by=task_id))


class Collect(db.model):
	"""Kao-moji collected by users"""

	__tablename__ = "collects"

	collect_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
	kao_id = db.Column(db.Integer, db.ForeignKey('kaos.kao_id'))
	collect_date = db.Column(db.DateTime)

	def __repr__(self):
        """Provide helpful representation when printed."""
        return f"<Collects collect_id={self.collect_id} user_id={self.user_id}>"

    kaos = db.relationship("Kaos",backref=db.backref("collects",order_by=collect_id))

class Kao(db.model):
	"""unicode kaomoji and their ids"""

    __tablename__ = "kaos"

    kao_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    kao = db.Column(db.String(128))


##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PstgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///ratings'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")
