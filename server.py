
from jinja2 import StrictUndefined

from flask import (Flask, render_template, redirect, request, flash,
                   session, jsonify, g, url_for)

from functools import wraps


from flask_debugtoolbar import DebugToolbarExtension

from model import User, Task, Collect, Kao, Used_Kao,connect_to_db, db

import datetime
from datetime import timedelta
import pytz
import timehelpers
import task_logic
import random

# Required to use Flask sessions and the debug toolbar
import sys
import os.path


app = Flask(__name__)



def install_secret_key(app, filename='secretkey'):
    """Configure the SECRET_KEY from a file
    in the instance directory.

    If the file does not exist, print instructions
    to create it from a shell with a random key,
    then exit.

    """
    filename = os.path.join(app.instance_path, filename)
    try:
        app.config['SECRET_KEY'] = open(filename, 'rb').read()
    except IOError:
        print( 'Error: No secret key. Create it with:')
        if not os.path.isdir(os.path.dirname(filename)):
            print ('mkdir -p', os.path.dirname(filename))
        print ('head -c 24 /dev/urandom >', filename)
        sys.exit(1)

install_secret_key(app)
# app.secret_key = 

# Normally, if you use an undefined variable in Jinja2, it fails
# silently. This is horrible. Fix this so that, instead, it raises an
# error.
app.jinja_env.undefined = StrictUndefined

# @app.before_request
# def before_request():
#     if not session.get("current_user_id") and (request.endpoint != '/login' or request.endpoint != '/' ):
#         flash("Please log in to use that feature")
#         return redirect("/login")
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("current_user_id"):
            flash("You must be logged in to use that feature")
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

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
    # print(slogan)
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

    elif email_input == User.query.filter_by(email=email_input).first():
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

@app.route('/login_confirm', methods = ['POST'])
def login_confirm():
    print("processes the login get request")
    username_input = request.form.get('username')
    pwd_input = request.form.get('password')

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
    if session.get("current_user_id"):
        del session["current_username"]
        del session["current_user_id"]
        flash("You are now logged out")
        return redirect("/")
    else:
        return redirect("/")



@app.route('/tasks')
@login_required
def view_tasks():
    """Homepage."""
    user = User.query.get(session["current_user_id"])
    tasks = user.tasks

    EOD = timehelpers.get_user_EOD(user.timezone)
    

    return render_template("tasks.html", tasks=tasks,EOD=EOD)

        
    # current_user = User.query.filter_by(username=username_input).first()


@app.route("/tasks-js")
@login_required
def get_tasks_js():
    user = User.query.get(session["current_user_id"])
    return render_template("tasks_js.html")



@app.route("/get-tasks.json")
@login_required
def get_tasks():
    user = User.query.get(session["current_user_id"])
    # user = User.query.get(21)
    task_dict = task_logic.convert_tasklist_to_dict(user.tasks)

    return jsonify(task_dict)   



@app.route("/new_task")
@login_required
def new_task():
    """page for adding new tasks"""
    user = User.query.get(session["current_user_id"])

    EOD = timehelpers.get_user_EOD(user.timezone)

    return render_template("new_task.html", eod=EOD)



@app.route("/add_new_task", methods=["POST"])
@login_required
def add_new_task():
    """Adds a new task to a user's task list"""

    user = User.query.get(session["current_user_id"])

    task_msg_input = request.form.get("msg")
    # print("msg received is: ", task_msg_input)
    is_repeating_input = request.form.get("repeating")
    is_repeating = True if is_repeating_input == "True" else False


    user_tz_str = user.timezone
    if request.form.get("today") or request.form.get("duedate") == "":
        duedate_input = datetime.datetime.now()
        due_date = timehelpers.get_user_midnight_utc(duedate_input,user_tz_str)

    else:
        duedate_input = request.form.get("duedate")
        # print("input received: ", duedate_input)
        due_date = timehelpers.convert_date_string_to_localized_datetime(duedate_input,user_tz_str)
        # print("due_date converted to: ", due_date)
        # print("original due_date: ", duedate_input)
        # user_zone = pytz.timezone(user.timezone)
        # duedate_datetime_localized = user_zone.localize(duedate_datetime)

    task = Task(msg=task_msg_input,
                is_repeating=is_repeating,
                due_date = due_date,
                user_id=session["current_user_id"])
    # print("due_date in task: ",task.due_date)


    db.session.add(task)
    db.session.commit()
    # print(Task.query.all())
    return redirect("/tasks")


@app.route("/edit_task/<task_id>")
@login_required
def edit_task(task_id):
    """lets a user edit a task"""

    user = User.query.get(session["current_user_id"])
    task = Task.query.get(task_id)
    if task.user_id != user.user_id:
        flash("Invalid task id")
        return redirect('/tasks')

    return render_template("edittask.html", 
                            task=task)

@app.route("/confirm-edit", methods=["POST"])
@login_required
def confirm_edit():
    user = User.query.get(session["current_user_id"])
    task = Task.query.get(int(request.form.get("task_id")))

    task_msg_input = request.form.get("msg")
    task.msg = task_msg_input

    is_repeating_input = request.form.get("repeating")
    is_repeating = True if is_repeating_input == "True" else False


    user_tz_str = user.timezone

    if request.form.get("today") or request.form.get("duedate") == "":
        duedate_input = datetime.datetime.now()
        due_date = timehelpers.get_user_midnight_utc(duedate_input,user_tz_str)

    else:
        duedate_input = request.form.get("duedate")
        # print("input received: ", duedate_input)
        due_date = timehelpers.convert_date_string_to_localized_datetime(duedate_input,user_tz_str)

    print(task.msg)
    task.due_date = due_date
    print(task.due_date)

    db.session.commit()
    # print(Task.query.all())
    return redirect("/tasks")


# @app.route("/quick-add", methods=["POST"])
# @login_required
# @login_required
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
@login_required
def complete_task():
    """Adds a new task to a user's task list"""

    task_id = int(request.form.get("task_id"))
    user = User.query.get(session.get("current_user_id"))

    task = Task.query.get(task_id)
    # A line of code the changes the task to is_complete = False
    # user.no_of_logins += 1
                
    if task.is_repeating == True:
        task.due_date = timehelpers.get_user_tomorrow_EOD(user.timezone)
        db.session.commit()
    else:
        task.is_complete = True
        db.session.commit()
    if timehelpers.check_remaining_tasks(user.tasks,user.timezone):
        return redirect("/collect-kao")
    return redirect("/tasks")

@app.route("/undo_complete", methods=["POST"])
@login_required
def undo_complete():
    """Adds a new task to a user's task list"""

    task_id = int(request.form.get("task_id"))

    task = Task.query.get(task_id)
    task.is_complete = False
    db.session.commit()

    # print("taskid: ",task_id," - Task: ", task, "is_complete: ",task.is_complete)
    return redirect("/tasks")
        


@app.route("/clear-all-completed")
@login_required
def clear_all_completed():

    user = User.query.get(session["current_user_id"])
    
    completed_tasks = Task.query.filter_by(user_id=user.user_id,is_complete=True)
    for task in completed_tasks:
        db.session.delete(task)
    db.session.commit()
    return redirect("/tasks")

@app.route("/delete-task-<task_id>")
@login_required
def delete_task(task_id):

    user = User.query.get(session["current_user_id"])
    
    task = Task.query.get(task_id)
    print(task)
    db.session.delete(task)
    db.session.commit()

    return redirect("/tasks")



@app.route("/user-info")
@login_required
def user_info():
    """lets a user change their info"""

    user = User.query.get(session["current_user_id"])
    collects = Collect.query.filter_by(user_id=user.user_id)
    # for collect in collects:
    #     print (collect.kaos.kao)
    return render_template("user-info.html",user=user, collects=collects)

@app.route("/collect-kao")
@login_required
def collect_kao():
    user = User.query.get(session.get("current_user_id"))
    if timehelpers.check_remaining_tasks(user.tasks,user.timezone) == False:
        flash("nope")
        return redirect('/tasks')
        # gotta make sure they don't just navigate to this url


    user_midn_utc = timehelpers.get_user_midnight(user.timezone)
    todays_kao = Used_Kao.query.filter_by(date=user_midn_utc).first()
    # print(todays_kao)
    if todays_kao == None:
        # print("potato")
        return redirect("/select-new-kao")

        # assign a new used kao here

    print(todays_kao.kao_id, todays_kao.date)
    if Collect.query.filter_by(kao_id=todays_kao.kao_id, user_id=user.user_id).first():

        flash("You have already collected today's Moji, but good job anyways!")
        return redirect("/tasks")

    collect = Collect(user_id=user.user_id,
                      kao_id=todays_kao.kao_id,
                      collect_date=timehelpers.get_user_now(user.timezone)
                      )

    db.session.add(collect)
    # print(collect)
    db.session.commit()
    flash(f"You have collected a Moji: {Kao.query.get(todays_kao.kao_id).kao}")
    return redirect("/tasks")




@app.route("/select-new-kao")
@login_required
def select_new_kao():
    """adds a new kao to the database"""
    user = User.query.get(session.get("current_user_id"))

    used_kaos = Used_Kao.query.all()
    kaos = Kao.query.all()
    
    new_kao_id = timehelpers.select_new_kao(used_kaos=used_kaos,kaos=kaos)
    
    new_used_kao = Used_Kao(kao_id=new_kao_id,date=timehelpers.get_user_midnight(user.timezone))
    db.session.add(new_used_kao)
    db.session.commit()

    print(Kao.query.get(new_used_kao.kao_id))


    return redirect("/collect-kao")
    # return redirect('/tasks')

@app.route("/award-kao")
@login_required
def award_kao():
    """awards the user a kao and adds to collection"""

    user = User.query.get(session["current_user_id"])
    todays_kao = timehelpers.get_todays_kao(user.timezone) # this might have to be logic that happens here

    new_collect = Collect(user_id=user.user_id,
                        kao_id=todays_kao,
                        collect_date=collect_date)

    db.session.add(new_collect)

@app.route("/google-cal-API")
@login_required
def google_cal_API():

    my_events = "events"
    return render_template("my_events.html",
        events=my_events)

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