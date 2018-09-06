"""Utility file to seed ratings database from MovieLens data in seed_data/"""

from sqlalchemy import func
from model import User
from model import Task
from model import Collect
from model import Kao

from model import connect_to_db, db
from server import app

import datetime

def delete_everything():
    Collect.query.delete()
    Kao.query.delete()
    Task.query.delete()
    User.query.delete()

    
def load_users():
    """Load users from u.user into database."""

    print("Users")

    # Delete all rows in table, so if we need to run this a second time,
    # we won't be trying to add duplicate users
    # User.query.delete()


    # Read u.user file and insert data
    for row in open("seed_data/u.user"):
        row = row.rstrip()
        user_id, username, email, password = row.split("|")

        user = User(user_id=int(user_id),
        			username=username,
                    email=email,
                    password=password)

        # We need to add to the session or it won't ever be stored
        db.session.add(user)

    # Once we're done, we should commit our work
    db.session.commit()


def load_tasks():
    """Load movies from u.item into database."""

    # Task.query.delete()


    for row in open("seed_data/u.tasks"):
        row = row.rstrip()
        task_id,msg, user_id, is_complete,due_date_string = row.split("|")
        if is_complete == 'T':
        	is_complete= True
        else:
        	is_complete=False

        if due_date_string: #8/29/2018
            due_date = datetime.datetime.strptime(due_date_string,"%m/%d/%Y") 
            # print("task date string is ", due_date_string)
            # print("task datetime object is ", due_date)
        else:
            released_date = None


        task = Task(task_id=int(task_id),
        			msg=msg,
                    user_id=int(user_id),
                    is_complete=is_complete,
                    due_date=due_date)
        db.session.add(task)
    db.session.commit()
    print("Tasks Loaded")



def load_collects():
    """Load collects from u.collects into database."""


    # Collect.query.delete()
    for i, row in enumerate(open("seed_data/u.collects")):
        row = row.rstrip()

        user_id, kao_id, timestamp = row.split("|")

        if timestamp: #2018-08-10 3:10:24
            collect_date = datetime.datetime.strptime(timestamp,"%Y-%m-%d %H:%M:%S") 
        else:
            date = None


        collect = Collect(collect_id = i+1,
                        user_id=user_id,
                        kao_id=kao_id,
                        collect_date=collect_date
                        )
        db.session.add(collect)
    db.session.commit()
    print("Collect Loaded")

def load_kaos():
	"""Load kaos from u.kaos into database"""
	# Kao.query.delete()

	for i, kao in enumerate(open("seed_data/u.kaos")):
		kao = kao.rstrip()

		kao = Kao(kao_id=i+1, 
                  kao=kao)
		db.session.add(kao)
	db.session.commit()
	print("Kaos Loaded")





def set_val_user_id():
    """Set value for the next user_id after seeding database"""

    # Get the Max user_id in the database
    result = db.session.query(func.max(User.user_id)).one()
    max_id = int(result[0])

    # Set the value for the next user_id to be max_id + 1
    query = "SELECT setval('users_user_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

def set_val_task_id():
    """Set value for the next task_id after seeding database"""

    # Get the Max task_id in the database
    result = db.session.query(func.max(Task.task_id)).one()
    max_id = int(result[0])

    # Set the value for the next task_id to be max_id + 1
    query = "SELECT setval('tasks_task_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()


def set_val_collect_id():
    """Set value for the next collect_id after seeding database"""

    # Get the Max collect_id in the database
    result = db.session.query(func.max(Collect.collect_id)).one()
    max_id = int(result[0])

    # Set the value for the next collect_id to be max_id + 1
    query = "SELECT setval('collects_collect_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

def set_val_kao_id():
    """Set value for the next collect_id after seeding database"""

    # Get the Max collect_id in the database
    result = db.session.query(func.max(Kao.kao_id)).one()
    max_id = int(result[0])

    # Set the value for the next collect_id to be max_id + 1
    query = "SELECT setval('kaos_kao_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

if __name__ == "__main__":
    connect_to_db(app)

    # In case tables haven't been created, create them
    db.create_all()

    # Import different types of data
    delete_everything()
    load_users()
    load_tasks()
    load_kaos()
    load_collects()
    set_val_user_id()
    set_val_task_id()
    set_val_collect_id()
    set_val_kao_id()
