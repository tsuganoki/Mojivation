
from jinja2 import StrictUndefined

from flask import (Flask, render_template, redirect, request, flash,
                   session, jsonify)

from flask_debugtoolbar import DebugToolbarExtension

from model import User, Task, Collect, Kao, connect_to_db, db

import datetime
from datetime import timedelta
import pytz
import timehelpers
import random



app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "FixMePOTATO"

# Normally, if you use an undefined variable in Jinja2, it fails
# silently. This is horrible. Fix this so that, instead, it raises an
# error.
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def index():
    """Homepage."""
    kao_dict = {
        "shrug": u"¯\_(ツ)_/¯ Guess we can be productive today",
        "supportive": u"~(˘▽˘~) I know you can do it!",
        "dog": u" ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
        "boxer": u"(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
        "mage": u"(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
        "bear": u"ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
        "allie": u"╰(°ロ°)╯ Do all the things!"
        }
    slogan = random.choice(list(kao_dict.values() ) ) 
    print(slogan)
    return render_template("index.html",slogan=slogan)  

@app.route("/register")
def register():
    """displays page to register a new account"""
    if session.get("current_user_id"):
        return redirect("/tasks")

    timezones = timehelpers.TIMEZONES
    return render_template("register.html", timezones=timezones)


@app.route("/register_confirm", methods=["POST"])
def register_confirm():
    """Confirm a new account registration"""
    username_input = request.form.get("username")
    email_input = request.form.get("email")
    password_input1 = request.form.get("password1")
    password_input2 = request.form.get("password2")
    timezone_input = request.form.get("timezone")
    if password_input1 != password_input2:
        flash("Sorry, your passwords must match")
        return redirect("/register")
    elif email_input == User.query.filter_by(email=email_input):
        flash("Sorry, your email is already in use")
        return redirect("/register")
        
    elif username_input == User.query.filter_by(username=username_input).first():
        flash("Sorry, your username has been taken")
        return redirect("/register")
    else:
        user = User(username=username_input,
                    email=email_input,
                    password=password_input1,
                    timezone=timezone_input)
        # We need to add to the session or it won't ever be stored
        db.session.add(user)
        # Once we're done, we should commit our work
        db.session.commit()
        session["current_user_id"] = user.user_id
        session["current_username"] = user.username

        return redirect("/tasks")





@app.route('/login')
def login():
    """Homepage."""
    if session.get("current_user_id"):
        return redirect("/tasks")

    return render_template("login.html")

@app.route('/login_confirm', methods = ['GET'])
def login_confirm():
    print("processes the login get request")
    username_input = request.args.get('username')
    pwd_input = request.args.get('password')

    if User.query.filter_by(username=username_input).first():
        current_user = User.query.filter_by(username=username_input).first()
        user_id = str(current_user.user_id)
        user_pwd = current_user.password

        if user_pwd == pwd_input:
            session["current_user_id"] = user_id
            session["current_username"] = current_user.username
            # redirect_route = 'user/' + user_id
            flash("You are now logged in")
            return redirect("/tasks")
        else:
            flash("Login failed - wrong password")
            return render_template('login.html')

    else:
        flash("Login failed - username not recognized")
        return render_template('login.html')

@app.route("/logout")
def logout():
    """Logout of web app"""
    if session.get("current_username"):
        del session["current_username"]
        del session["current_user_id"]
        flash("You are now logged out")
        return redirect("/")
    else:
        return redirect("/")




@app.route('/tasks')
def view_tasks():
    """Homepage."""
    if session.get("current_user_id"):
        user = User.query.get(session["current_user_id"])
        tasks = user.tasks

        user_tz_str = user.timezone
        EOD = timehelpers.get_user_EOD(user_tz_str)

        

        return render_template("tasks.html", tasks=tasks,EOD=EOD)
    else:
        flash("Please log in to use that feature")
        return redirect("/")
        
    # current_user = User.query.filter_by(username=username_input).first()

@app.route("/reset-repeating")
def reset_repeating():

    """reset repeating tasks"""
    
    timehelpers.reset_repeating_tasks()
    return "repeating tasks reset"



# @app.route("/get-tasks.json")
# def get_tasks():
#     # user = User.query.get(session["current_user_id"])
#     user = User.query.get(21)
#     tasks = user.tasks
#     for task in tasks:
#         print (task)
#     return jsonify(tasks)

@app.route("/new_task")
def new_task():
    """page for adding new tasks"""
    if session.get("current_user_id"):
        return render_template("new_task.html")
    else:
        flash("Please log in to use that feature")
        return redirect("/")



@app.route("/add_new_task", methods=["POST"])
def add_new_task():
    """Adds a new task to a user's task list"""

    if session.get("current_user_id"):
        user = User.query.get(session["current_user_id"])
        task_msg_input = request.form.get("msg")
        is_repeating_input = request.form.get("repeating")

        is_repeating = True if is_repeating_input == "True" else False


        if request.form.get("today") or request.form.get("duedate") == "":
            duedate_input = datetime.datetime.now()

        else:
            duedate_input = request.form.get("duedate")
            duedate_input = datetime.datetime.strptime(duedate_input,"%Y-%m-%d") 

            # print("original due_date: ", duedate_input)
            # user_zone = pytz.timezone(user.timezone)
            # duedate_datetime_localized = user_zone.localize(duedate_datetime)

        user_tz_str = user.timezone
        due_date = timehelpers.get_user_midnight_utc(duedate_input,user_tz_str)

        task = Task(msg=task_msg_input,
                    is_repeating=is_repeating,
                    due_date = due_date,
                    user_id=session["current_user_id"])


        db.session.add(task)
        db.session.commit()
        print(Task.query.all())
        return redirect("/tasks")


    else:
        flash("Please log in to use that feature")
        return redirect("/")


# @app.route("/quick-add", methods=["POST"])
# def quick_add():
#     """Quickly adds a new task to a user's task list"""

#     if session.get("current_user_id"):
#         user = User.query.get(session["current_user_id"])
#         task_msg_input = request.form.get("new_task_msg")

#         midnight = timehelpers.get_midnight()



#         task = Task(msg=task_msg_input,
#                     due_date = midnight,
#                     user_id=session["current_user_id"])


#         db.session.add(task)
#         print("task is: ",task)
#         db.session.commit()


#         return redirect("/tasks")


#     else:
#         flash("Please log in to use that feature")
#         return redirect("/")


@app.route("/complete-task", methods=["POST"])
def complete_task():
    """Adds a new task to a user's task list"""

    if session.get("current_user_id"):
        task_id = int(request.form.get("task_id"))


        task = Task.query.get(task_id)
        # A line of code the changes the task to is_complete = False
        # user.no_of_logins += 1
        task.is_complete = True
        db.session.commit()

        return redirect("/tasks")

@app.route("/undo_complete", methods=["POST"])
def undo_complete():
    """Adds a new task to a user's task list"""

    if session.get("current_user_id"):
        task_id = int(request.form.get("task_id"))

        task = Task.query.get(task_id)
        # print("the task is: ",task.msg)
        # A line of code the changes the task to is_complete = False
        task.is_complete = False

        db.session.commit()

        # print("taskid: ",task_id," - Task: ", task, "is_complete: ",task.is_complete)
        return redirect("/tasks")
        

    else:
        flash("Please log in to use that feature")
        return redirect("/")


@app.route("/clear-completed")
def clear_completed():

    if session.get("current_user_id"):
        user_id = int(session.get("current_user_id"))
        
        completed_tasks = Task.query.filter_by(user_id=user_id,is_complete=True)
        for task in completed_tasks:
            db.session.delete(task)
        db.session.commit()
        return redirect("/tasks")
    else:
        flash("Please log in to use that feature")
        return redirect("/")



@app.route("/user-info")
def user_info():
    """lets a user change their info"""

    if session.get("current_user_id"):
        user = User.query.get(int(session["current_user_id"]))
        return render_template("user-info.html",user=user)











if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    app.debug = True
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(port=5000,debug=True, host='0.0.0.0')