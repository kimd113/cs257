import unittest
import sys
import json
import urllib.request

API_BASE_URL = 'http://localhost:5000'

def get_JSON_string(url):
    # url = API_BASE_URL
    data_from_server = urllib.request.urlopen(url).read()
    string_from_server = data_from_server.decode('utf-8')
    # self.video_dict_list = json.loads(string_from_server)
    return json.loads(string_from_server)

class MainPageTester(unittest.TestCase):
    ''' tests the main page endpoint /'''

    def setUp(self):
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
        url = API_BASE_URL + '/'
        self.video_dict_list = get_JSON_string(url)
        
    def tearDown(self):
        pass

    def test_is_empty(self):    
        self.assertFalse(not self.video_dict_list)

    def test_keys(self):
        video = self.playlists[0][0]
        keys = ['link','title','channel','publish_time','views','likes','dislikes','comments','thumbnail_link']
        self.assertTrue(video.keys() == keys)

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
    ''' tests the ednpoint /sign-up '''

    def setUp(self):
        ''' returns a success code if the username is not taken, else an error code '''
        url = {API_BASE_URL} + '/sign-up/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)
    # After implementing server and database, add a test to check whether message already exists in the database.

class LogInTester(unittest.TestCase):
    ''' tests the endpoint /log-in'''

    def setUp(self):
    ''' Returns a success code and user information if the username exists, else an error code'''
        url = {API_BASE_URL} + '/log-in/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)
    # After implementing server and database, add a test to check whether message already exists in the database.

class SaveToPlaylistTester(unittest.TestCase):
    ''' test the endpoint /save-to-playlist '''
    
    def setUp(self):
        ''' returns a success code if the video is not in the playlist and saved successfully, else an error code '''
        url = {API_BASE_URL} + '/save-to-playlist/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)

class SearchTester(unittest.TestCase):
    '''
        test for the search endpoint 
        /videos?title_contains={search_text}&category={category}&channel={channel}&publish-time={publish-time}&sort-option={sort-option}
    '''
    def setUp(self):
        ''' Return a list of data of videos searched by queries below:
        search_text, category, channel, publish_time, sort_option.

        The data of vidoes are represented as dictionaries of the form same as the list from MainPageTester: 

        The full result of setUp would be like below:
            [{'link':'kgaO45SyaO4', ... ,'thumbnail_link':'https://i.ytimg.com/vi/kgaO45SyaO4/default.jpg'},
            {'link':'PaJCFHXcWmM', ... ,'thumbnail_link':'https://i.ytimg.com/vi/PaJCFHXcWmM/default.jpg'}]    
        '''
        search_text = 'Is'
        category = 'music'
        channel = 'ChildishGambinoVEVO'
        publish_time = '2018_05'
        sort_option = 'views'
        url = f'{API_BASE_URL}/videos?title-contains={search_text}&category={category}'
        +f'&channel={channel}&publish-time={publish_time}&sort-option={sort_option}/'
        self.video_dict_list = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):    
        self.assertFalse(not self.video_dict_list)

    def test_keys(self):
        video = self.playlists[0][0]
        keys = ['link','title','channel','publish_time','views','likes','dislikes','comments','thumbnail_link']
        self.assertTrue(video.keys() == keys)

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

class InvalidSearchTester(unittest.TestCase):
    '''
        test for the search endpoint /videos?title_contains={search_text}
        in this case the search string cannot be found and the API should return an empty list
    '''
    def setUp(self):
        ''' Returns Null because the search string cannot be found  '''
        search_text = '---------------------'
        url = f'{API_BASE_URL}/videos?title-contains={search_text}/'
        self.video_dict_list = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):    
        self.assertTrue(not self.video_dict_list)

class MyPageTester(unittest.TestCase):
    '''
        test for endpoint /my-page?user={username}, where username is a user with existing playlists
    '''
    
    def setUp(self):
        ''' 
            Returns a JSON array of arrays, each of which represents a playlist. 
            Each playlist array is a JSON list of dictionaries, each of represents a video.  
        '''
        username = 'user1'
        url = f'{API_BASE_URL}/my-page?user={username}/'
        self.playlists = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):    
        self.assertFalse(not self.playlists)
        self.assertFalse(not self.playlists[0])

    def test_keys(self):
        video = self.playlists[0][0]
        keys = ['link','title','channel','publish_time','views','likes','dislikes','comments','thumbnail_link']
        self.assertTrue(video.keys() == keys)

    def test_types(self):
        video = self.playlists[0][0]
        self.assertIsInstance(video.get('link'), str)
        self.assertIsInstance(video.get('title'), str)
        self.assertIsInstance(video.get('channel'), str)
        self.assertIsInstance(video.get('publish_time'), str)
        self.assertIsInstance(video.get('views'), int)
        self.assertIsInstance(video.get('likes'), int)
        self.assertIsInstance(video.get('dislikes'), int)
        self.assertIsInstance(video.get('comments'), int)
        self.assertIsInstance(video.get('thumbnail_link'), str)

class EmptyMyPageTester(unittest.TestCase):
    '''
        test for endpoint /my-page?user={username}, where the user has no existing playlists
    '''
    
    def setUp(self):
        ''' 
            Returns a JSON array of arrays, each of which represents a playlist. 
            Each playlist array is a JSON list of dictionaries, each of represents a video.  
        '''
        username = 'user1'
        url = f'{API_BASE_URL}/my-page?user={username}/'
        self.playlists = get_JSON_string(url)

    def tearDown(self):
        pass
    def test_is_empty(self):    
        self.assertTrue(not self.playlists)

class LogOutTester(unittest.TestCase):
    ''' tests /log-out/ endpoint '''

    def setUp(self):
        ''' returns a success code if logged out successfully, else an error code  '''
        url = {API_BASE_URL} + 'log-out/'
        self.message = get_JSON_string(url)

    def tearDown(self):
        pass

    def test_is_empty(self):
        self.assertFalse(not self.message)

if __name__ == '__main__':
    unittest.main()

