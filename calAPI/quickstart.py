from __future__ import print_function
import datetime
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools

# If modifying these scopes, delete the file token.json.
SCOPES = 'https://www.googleapis.com/auth/calendar'

def main():
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
    service = build('calendar', 'v3', http=creds.authorize(Http()))

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    # print('Getting the upcoming 10 events')
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                        maxResults=10, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])

    if not events:
        print('No upcoming events found.')
    # for event in events:
    #     start = event['start'].get('dateTime', event['start'].get('date'))
    #     print(start, event['summary'])


    CAL = build('calendar', 'v3', http=creds.authorize(Http()))

    GMT_OFF = '-07:00'

    EVENT = {
        'summary' : 'Blake is Cute',
        'start'   : {'dateTime' : '2018-10-02T08:30:48{}'.format(GMT_OFF)},
        'end'     : {'dateTime' : '2018-10-02T09:30:48{}'.format(GMT_OFF)}
    }

    ev = CAL.events().insert(calendarId='primary',
                             sendNotifications=False,
                             body=EVENT
                             ).execute()



if __name__ == '__main__':
    main()