from datetime import date,time,datetime,tzinfo,timedelta
from pytz import timezone
import pytz

#Days start at 0 for monday
DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
# today = datetime.date.today()
# weekday = DAYS[today.weekday()]

# %c- indicates the local date and time
# %x- indicates the local date
# %X- indicates the local time
# nyd = date(today.year, 1, 1)  # get New Year Day for the same year




# Notes on localizing and adjusting timezones

# def convert_PST(dtime):
# 	PST_time = dtime + timedelta(hours=-8)
# 	PST_time = timezone("US/Pacific").localize(PST_time)
# 	return PST_time

# pst_now = convert_PST(now)

# pst_now.tzinfo
# <DstTzInfo 'US/Pacific' PDT-1 day, 17:00:00 DST>

# pst_now.tzinfo.zone
# 'US/Pacific'


# You can create a datetime object with a built in 
# timezone by passing it in as an argument:

# >>> utc_dt = datetime(2002, 10, 27, 6, 0, 0, tzinfo=utc)

# timezones
UTC = pytz.utc
EST = timezone('US/Eastern')

def get_midnight():
	today = datetime.today()
	midnight = datetime(year=today.year,
						month=today.month,
						day=today.day
								  )

	return midnight


print(get_midnight())