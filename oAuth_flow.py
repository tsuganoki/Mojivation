from oauth2client.client import flow_from_clientsecrets
...
flow = flow_from_clientsecrets('path_to_directory/client_secrets.json',
                               scope='https://www.googleapis.com/auth/calendar',
                               redirect_uri='http://example.com/auth_return')
