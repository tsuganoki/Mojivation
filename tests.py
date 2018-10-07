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
        PRESERVE_CONTEXT_ON_EXCEPTION = False

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
        # print("bob username is: ", bob.username)
        # print("bob password is: ", bob.password)
        with self.client as c:
            result = c.get('/login_confirm?username=bobrules&password=abc123',
                    # ACTION ITEM: This is definitely going to break, login is now a post request
                            follow_redirects=True
                            )


            # print(result.data)
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
 
            # print("we are logged in as user id :", sess.get("current_user_id"))
            
            result = self.client.get('/logout', follow_redirects=True)
            


            self.assertNotIn(b'current_user_id', session)
            # print("we are logged in as user id :", session.get("current_user_id"))
            self.assertIn(b'now logged out', result.data)


    def test_user_add_task(self):
        """tests that user can POST a task to the testdb"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess['current_user_id'] = "1"
                sess['current_username'] = "bobrules"


            result = c.post('/add_new_task',
                            data = {'msg': 'make smores cupcakes',
                                    'repeating': "False",
                                    'duedate':'2018-12-31'},
                            follow_redirects=True
                            )
                # self.assertEqual(session['user_id'], '42')
            self.assertIn(b'make smores cupcakes', result.data)


    def test_user_complete_task(self):
        """tests that user can complete a task"""

        with self.client as c:
            with c.session_transaction() as sess:
                sess['current_user_id'] = "1"
                sess['current_username'] = "bobrules"


            result = c.post('/complete-task',
                            data = {'task_id': '1'},
                            follow_redirects=True
                            )
            task = Task.query.get(1)
            self.assertEqual(task.is_complete, True)
            # self.assertIn(b'', result.data)


    # def test_user_collect_kao(self):
    #     """Tests that a user gets a kao when they complete all their tasks for the day"""

    #     with self.client as c:
    #         with c.session_transaction() as sess:
    #             sess['current_user_id'] = "2"
    #             sess['current_username'] = "qian"

    #         task = Task.query.get(3)
    #         print(task)

    #         result = c.post('/complete-task',
    #                         data = {'task_id': '3'},
    #                         follow_redirects=True
    #                         )
    #         task = Task.query.get(3)
    #         print(task)
    #         self.assertIn(b"You have collected a Moji",result.data)

    # def test_select_new_kao_route(self):
    #      with self.client as c:
    #         with c.session_transaction() as sess:
    #             sess['current_user_id'] = "2"
    #             sess['current_username'] = "qian"
    #         result = c.get("/select-new-kao")

    # def test_select_new_kao_function(self):

    #      with self.client as c:
    #         with c.session_transaction() as sess:
    #             sess['current_user_id'] = "2"
    #             sess['current_username'] = "qian"

    #         used_kaos = Used_Kao.query.all()
    #         kaos = Kao.query.all()
    #         new_kao_id = timehelpers.select_new_kao(used_kaos=used_kaos,kaos=kaos)
            
    #         self.assertNotIn(new_kao_id,[kao.id for kao in used_kaos])            
    #         self.assertNotIn(new_kao_id,[kao.id for kao in kaos])            






if __name__ == "__main__":
    import unittest

    unittest.main()
