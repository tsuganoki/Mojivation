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

