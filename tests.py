from unittest import TestCase
from server import app
from model import connect_to_db, db, example_data, User, Task
from flask import session
from server import install_secret_key

class FlaskTestsBasic(TestCase):
    """Flask tests."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config['TESTING'] = True

    def test_index(self):
        """Test homepage page."""

        result = self.client.get("/")
        self.assertIn(b"class=\"home-page-mantra\"", result.data)


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


class FlaskTestsLoggedIn(TestCase):
    """Flask tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True
        # install_secret_key(app)
        self.client = app.test_client()

        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data
        # db.drop_all()
        db.create_all()
        example_data()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['current_user_id'] = 1
    def tearDown(self):
        """Do at end of every test."""

        db.session.remove()
        db.drop_all()
        db.engine.dispose()

    def test_task_page(self):
        """Test logged in viewing Task page."""
        # print("session is: ", session.get("current_user_id"))
        result = self.client.get("/tasks")

        self.assertIn(b"All Tasks", result.data)

if __name__ == "__main__":
    import unittest

    unittest.main()
