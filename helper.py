import datetime

def get_midnight():
	today = datetime.datetime.today()
	midnight = datetime.datetime(year=today.year,
								  month=today.month,
								  day=today.day
								  )
	return midnight


print(get_midnight())