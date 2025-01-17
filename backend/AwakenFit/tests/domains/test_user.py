from django.contrib.auth.models import User
from django.test import TestCase

from ...domains import UserDomain


class UserDomainTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")

    def test_is_valid_id(self):
        self.assertTrue(UserDomain.is_valid_id(self.test_user.id), "Should have been a valid ID")
        self.assertFalse(UserDomain.is_valid_id(12345), "Should have been an invalid ID")

    def test_get_by_id(self):
        self.assertEqual(
            self.test_user,
            UserDomain.get_by_id(self.test_user.id),
            "Failed to get the expected record back",
        )
        self.assertEqual(
            self.test_user2,
            UserDomain.get_by_id(self.test_user2.id),
            "Failed to get the expected record back",
        )

    def test_get_by_id_set(self):
        id_set = set([self.test_user.id, self.test_user2.id])
        result = UserDomain.get_by_id_set(id_set)
        self.assertEqual(2, len(result), "Did not get the appropriate number of records back")
        test_users = [self.test_user, self.test_user2]
        for entry in result:
            self.assertTrue(entry in test_users, "Query returned an unexpected record")
