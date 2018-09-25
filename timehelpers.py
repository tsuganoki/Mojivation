from datetime import date,time,datetime,tzinfo,timedelta

from model import User, Task, Collect, Kao, connect_to_db, db
from sqlalchemy import func
from random import randint, choice
# from server import app


# from pytz import timezone
import pytz

#Days start at 0 for monday
DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
TIMEZONES = [zone.rstrip() for zone in open("seed_data/u.timezones")]



# check condition each time a task is completed
# if no tasks pending, then do kao-logic
# then check the date against the previously stored date and either 
# use the same kao-moji or select a different one, and update
# the date. 


def check_remaining_tasks(tasks,tz_string):
	
	# print("EOD is: ",EOD.ctime())
	EOD = get_user_EOD(tz_string)
	for task in tasks:
		print(task.due_date.ctime())
		if task.due_date <= EOD and task.is_complete == False:

			print("there are some tasks remaining for today")
			return False 
	print("there are no tasks remaining for today")
	return True

def check_kao_date():
	"""returns True if current kao is still active"""
	now = datetime.now()
	if now <= add_24_hrs(TODAYS_KAO.get("date")):
		return True
	else:
		return False

def get_todays_kao(tz_str):

	now = datetime.now()
	tz = pytz.timezone(tz_str)
	user_time = datetime.now().astimezone(user_zone)


	return 111

	if one_thing:
		select_new_kao()
		return new_kao_id
	else:
		return kao_id


def award_kao():
	pass

def get_random_kao():
	kaos = list(range(25))
	new_kao = choice(kaos)
	return new_kao
	

def select_new_kao(used_kaos,kaos):

	prev_kaos = [uk.kao_id for uk in used_kaos]

	all_kaos = list(range(len(kaos)))

	available_kaos = [x for x in all_kaos if x not in prev_kaos]
	return choice(available_kaos)
	
	# used_kaos = [used_kao.kao_id for used_kao in Used_Kao.query.all()]



# KAOS_TUPLE = [enumerate(kao.rstrip()) for kao in open("seed_data/u.kaos")]



# today = datetime.date.today()
# weekday = DAYS[today.weekday()]

# %c- indicates the local date and time
# %x- indicates the local date
# %X- indicates the local time
# nyd = date(today.year, 1, 1)  # get New Year Day for the same year


# Notes on localizing and adjusting timezones




# You can create a datetime object with a built in 
# timezone by passing it in as an argument:

# >>> utc_dt = datetime(2002, 10, 27, 6, 0, 0, tzinfo=utc)

# timezones


UTC = pytz.utc
EST = pytz.timezone('US/Eastern')
PST = pytz.timezone('US/Pacific')

def get_midnight():
	today = datetime.today()
	midnight = datetime(year=today.year,
						month=today.month,
						day=today.day
								  )

	return midnight


# print("UTC midnight: ", get_midnight().ctime())


# def get_user_midnight(tz_string):
# 	"""Returns UTC datetime corresponding to user's midnight on that day"""
# 	utc = pytz.utc
# 	user_zone = pytz.timezone(tz_string)

# 	user_normalized_time = datetime.now().astimezone(user_zone)

# 	user_midnight = datetime(user_normalized_time.year,
# 							 user_normalized_time.month,
# 							 user_normalized_time.day)

# 	return user_zone.localize(user_midnight)


def get_user_EOD(tz_string):
	"""returns user's EOD in UTC"""
	now = datetime.now()
	EOD = add_24_hrs(get_user_midnight_utc(now,tz_string))
	# utc = pytz.utc

	return EOD

def convert_date_string_to_localized_datetime(datetime_string,tz_string):
	date_obj = datetime.strptime(datetime_string,"%Y-%m-%d") 
	tz = pytz.timezone(tz_string)
	due_date = tz.localize(date_obj)

	return add_24_hrs(due_date)


def get_user_midnight_utc(dt,tz_string):
	"""returns a UTC time corresponding to a midnight in user's current timezone"""

	user_zone = pytz.timezone(tz_string)
	user_today = dt.astimezone(user_zone)
	user_midnight = datetime(user_today.year,user_today.month,user_today.day)

	user_midnight_utc = user_midnight - (user_zone).utcoffset(user_midnight)
	return user_midnight_utc


def add_24_hrs(dt_obj):
	return dt_obj + timedelta(hours=24)



# OFFSET IS IMPORTant
# est.utcoffset(now)

# def localize_to_user_timezone(dt, user):
#   utc = pytz.utc
#   dt = utc.localize(dt)
#   user_zone = pytz.timezone(user.timezone)
#   user_time= user_zone.normalize(dt)
#   return user_time


def get_user_tomorrow_EOD(tz_string):
	"""takes in a user's timezone and returns tomorrow's EOD"""

	tz = pytz.timezone
	now = datetime.now()
	EOD = add_24_hrs(get_user_midnight_utc(now,tz_string))
	tomorrow_EOD = add_24_hrs(EOD)
	return tomorrow_EOD
