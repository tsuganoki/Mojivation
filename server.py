
from jinja2 import StrictUndefined

from flask import (Flask, render_template, redirect, request, flash,
                   session, jsonify, g, url_for)


import os
import requests


import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

from functools import wraps

from flask_debugtoolbar import DebugToolbarExtension

from model import User, Task, Collect, Kao, Used_Kao,connect_to_db, db

import datetime
from datetime import timedelta
import random


# Tilia's modules
import timehelpers
import site_logic
import cal
import oAuth_flow
import hashes




# Required to use Flask sessions and the debug toolbar
import sys
import os.path


# app = Flask(__name__)
app = Flask(__name__, static_folder="dist")


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
        user = User.query.get(session["current_user_id"])
        return f(*args, **kwargs)
    return decorated_function

# @app.route('/')
# @app.route('/index')
# def index():
#     """Homepage."""
#     kao_dict = {
#         "shrug": u"¯\_(ツ)_/¯ Guess we can be productive today",
#         "supportive": u"~(˘▽˘~) I know you can do it!",
#         "dog": u" ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
#         "boxer": u"(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
#         "mage": u"(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
#         "bear": u"ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
#         "allieB": u"╰(°ロ°)╯ Do all the things!"
#         }
#     slogan = random.choice(list(kao_dict.values() ) ) 
#     # print(slogan)
#     flash("index flashed message")
#     flash("another flashed message")
#     return render_template("index.html",slogan=slogan)  


@app.route('/')
@app.route('/index')
def index_wp():
    # flash("iwp flashed message")

    return render_template('index-wp.html')

@app.route('/r')
@app.route('/indexr')
def indexr():
    flash("this is a flash message")
    return render_template("indexr.html")  

@app.route('/slogan.json')
def slogan():
    kao_dict = {
        "shrug": u"¯\_(ツ)_/¯ Guess we can be productive today",
        "supportive": u"~(˘▽˘~) I know you can do it!",
        "dog": u" ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
        "boxer": u"(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
        "mage": u"(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
        "bear": u"ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
        "allieB": u"╰(°ロ°)╯ Do all the things!"
        }
    random_slogan = random.choice(list(kao_dict.keys()))

    return jsonify(kao_dict.get(random_slogan))

# @app.route("/register")
# def register():
#     """displays page to register a new account"""
#     if session.get("current_user_id"):
#         return redirect("/tasks")

#     timezones = timehelpers.TIMEZONES
#     return render_template("register.html", timezones=timezones)

@app.route("/get-timezones.json")
def get_timezones():
    timezones = timehelpers.TIMEZONES
    print(timezones)

    return jsonify(timezones)


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
    elif User.query.filter_by(email=email_input).first():
        flash("Sorry, your email is already in use")
        return redirect("/register")

    elif User.query.filter_by(username=username_input).first():
        flash("Sorry, your username has been taken")
        return redirect("/register")
    else:
        user = User(username=username_input,
                    email=email_input,
                    # password=hashes.get_hash(password_input1),
                    password = "placeholder",
                    timezone=timezone_input)

        db.session.add(user)
        user.password=hashes.get_salted_hash(password_input1,user.user_id,app.config['SECRET_KEY']),
        db.session.commit()

        # adding user to session
        session["current_user_id"] = user.user_id
        session["current_username"] = user.username

        return redirect("/tasks")





# @app.route('/login')
# def login():
#     """Homepage."""
#     if session.get("current_user_id"):
#         return redirect("/tasks")

#     return render_template("login.html")

@app.route('/login_confirm', methods = ['POST'])
def login_confirm():
    print("processes the login get request")
    username_input = request.form.get('username')
    pwd_input = request.form.get('password')
    user = User.query.filter_by(username=username_input).first()
    # save the user up here and check if user instead of making 2 queries
    if user:
        user_id = str(user.user_id)
        user_pwd_hash = user.password

        if hashes.val_salted_hash(pwd_input,user.user_id, app.config['SECRET_KEY'], user_pwd_hash):
        # if hashes.val_hash(pwd_input,user_pwd_hash):
            session["current_user_id"] = user_id
            session["current_username"] = user.username
            flash("You are now logged in")
            return redirect("/tasks")
        else:
            flash("Login failed - invalid Username or Password")
            # render_template doesn't play nice with React
            return redirect('/login')
    else:
        flash("Login failed - invalid Username or Password")
        return redirect('/login')


@app.route("/logout")
def logout():
    """Logout of web app"""
    if session.get("current_user_id"):
        del session["current_username"]
        del session["current_user_id"]
        if session.get('credentials'):
            del session['credentials']
        flash("You are now logged out")
        return redirect("/")
    else:
        return redirect("/")



# @app.route('/tasks')
# @login_required
# def view_tasks():
#     """Homepage."""
#     user = User.query.get(session["current_user_id"])
#     tasks = user.tasks

#     EOD = timehelpers.get_user_EOD(user.timezone)
    

#     return render_template("tasks2.html", tasks=tasks,EOD=EOD)

        
    # current_user = User.query.filter_by(username=username_input).first()


@app.route("/tasks-js")
@login_required
def get_tasks_js():
    user = User.query.get(session["current_user_id"])
    return render_template("tasks_js.html", EOD=2)



@app.route("/get-user-info.json", methods=['GET'])
@login_required
def get_user_info():
    user = User.query.get(session["current_user_id"])
    user_dict = site_logic.convert_user_to_dict(user)

    return jsonify(user_dict)   

@app.route("/get-kaos.json", methods=['GET'])
@login_required
def get_kaos():
    user = User.query.get(session["current_user_id"])
    collects = Collect.query.filter_by(user_id=user.user_id).all()

    collect_dict = site_logic.convert_collects_to_dict(collects)
    print(collect_dict)
    return jsonify(collect_dict) 



@app.route("/get-tasks.json", methods=['GET'])
@login_required
def get_tasks_list():
    user = User.query.get(session["current_user_id"])
    print("call made to /get-tasks.json")
    # user = User.query.get(21)
    task_list = site_logic.convert_tasklist_to_list(user.tasks)

    return jsonify(task_list)   

@app.route("/get-task-dict.json", methods=['GET'])
@login_required
def get_tasks_dict():
    user = User.query.get(session["current_user_id"])
    print("call made to /get-task-dict.json")
    # user = User.query.get(21)
    print(user.tasks)
    task_dict = site_logic.convert_tasklist_to_dict(user.tasks,user.timezone)

    return jsonify(task_dict)   

@app.route("/get-eod.json", methods=['GET'])
@login_required
def get_eod():
    user = User.query.get(session["current_user_id"])
    print("call made to /get-eod.json")
    # user = User.query.get(21)
    EOD = timehelpers.get_user_EOD(user.timezone)
    print(EOD)

    EOD_dict = site_logic.convert_datetime_to_dict(EOD)
    return jsonify(EOD_dict)  


@app.route("/new_task")
@login_required
def new_task():
    """page for adding new tasks"""
    user = User.query.get(session["current_user_id"])

    EOD = timehelpers.get_user_EOD(user.timezone)

    return render_template("new_task.html", eod=EOD)


# Consider sharing code with confirm_edit

@app.route("/add_new_task", methods=["POST"])
@login_required
def add_new_task():
    """Adds a new task to a user's task list"""

    user = User.query.get(session["current_user_id"])

    task_msg_input = request.form.get("msg")
    # print("msg received is: ", task_msg_input)
    is_repeating_input = request.form.get("repeating")
    # Reinvent the super slick syntax
    is_repeating = True if is_repeating_input == "True" else False

    # usr_time=13:44 


    user_tz_str = user.timezone
    if request.form.get("today") or request.form.get("duedate") == "":
        print("date is empty string")
        duedate_input = datetime.datetime.now()
        due_date = timehelpers.get_user_midnight_utc(duedate_input,user_tz_str)

    else:
        duedate_input = request.form.get("duedate")
        # print("input received: ", duedate_input)
        due_date = timehelpers.convert_date_string_to_localized_datetime(duedate_input,user_tz_str)
        # print("due_date converted to: ", due_date)
        # print("original due_date: ", duedate_input)
        # duedate_datetime_localized = user_zone.localize(duedate_datetime)

    due_time = request.form.get("due_time")
    if due_time:
        due_time_delta = timehelpers.convert_time_string_to_localized_time_delta(due_time)
        due_date = due_date + due_time_delta

    task = Task(msg=task_msg_input,
                is_repeating=is_repeating,
                due_date = due_date,
                user_id=session["current_user_id"])
    print("due_date in task: ",task.due_date)


    db.session.add(task)
    db.session.commit()
    # print(Task.query.all())
    return redirect("/tasks")


# @app.route("/edit_task/<task_id>")
# @login_required
# def edit_task(task_id):
#     """lets a user edit a task"""

#     user = User.query.get(session["current_user_id"])
#     task = Task.query.get(task_id)
#     if task.user_id != user.user_id:
#         flash("Invalid task id")
#         return redirect('/tasks')

#     return render_template("edittask.html", 
#                             task=task)

# Consider sharing code with add_new_task
@app.route("/confirm-edit", methods=["POST"])
@login_required
def confirm_edit():
    print("call make to /confirm-edit route")
    user = User.query.get(session["current_user_id"])
    task = Task.query.get(int(request.form.get("task_id")))

    task_msg_input = request.form.get("msg")
    task.msg = task_msg_input

    is_repeating_input = request.form.get("repeating")
    print("isrepeating_input: ", is_repeating_input)
    # Re-invent the succinctness
    task.is_repeating = True if is_repeating_input == "True" else False


    user_tz_str = user.timezone

    if request.form.get("today") or request.form.get("duedate") == "":
        duedate_input = datetime.datetime.now()
        due_date = timehelpers.get_user_midnight_utc(duedate_input,user_tz_str)

    else:
        duedate_input = request.form.get("duedate")
        # print("input received: ", duedate_input)
        due_date = timehelpers.convert_date_string_to_localized_datetime(duedate_input,user_tz_str)

    # print(task.msg)
    task.due_date = due_date
    print("before commit, task duedate is: ", task.due_date)

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


# @app.route("/complete-task", methods=["POST"])
# @login_required
# def complete_task():
#     """Adds a new task to a user's task list"""

#     task_id = int(request.form.get("task_id"))
#     user = User.query.get(session.get("current_user_id"))

#     task = Task.query.get(task_id)
#     # A line of code the changes the task to is_complete = False
#     # user.no_of_logins += 1
                
#     if task.is_repeating == True:
#         task.due_date = timehelpers.get_user_tomorrow_EOD(user.timezone)
#         db.session.commit()
#     else:
#         task.is_complete = True
#         task.completion_date = timehelpers.get_now_UTC()
#         db.session.commit()
#     if timehelpers.check_remaining_tasks(user.tasks,user.timezone):
#         return redirect("/collect-kao")
#     return redirect("/tasks")

# @app.route("/undo_complete", methods=["POST"])
# @login_required
# def undo_complete():
#     """Adds a new task to a user's task list"""

#     task_id = int(request.form.get("task_id"))

#     task = Task.query.get(task_id)
#     task.is_complete = False
#     db.session.commit()

#     # print("taskid: ",task_id," - Task: ", task, "is_complete: ",task.is_complete)
#     return redirect("/tasks")


@app.route("/undo-complete-task", methods=["POST"])
@login_required
def undo_complete():
    # print([ (key,value) for key, value in request.form.items()])
    task_id = int(request.json.get("task_id"))
    # print(request.form.get(task_id))

    task = Task.query.get(task_id)
    task.is_complete = False
    db.session.commit()


    return "task un-done"
      
@app.route("/complete-task", methods=["POST"])
@login_required
def complete_task():
    task_id = int(request.json.get("task_id"))
    user = User.query.get(session.get("current_user_id"))

    task = Task.query.get(task_id)
#     # A line of code the changes the task to is_complete = False
#     # user.no_of_logins += 1
                
    if task.is_repeating == True:
        task.due_date = timehelpers.get_user_tomorrow_EOD(user.timezone)
        db.session.commit()
    else:
        task.is_complete = True
        task.completion_date = timehelpers.get_now_UTC()
        db.session.commit()
    # if timehelpers.check_remaining_tasks(user.tasks,user.timezone):
    #     return redirect("/collect-kao")
    
    print("task completed")
    return "Task Completed"


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
    print("call made to /collect-kao route")
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

        flash("You have already collected a Moji for the day, but good job anyways!")
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


# @app.route('/test')
# def test_api_request():
#   if 'credentials' not in session:
#     return redirect('authorize')

#   # Load credentials from the session.
#   credentials = google.oauth2.credentials.Credentials(
#       **session['credentials'])

#   calendar = googleapiclient.discovery.build('calendar', 'v3', credentials=credentials)

# #     CAL = build('calendar', 'v3', credentials=creds)

#   # files = drive.files().list().execute()
#   events = calendar.calendarList().get(calendarId='primary').execute()

#   # Save credentials back to session in case access token was refreshed.
#   # ACTION ITEM: In a production app, you likely want to save these
#   #              credentials in a persistent database instead.
#   # session['credentials'] = credentials_to_dict(credentials)


#   return jsonify(**events)


@app.route("/oAuth-authorize")
@login_required
def google_oAuth_authorization():
    """google oAuth authorization flow"""

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file("client_secrets.json",
     scopes=["https://www.googleapis.com/auth/calendar"])

    flow.redirect_uri = url_for('oAuth_callback', _external=True)

    authorization_url, state = flow.authorization_url(
    # Enable offline access so that you can refresh an access token without
    # re-prompting the user for permission. Recommended for web server apps.
    access_type='offline',
    # Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes='true')
    # Consider a name like oAuthState so that other state-related stuff doesn't get mixed up
    session['state'] = state


    # flow = oAuth_flow.flow

    # authorization_url = oAuth_flow.authorization_url
    
    # print(authorization_url)
# login_hint: string, Either an email address or domain. Passing this
#  |                      hint will either pre-fill the email box on the sign-in
#  |                      form or select the proper multi-login session, thereby
#  |                      simplifying the login flow.

    return redirect(authorization_url)


@app.route("/oAuth-callback") #this is the callback page
@login_required
def oAuth_callback():
    user = User.query.get(session["current_user_id"])

    state = session['state']
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        'client_secrets.json',
        scopes=['https://www.googleapis.com/auth/calendar'],
        state=state)

    flow.redirect_uri = url_for('oAuth_callback', _external=True)

    authorization_response = request.url
    print("Authorization response(request.url", authorization_response)
    flow.fetch_token(authorization_response=authorization_response)

    # Store the credentials in the session.


    #     Store user's access and refresh tokens in your data store if
    #     incorporating this code into your real app.
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes}

    # print("flow credentials are: ",flow.credentials)
    # print("flow refresh token is: ", credentials.refresh_token)

    ######### ACTION ITEM for developers: TILIA DO THIS ##############
    user.oAuth_token = session['credentials']['token']
    # User.oAuth_refresh_token = session['credentials']['refresh_token']
    # print("refresh token: ", session['credentials']['refresh_token'])

    # print(user.oAuth_token)
    # print(user.oAuth_refresh_token)
    db.session.commit()


    flash("Connected to Google") 
    return redirect("/tasks")


@app.route("/create-cal-event", methods=['POST'])
@login_required
def create_cal_event():
    user = User.query.get(session["current_user_id"])
    task_id = int(request.form.get("task_id"))
    print("task id is: ",task_id)
    task = Task.query.get(task_id)
    print("task to be eventified:",task)
    if 'credentials' not in session:
        return redirect('/oAuth-authorize')

    # BUILD credentials from the DB -- ACTION ITEM (TILIA)

    credentials = google.oauth2.credentials.Credentials(
    **session['credentials'])

    print("session['credentials'] : ",session['credentials'])
    ## ACTUALLY TILIA ACTION ITEM IS TO PULL user token and 
    # user refresh token from DB rather than session


    # files = drive.files().list().execute()

    # Save credentials back to session in case access token was refreshed.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.

    # session['credentials'] = credentials_to_dict(credentials)
    session['credentials'] = {
        'token': user.oAuth_token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes}
    # return jsonify(**files)



    ev = cal.convert_task_to_cal_event(task,user)
    print("event object: ",ev)
    
    cal.create_event(ev,credentials)
    flash("Your task was added to your calendar")
    return redirect('/tasks')



@app.errorhandler(404)
def not_found(error):
    return render_template('index-wp.html')

if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the
    # point that we invoke the DebugToolbarExtension
    # app.debug = True
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    connect_to_db(app)


    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(port=5000,debug=False, host='0.0.0.0')



