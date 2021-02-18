import unittest
import sys
import json
import urllib.request

API_BASE_URL = 'http://localhost:5000/'

def get_JSON_string(url):
    # url = API_BASE_URL
    data_from_server = urllib.request.urlopen(url).read()
    string_from_server = data_from_server.decode('utf-8')
    # self.video_dict_list = json.loads(string_from_server)
    return json.loads(string_from_server)

class MainPageTester(unittest.TestCase):
    '''
    Return a list of data of trending videos. 
    The data of vidoes are represented as dictionaries of the form: 
        {
            'link': 'kgaO45SyaO4',
            'title': 'The New SpotMini',
            'channel': 'BostonDynamics',
            'publish_time': '2017-11-13T20:09:58.000Z',
            'views': '75752',
            'likes': '9419',
            'dislikes': '52',
            'comments': '1230',
            'thumbnail_link': 'https://i.ytimg.com/vi/kgaO45SyaO4/default.jpg'
        }
    The full result of setUp would be like below:
        [{'link':'kgaO45SyaO4', ... ,'thumbnail_link':'https://i.ytimg.com/vi/kgaO45SyaO4/default.jpg'},
        {'link':'PaJCFHXcWmM', ... ,'thumbnail_link':'https://i.ytimg.com/vi/PaJCFHXcWmM/default.jpg'}]   
    '''
    def setUp(self):
        url = API_BASE_URL
        self.video_dict_list = get_JSON_string(url)
        
    def tearDown(self):
        pass

    def test_is_empty(self):    
        self.assertFalse(not self.video_dict_list)

    def test_keys(self):
        keys = ['link','title','channel','publish_time','views','likes','dislikes','comments','thumbnail_link']
        self.assertTrue(self.video_dict_list[0].keys() == keys)

    def test_types(self):
        video = self.video_dict_list[0]
        self.assertIsInstance(video.get('link'), str)
        self.assertIsInstance(video.get('title'), str)
        self.assertIsInstance(video.get('channel'), str)
        self.assertIsInstance(video.get('publish_time'), str)
        self.assertIsInstance(video.get('views'), int)
        self.assertIsInstance(video.get('likes'), int)
        self.assertIsInstance(video.get('dislikes'), int)
        self.assertIsInstance(video.get('comments'), int)
        self.assertIsInstance(video.get('thumbnail_link'), str)

class SignUpTester(unittest.TestCase):
    ''' returns a success code if the username is not taken, else an error code '''
    
    def setUp(self):
        url = {API_BASE_URL} + 'sign-up/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)
    # After implementing server and database, add a test to check whether message already exists in the database.

class LogInTester(unittest.TestCase):
    '''
    Returns a success code and user information if the username exists, else an error code
    '''
        def setUp(self):
        url = {API_BASE_URL} + 'log-in/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)
    # After implementing server and database, add a test to check whether message already exists in the database.

class SaveToPlaylistTester(unittest.TestCase):
    ''' returns a success code if the video is not in the playlist and saved successfully, else an error code '''
    
    def setUp(self):
        url = {API_BASE_URL} + 'save-to-playlist/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)

class SearchTest(unittest.TestCase):
    ''' returns a success code if logged out successfully, else an error code  '''
    
    def setUp(self):
        url = {API_BASE_URL} + 'videos?title_contains={search_text}
        &category={category}&channel={channel}&publish-time={publish-time}&sort-option={sort-option}/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

class MyPageTest(unittest.TestCase):
    ''' returns a success code if logged out successfully, else an error code  '''
    
    def setUp(self):
        url = {API_BASE_URL} + 'my-page?user={username}/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

class LogOutTest(unittest.TestCase):
    ''' returns a success code if logged out successfully, else an error code  '''
    
    def setUp(self):
        url = {API_BASE_URL} + 'log-out/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)

if __name__ == '__main__':
    unittest.main()

