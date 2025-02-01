from datetime import datetime

from django.contrib.auth.models import User
from django.test import TestCase

from ...models import ChatLog

from ...domains import ChatLogDomain


class AiChatLogTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user("testusername", "testemail@email.com", "testpassword1")
        self.test_user2 = User.objects.create_user("testusername2", "testemail2@email.com", "testpassword2")
        self.test_user3 = User.objects.create_user("testusername3", "testemail3@email.com", "testpassword3")
        self.test_chat_log = ChatLog.objects.create(
            user=self.test_user,
            role_type=ChatLog.USER,
            message='{"role": "user", "content": "Alice and Bob are going to a science fair on Friday."}',
        )
        self.test_chat_log2 = ChatLog.objects.create(
            user=self.test_user,
            role_type=ChatLog.USER,
            message='{"role": "user", "content": "Alice and Bob went to a science fair last Friday."}',
            include_in_future=False,
        )
        self.test_chat_log3 = ChatLog.objects.create(
            user=self.test_user2,
            role_type=ChatLog.USER,
            message='{"role": "user", "content": "Frank and Rose went to a science fair last Friday."}',
            include_in_future=False,
        )

        for index in range(10):
            ChatLog.objects.create(
                user=self.test_user3,
                role_type=ChatLog.USER,
                message='{"role": "user", "content": "Message %d"}' % (index + 1),
                include_in_future=True,
            )

    def test_get_by_id(self):
        self.assertEqual(
            self.test_chat_log, ChatLogDomain.get_by_id(self.test_chat_log.id), "Did not get the expected object back"
        )

    def test_get_by_id_set(self):
        pass

    def test_get_by_user_id(self):
        pass

    def test_get_by_user_id_filter_and_limit(self):
        all_user_log = ChatLog.objects.filter(user=self.test_user3).all().count()

        result = ChatLogDomain.get_by_user_id_filter_and_limit(self.test_user3.id, 5)
        self.assertEqual(5, len(result), "Did not get the expected number of results back")
        expected_content = "Message %d"
        index = 10
        for entry in result:
            self.assertTrue((expected_content % index) in entry.message, "Did not get the appropriate message content")
            index -= 1

        self.assertNotEqual(all_user_log, result, "The result should have been a filtered list of entries")

    def test_is_valid_id(self):
        self.assertTrue(ChatLogDomain.is_valid_id(self.test_chat_log.id), "Expected the ID to be valid")
        self.assertFalse(ChatLogDomain.is_valid_id(12345), "Expected the ID to be invalid")

    def test_filter_queryset_by_user(self):
        test_queryset = ChatLog.objects.all()

        result = ChatLogDomain.filter_queryset_by_user(test_queryset, self.test_user)

        self.assertNotEqual(len(test_queryset), len(result), "The result queryset should not match the original")

        for entry in result:
            self.assertEqual(entry.user, self.test_user, "The resulting entry was not for our test user")

    def test_create_ai_chat_log(self):
        pass
