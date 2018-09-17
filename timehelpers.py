from datetime import date,time,datetime,tzinfo,timedelta

from model import User, Task, Collect, Kao, connect_to_db, db
from sqlalchemy import func
# from server import app


# from pytz import timezone
import pytz

#Days start at 0 for monday
DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
TIMEZONES = [zone.rstrip() for zone in open("seed_data/u.timezones")]
TODAYS_KAO = {"date": datetime.now(),
				"kao_id": 2}

# check condition each time a task is completed
# if no tasks pending, then do kao-logic
# then check the date against the previously stored date and either 
# use the same kao-moji or select a different one, and update
# the date. 


def my_function():
	TODAYS_KAO["date"] = datetime.now()

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

def get_midnight():
	today = datetime.today()
	midnight = datetime(year=today.year,
						month=today.month,
						day=today.day
								  )

	return midnight


print("UTC midnight: ", get_midnight().ctime())


def get_user_midnight(tz_string):
	"""Returns UTC datetime corresponding to user's midnight on that day"""
	utc = pytz.utc
	user_zone = pytz.timezone(tz_string)

	user_normalized_time = datetime.now().astimezone(user_zone)

	user_midnight = datetime(user_normalized_time.year,
							 user_normalized_time.month,
							 user_normalized_time.day)

	return user_zone.localize(user_midnight)


def get_user_EOD(tz_string):
	"""returns user's EOD in UTC"""
	now = datetime.now()
	EOD = get_user_midnight_utc(now,tz_string) + timedelta(days=1)
	utc = pytz.utc

	return EOD


def get_user_midnight_utc(dt,tz_string):
	"""returns a UTC time corresponding to a midnight in user's current timezone"""

	user_zone = pytz.timezone(tz_string)
	user_today = dt.astimezone(user_zone)
	user_midnight = datetime(user_today.year,user_today.month,user_today.day)

	user_midnight_utc = user_midnight - (user_zone).utcoffset(user_midnight)
	return user_midnight_utc



# OFFSET IS IMPORTant
# est.utcoffset(now)

# def localize_to_user_timezone(dt, user):
#   utc = pytz.utc
#   dt = utc.localize(dt)
#   user_zone = pytz.timezone(user.timezone)
#   user_time= user_zone.normalize(dt)
#   return user_time


def reset_repeating_tasks():
	repeating_tasks = Task.query.filter_by(is_repeating=True, is_complete=True).all()
	for task in repeating_tasks:
		task.is_complete = False
		db.session.commit()



