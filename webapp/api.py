# Harry Tian and Daniel Kim

import sys
import flask
import json
import config
import psycopg2
from pathlib import Path

api = flask.Blueprint('api', __name__)

########### Connecting to the database ###########
def get_connection():
    ''' Returns a connection to the database described in the
        config module. May raise an exception as described in the
        documentation for psycopg2.connect. '''
    return psycopg2.connect(database=config.database,
                            user=config.user,
                            password=config.password)

########### The API endpoints ###########
@api.route('/') 
def get_main_page():
    ''' Returns a list of videos from a default trending date, 
        each video is in a dictionary format.
        
        The user may request a trending data through the GET parameter

            http://.../?trending_date=date

        By default, the list is ordered by number of views, descending

        Returns an empty list if there's any database failure.
    '''

    trending_date = flask.request.args.get('trending_date')
    if not trending_date:
        trending_date = "18.31.05"

    query = '''SELECT DISTINCT videos.link, videos.title, videos.publish_time, videos.thumbnail_link, channels.title, 
                      videos_trending_views.views, videos_trending_views.likes, videos_trending_views.dislikes, videos_trending_views.comment_count,
                      videos.id
               FROM videos, videos_trending_views, videos_categories_channels, channels, trending_dates
               WHERE trending_dates.date = '{}'
               AND trending_dates.id = videos_trending_views.trending_dates_id
               AND videos_trending_views.videos_id = videos.id
               AND videos.id = videos_categories_channels.videos_id
               AND videos_categories_channels.channels_id = channels.id
               ORDER BY videos_trending_views.views
               DESC;'''.format(trending_date)
               
    video_list = []

    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)

        for row in cursor:
            video = {'link':row[0], 'title':row[1], 'publish_time':row[2],'thumbnail_link':row[3], 'channel':row[4],
                     'views':convert_num(row[5]), 'likes':convert_num(row[6]), 'dislikes':convert_num(row[7]), 'comment_count':convert_num(row[8]), 
                     'id':row[9]}
            video_list.append(video)

        cursor.close()
        connection.close()

    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    return json.dumps(video_list)


@api.route('/sign-up') 
def sign_up():
    ''' 
        The user signs up an account through the GET parameter

            http://.../?user_name=name

        Returns true if the username is not taken, else false
    '''
    user_name = flask.request.args.get('user_name')

    check_user_query = '''SELECT users.username
                          FROM users
                          WHERE users.username = '{}';'''.format(user_name)

    # check if user_name exists in the database
    name_taken = False
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(check_user_query)

        if cursor.rowcount: name_taken = True

        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    if name_taken: 
        return json.dumps(False)
        
    # if user_name does not exist, create a new one for the user
    else: 
        sign_up_query = '''INSERT INTO users
                           (username)
                           VALUES('{}');'''.format(user_name)
        try:
            connection = get_connection()
            cursor = connection.cursor()
            cursor.execute(sign_up_query)

            cursor.close()
            connection.commit() # very important line
            connection.close()
        except Exception as e:
            print(e, file=sys.stderr)
            exit()

        return json.dumps(True)

@api.route('/log-in') 
def log_in():
    ''' 
        The user logs in to their account through the GET parameter

            http://.../?user_name=name

        Returns true if the username exists, else false
    '''
    user_name = flask.request.args.get('user_name')

    check_user_query = '''SELECT users.username
                          FROM users
                          WHERE users.username = '{}';'''.format(user_name)

    # check if user_name exists in the database
    name_exists = False
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(check_user_query)

        if cursor.rowcount: name_exists = True

        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    return json.dumps(name_exists)

class UserInfo():
    '''
        A helper class that contains a user's username, playlists, and videos in the playlists
    '''
    def __init__(self, user_name):
        self.user_name = user_name
        self.playlists_id = {}
        self.playlists_videos = {}

@api.route('/user') 
def get_user_info():
    ''' 
        Returns user information, including their playlists, through the GET parameter

            http://.../?user_name=name

        Returns a JSON dictionary where the keys are the titles of the playlist 
        and the values are arrays of dictionaries where each dictionary represents a video.

        The structure is: dictionary of playlists -> playlist -> list of videos 
        The first dictionary stores the playlist_id in the format {'playlist_id':id}
    '''
    connection = get_connection()

    user_name = flask.request.args.get('user_name')
    user_info = UserInfo(user_name)

    # query1: get user users_id from users table
    query1 = '''SELECT users.id
                FROM users
                WHERE users.username = '{}'; '''.format(user_name)

    try:
        cursor1 = connection.cursor()
        cursor1.execute(query1)
        for row in cursor1:
            user_id = row[0]
        cursor1.close()

        # query2: get the ids of all the playlists 
        query2 = '''SELECT users_playlists.playlists_id
                    FROM users_playlists
                    WHERE users_playlists.users_id = {};'''.format(user_id)
                
        cursor2 = connection.cursor()
        cursor2.execute(query2)
        user_playlists_ids = []
        for row in cursor2:
            user_playlists_ids.append(row[0])
        cursor2.close()

        # returns null if the user has no playlists yet
        if not user_playlists_ids: json.dumps(user_info.playlists_videos)

        user_playlists_titles = []
        for id in user_playlists_ids:
            # query3: get the title of all the playlists 
            query3 = '''SELECT playlists.title
                        FROM playlists
                        WHERE playlists.id = {};'''.format(id)
                    
            cursor3 = connection.cursor()
            cursor3.execute(query3)
            for row in cursor3:
                user_playlists_titles.append(row[0])
            cursor3.close()
    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    # populating some of user_info
    for i in range(len(user_playlists_ids)):
        playlist_title = user_playlists_titles[i]
        playlist_id = user_playlists_ids[i]
        # title_id = playlist_title + '_' + playlist_id

        user_info.playlists_id[playlist_title] = playlist_id
        user_info.playlists_videos[playlist_title] = []

    # playlists_ids = user_info.playlists_id
    for playlist_title in user_info.playlists_videos:
        playlist_id = user_info.playlists_id[playlist_title]
        user_info.playlists_videos[playlist_title].append({'playlist_id':playlist_id})
        
        # query4: get the videos in each playlist
        query4 = '''SELECT DISTINCT videos.link, videos.title, videos.publish_time, videos.thumbnail_link, channels.title 
                         FROM videos, videos_categories_channels, channels, playlists_videos
                         WHERE playlists_videos.playlists_id = {}
                         AND videos.id = playlists_videos.videos_id
                         AND videos.id = videos_categories_channels.videos_id
                         AND videos_categories_channels.channels_id = channels.id;'''.format(playlist_id)

        try:
            cursor4 = connection.cursor()
            cursor4.execute(query4)

            # the inner layer of list of dictionaries
            for row in cursor4:
                video = {'link':row[0], 'title':row[1], 'publish_time':row[2],'thumbnail_link':row[3], 'channel':row[4]}
                user_info.playlists_videos[playlist_title].append(video)

            cursor4.close()
        except Exception as e:
            print(e, file=sys.stderr)
            exit()

    connection.close()
    return json.dumps(user_info.playlists_videos)

@api.route('/create-playlist') 
def create_playlist():
    ''' 
        Create a new playlist through the GET parameters
            http://.../?user_name=user&playlist_title=playlist
    '''
    connection = get_connection()

    user_name = flask.request.args.get('user_name')
    playlist_title = flask.request.args.get('playlist_title')

    # query1: add a new playlist to the playlists table
    query1 = '''INSERT INTO playlists
               (title)
                VALUES('{}');'''.format(playlist_title)

    # query2: get users_id from users table
    query2 = '''SELECT users.id
                FROM users
                WHERE users.username = '{}'; '''.format(user_name)

    # query3: get playlist_id by getting the id of the last row
    query3 = '''SELECT count(*)
                FROM playlists;'''
                
    try:
        cursor1 = connection.cursor()
        cursor1.execute(query1)
        cursor1.close()

        cursor2 = connection.cursor()
        cursor2.execute(query2)
        for row in cursor2:
            users_id = int(row[0])
        cursor2.close()

        cursor3 = connection.cursor()
        cursor3.execute(query3)
        for row in cursor3:
            playlists_id = int(row[0])
        cursor3.close()

        # query4: add a new line to users_playlists using users_id and playlists_id
        query4 = '''INSERT INTO users_playlists
                    (users_id, playlists_id)
                    VALUES({},{});'''.format(users_id, playlists_id)
        cursor4 = connection.cursor()
        cursor4.execute(query4)
        cursor4.close()

    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    connection.commit() # very important line
    connection.close()

    return json.dumps(None)
    
@api.route('/save-to-playlist') 
def save_to_playlist():
    ''' 
        Adds a video to a user's playlist through the GET parameters

            http://.../?playlist_id=id&video_id=id
    '''
    connection = get_connection()

    playlist_id = flask.request.args.get('playlist_id')
    video_id = flask.request.args.get('video_id')

    # query: add videos_id, playlists_id to playlists_videos
    query = '''INSERT INTO playlists_videos
                (videos_id, playlists_id)
                VALUES({},{});'''.format(video_id, playlist_id)

    try:
        cursor = connection.cursor()
        cursor.execute(query)
        cursor.close()
    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    connection.commit() # very important line
    connection.close()

    return json.dumps(None)

@api.route('/delete-playlist')
def delete_playlist():
    ''' 
        Delete a playlist through the GET parameters
            http://.../?user_name=user&playlist_id=id
    '''
    connection = get_connection()

    user_name = flask.request.args.get('user_name')
    playlist_id = flask.request.args.get('playlist_id')

    # query1: delete row in playlists table
    query1 = '''DELETE FROM playlists
                WHERE playlists.id = {};'''.format(playlist_id)

    # query2: get all video_id from playlists_videos table
    query2 = '''SELECT DISTINCT videos.id 
                FROM videos, playlists_videos
                WHERE playlists_videos.playlists_id = {};'''.format(playlist_id)

    try:
        cursor1 = connection.cursor()
        cursor1.execute(query1)
        cursor1.close()

        cursor2 = connection.cursor()
        cursor2.execute(query2)
        video_ids = []
        for row in cursor2:
            video_ids.append(row[0])
        cursor2.close()

        for video_id in video_ids:
            # query3: delete rows in playlists_videos table
            query3 = '''DELETE FROM users_playlists
                        WHERE playlists.id = {}
                        AND videos_id = {};'''.format(playlist_id,video_id)
            cursor3 = connection.cursor()
            cursor3.execute(query3)
            cursor3.close()

        # query4: get users_id from users table
        query4 = '''SELECT users.id
                    FROM users
                    WHERE users.username = '{}'; '''.format(user_name)
        cursor4 = connection.cursor()
        cursor4.execute(query4)
        for row in cursor4:
            user_id = int(row[0])
        cursor4.close()

        # query4: delete row in users_playlists table
        query5 = '''DELETE FROM users_playlists
                    WHERE playlists.id = {}
                    AND users_id = {};'''.format(playlist_id,user_id)
        cursor5 = connection.cursor()
        cursor5.execute(query5)
        cursor5.close()

    except Exception as e:
        print(e, file=sys.stderr)
        exit()
        
    return json.dumps(None)

@api.route('/remove-from-playlist')
def remove_from_playlist():
    ''' 
        Removes a video from user's playlist through the GET parameters

            http://.../?playlist_id=id&video_id=link
    '''
    connection = get_connection()

    playlist_id = flask.request.args.get('playlist_id')
    video_id = flask.request.args.get('video_id')

    # query1: get videos_id from videos table
    query1 = '''SELECT videos.id
                FROM videos
                WHERE videos.link = '{}'; '''.format(video_id)
    try:
        cursor1 = connection.cursor()
        cursor1.execute(query1)
        for row in cursor1:
            videos_id = int(row[0])
        cursor1.close()

        # query2: delete videos_id, playlists_id to playlists_videos
        query2 = '''DELETE FROM playlists_videos
                    WHERE videos_id = {}
                    AND playlists_id = {};'''.format(videos_id, playlist_id)
        cursor2 = connection.cursor()
        cursor2.execute(query2)
        cursor2.close()

    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    connection.commit() # very important line
    connection.close()

    return json.dumps(None)

########### TODO endpoints ##########

########### Help endpoints ###########
# debug???
@api.route('/help') 
def get_help():
    return json.dumps("???????")
    doc = Path("doc")
    help_file = open(doc/'api-design.txt')
    text = help_file.read()
    return flask.render_template('help.html', help_text=text)

########### Helper functions ###########
def convert_num(num):
    digits = len(str(num))
    
    # hundreds and below
    if digits < 4:
        return num
    
    # thousands
    elif digits == 4:
        num_rounded = round(num,-2)
        thousands = str(num_rounded)[:2]
        if thousands[1] == '0':
            results = thousands[0] + 'K'
        else:
            results = thousands[0] + '.' + thousands[1] + 'K'
    elif digits == 5:
        num_rounded = round(num,-3)
        thousands = str(num_rounded)[:2]
        results = thousands+ 'K'
    elif digits == 6:
        num_rounded = round(num,-3)
        thousands = str(num_rounded)[:3]
        results = thousands + 'K'
        
    # millions
    elif digits == 7:
        num_rounded = round(num,-5)
        millions = str(num_rounded)[:2]
        if millions[1] == '0':
            results = millions[0] + 'M'
        else:
            results = millions[0] + '.' + millions[1] + 'M'
    elif digits == 8:
        num_rounded = round(num,-6)
        millions = str(num_rounded)[:2]
        results = millions + 'M'
    elif digits == 9:
        num_rounded = round(num,-6)
        millions = str(num_rounded)[:3]
        results = millions + 'M'
        
    # billions
    elif digits == 10:
        num_rounded = round(num,-8)
        billions = str(num_rounded)[:2]
        if billions[1] == '0':
            results = billions[0] + 'B'
        else:
            results = billions[0] + '.' + billions[1] + 'B'
    elif digits == 11:
        num_rounded = round(num,-9)
        billions = str(num_rounded)[:2]
        results = billions + 'B'
    elif digits == 12:
        num_rounded = round(num,-9)
        billions = str(num_rounded)[:3]
        results = billions + 'B'
    else:
        results = num
        
    return results