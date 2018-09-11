from datetime import date,time,datetime,tzinfo,timedelta
# from pytz import timezone
import pytz

#Days start at 0 for monday
DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
TIMEZONES = [zone.rstrip() for zone in open("seed_data/u.timezones")]

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


print(get_midnight())


def get_user_midnight(user):
	"""Returns UTC datetime corresponding to user's midnight on that day"""
	now = datetime.now()
	utc = pytz.utc
	user_zone = pytz.timezone(user.timezone)

	now_local_UTC = utc.localize(now)

	user_normalized_time = user_zone.normalize(now_local_UTC)
	user_normalized_time.date()
	user_midnight = datetime(user_normalized_time.year,
							 user_normalized_time.month,
							 user_normalized_time.day,
							 0,0,0)

	return user_zone.localize(user_midnight)





def user_time_to_UTC(due_date,user):
	pass

	


def localize_to_user_timezone(dt, user):
  utc = pytz.utc
  dt = utc.localize(dt)
  user_zone = pytz.timezone(user.timezone)
  user_time= user_zone.normalize(dt)
  return user_time
