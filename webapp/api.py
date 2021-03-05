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

    query = '''SELECT videos.link, videos.title, videos.publish_time, videos.thumbnail_link, channels.title, 
                      videos_trending_views.views, videos_trending_views.likes, videos_trending_views.dislikes, videos_trending_views.comment_count
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
                     'views':row[5], 'likes':row[6], 'dislikes':row[7], 'comment_count':row[8],}
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

        Returns a success code if the username is not taken, else an error code 
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

        Returns a success code if the username exists, else an error code 
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


########### TODO endpoints ###########

@api.route('/my-page') 
def my_page():
    ''' 
        Returns the mypage of a user through the GET parameter

            http://.../?user_name=name

        Returns a JSON array of arrays, each of which represents a playlist. 
        Each playlist array is a JSON list of dictionaries, each of represents a video.
    '''

    return json.dumps(None)

    
@api.route('/save-to-playlist') 
def save_to_playlist():
    ''' 
        Adds a video to a user's playlist
        Returns a success code if the video is not in the playlist and saved successfully, else an error code
    '''

    return json.dumps(None)

########### Help endpoints ###########
@api.route('/help') 
def get_help():
    doc = Path("doc")
    help_file = open(doc/'api-design.txt')
    text = help_file.read()
    return flask.render_template('help.html', help_text=text)