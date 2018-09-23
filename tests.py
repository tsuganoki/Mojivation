from unittest import TestCase
from server import app
from model import connect_to_db, db, example_data, User, Task
from flask import session
from server import install_secret_key
import timehelpers

# class FlaskTestsBasic(TestCase):
#     """Flask tests."""

#     def setUp(self):
#         """Stuff to do before every test."""

#         # Get the Flask test client
#         self.client = app.test_client()

#         # Show Flask errors that happen during tests
#         app.config['TESTING'] = True

#     def test_index(self):
#         """Test homepage page."""

#         result = self.client.get("/")
#         self.assertIn(b"class=\"home-page-mantra\"", result.data)


class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data
        # db.drop_all()
        db.create_all()
        example_data()
        # users = User.query.all()
        # bob = User.query.get(1)


    def tearDown(self):
        """Do at end of every test."""

        db.session.remove()
        db.drop_all()
        db.engine.dispose()

    def test_users_list(self):
        """Test users db."""
        bob = User.query.filter_by(username="bobrules").first()
        # result = self.client.get("/users")
        self.assertIn("bobrules", bob.username)

    def test_departments_details(self):
        """Test tasks page."""

        qian = User.query.filter_by(username="qian").first()

        all_tasks = Task.query.all()
        
        bao_user_id = all_tasks[1].user_id
        # print("baouser id: ",bao_user_id)
        # print(User.query.get(bao_user_id))


        # print(all_tasks)
        self.assertIn("eat bao", qian.tasks[0].msg)


    def test_user_log_in(self):
        """test that a user can log in"""

        bob = User.query.get(1)
        print("bob username is: ", bob.username)
        print("bob password is: ", bob.password)
        with self.client as c:
            result = c.get('/login_confirm?username=bobrules&password=abc123',
                            follow_redirects=True
                            )


            print(result.data)
            # print(sess.items())
            self.assertEqual(session['current_user_id'], "1")

            # with c.session_transaction() as sess:
                # self.assertIn("current_user_id",sess)
                # self.assertIs(sess.get("current_user_id"),2)


    def test_logout(self):
        """Test logout route."""

        with self.client as c:
            with c.session_transaction() as sess:
                sess['current_user_id'] = "1"
                sess['current_username'] = "bobrules"
 
            print("we are logged in as user id :", sess.get("current_user_id"))
            
            result = self.client.get('/logout', follow_redirects=True)
            


            self.assertNotIn(b'current_user_id', session)
            print("we are logged in as user id :", session.get("current_user_id"))
            # self.assertIn(b'now Logged Out', result.data)


    def test_user_add_task(self):
        """tests that a user can make a post request to add a task"""

        pass









# class FlaskTestsLoggedIn(TestCase):
#     """Flask tests with user logged in to session."""

#     def setUp(self):
#         """Stuff to do before every test."""

#         app.config['TESTING'] = True
#         # install_secret_key(app)
#         self.client = app.test_client()

#         connect_to_db(app, "postgresql:///testdb")

#         # Create tables and add sample data
#         # db.drop_all()
#         db.create_all()
#         example_data()

#         with self.client as c:
#             with c.session_transaction() as sess:
#                 sess['current_user_id'] = 1


#     def tearDown(self):
#         """Do at end of every test."""

#         db.session.remove()
#         db.drop_all()
#         db.engine.dispose()

#     def test_task_page(self):
#         """Test logged in viewing Task page."""
  
#         result = self.client.get("/tasks")

#         self.assertIn(b"All Tasks", result.data)

#     def test_check_remaining_tasks(self):
#         """test for the check remaining tasks function"""
#         # print("session is: ", session.get("current_user_id"))
#         # all_users = User.query.all()
#         # all_tasks = Task.query.all()
#         # for i in all_tasks:
#         #     print (i)
#         # for i in all_users:
#         #     print (i)

#         bob = User.query.filter_by(email="bob@gmail.com").first()
#         # check_remaining_tasks(tasks,tz_string)
#         self.assertIs(timehelpers.check_remaining_tasks(bob.tasks,bob.timezone),False)

#     def test_add_a_task(self):
#         """Test that a task can be added"""

#         # result = self.client.post("/add_new_task", "Order a new cakepan") #how to test a post request?
#         # self.assertIn()

#     def test_complete_a_task(self):
#         """check that a completed task is completed"""

#         result = self.client.get("/complete-task")

#     def test_kaos_view(self):
#         """test the kao display functionality"""

#         result = self.client.get("/user-info")

#         self.assertIn(b"User Info",result.data)


#     def test_kaos(self):
#         """test the kao addition functionality"""







if __name__ == "__main__":
    import unittest

    unittest.main()
