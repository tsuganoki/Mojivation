from celery import Celery
import requests 

# app = Celery('cel_tasks', broker='pyamqp://guest@localhost//')
app = Celery('cel_tasks', broker='pyamqp://localhost//')


@app.task
def add(x, y):
    return x + y

@app.task
def reset_repeating():
	URL = "http://localhost:5000/reset-repeating"
	r = requests.get(url = URL) 

	print("repeating tasks have been reset.")
	return "returned complete"

    # celery -A cel_tasks worker --loglevel=info