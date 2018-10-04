from oauth2client.client import flow_from_clientsecrets

flow = flow_from_clientsecrets('client_secrets.json',
           scope='https://www.googleapis.com/auth/calendar',
           redirect_uri='http://localhost:5000/oAuth-confirm')


flow.redirect_uri = 'http://localhost:5000/oAuth-confirm'

authorization_url = flow.step1_get_authorize_url()


# Redirect the user to auth_uri on your platform.

# authorization_url, state = flow.authorization_url(
#         # Enable offline access so that you can refresh an access token without
#         # re-prompting the user for permission. Recommended for web server apps.
#         access_type='offline',
#         # Enable incremental authorization. Recommended as a best practice.
#         include_granted_scopes='true')