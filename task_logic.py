import datetime
from rfc3339 import rfc3339 as rfc

def convert_tasklist_to_dict(tasklist):

	task_dict = [  
		{"msg":task.msg, 
		"is_complete":task.is_complete,
		"due_date":task.due_date,
		"is_repeating":task.is_repeating,
		"user_id":task.user_id} for task in tasklist]

	return task_dict



def convert_task_to_cal_event(task,user):
	event = {}
	event['summary'] = task.msg

	event['end'] = 

	{
 "end": {
  "dateTime": "2018-10-01T03:12:14+00:00"
 },
 "start": {
  "dateTime": "2018-10-01T03:10:20+00:00"
 },
 "description": "a description of potato",
 "creator": {
  "displayName": "Mojivation"
 },
 "summary": "I AM A TIME LORD"
}
