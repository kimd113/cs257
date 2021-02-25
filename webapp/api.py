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


