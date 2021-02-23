# Harry Tian and Daniel Kim

import sys
import flask
import json
import config
import psycopg2

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
    ''' Returns a list of dictionaires, 
        each of which representes a trending video (from all time?). 
        By default, the list is ordered by number of views, descending

        Returns an empty list if there's any database failure.
    '''

    # There are multiple vidoes with the same title, even the same link???

    # query = ''' SELECT videos.link, videos.title, videos.publish_time, videos.views, videos.likes, videos.dislikes, videos.comment_count, videos.thumbnail_link
    #             FROM videos
    #             ORDER BY videos.views DESC LIMIT 20;'''
    
    query = '''SELECT videos.link, videos.title, videos.publish_time, SUM(videos.views), videos.likes, videos.dislikes, videos.comment_count, videos.thumbnail_link
               FROM videos
               GROUP BY videos.link, videos.title, videos.publish_time, videos.views, videos.likes, videos.dislikes, videos.comment_count, videos.thumbnail_link
               ORDER BY SUM(videos.views)
               DESC
               LIMIT 20;'''
               
    video_list = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            video = {'link':row[0], 'title':row[1], 'publish_time':row[2], 
                     'views':row[3], 'likes':row[4], 'dislikes':row[5], 'comment_count':row[6],
                     'thumbnail_link':row[7]}
            video_list.append(video)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
        exit()

    return json.dumps(video_list)


