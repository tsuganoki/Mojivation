from __future__ import print_function
import datetime
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools

import datetime
from rfc3339 import rfc3339 as rfc
import jsonify





def convert_task_to_cal_event(task,user):

    
    event = {}
    event['summary'] = task.msg

    event['start']   = { "dateTime": rfc(task.due_date) }
    event['end']     = { "dateTime": rfc(task.due_date + datetime.timedelta(hours=1)) }
    event["creator"] = {"displayName": user.username }
    return event




def create_event(ev, creds):
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    # If modifying these scopes, delete the file token.json.
    SCOPES = 'https://www.googleapis.com/auth/calendar'
    # store = file.Storage(creds)
    # creds = store.get()
    # if not creds or creds.invalid:
    #     flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
    #     creds = tools.run_flow(flow, store)
    CAL = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    # print(now)
    # print('Getting the upcoming 10 events')
    # events_result = service.events().list(calendarId='primary', timeMin=now,
    #                                     maxResults=10, singleEvents=True,
    #                                     orderBy='startTime').execute()
    # events = events_result.get('items', [])

    # GMT_OFF = '-07:00'

    # EVENT = {
    #     'summary' : 'TILIA IS A TIME WIZARD',
    #     'start'   : {'dateTime' : '2018-10-02T03:30:48{}'.format(GMT_OFF)},
    #     'end'     : {'dateTime' : '2018-10-02T05:30:48{}'.format(GMT_OFF)}
    # }

    EVENT = CAL.events().insert(calendarId='primary',
                             sendNotifications=False,
                             body=ev
                             ).execute()



