import csv

def extract_discrete_fields():
    ''' 
        from USvideos.csv, extract discrete values trending_date, channel 
        returns dictionaries where the key is trending_date/channel and the value is an id
        the dictionaries are used to create other csvs
    '''
    
    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        trending_dates_dict = {}
        channels_dict = {}
        trending_date_id = 1
        channel_id = 1

        for row in reader:
            trending_date = row['trending_date']
            channel = row['channel_title']

            if trending_date not in trending_dates_dict:
                trending_dates_dict[trending_date] = trending_date_id
                trending_date_id += 1
            
            if channel not in channels_dict:
                channels_dict[channel] = channel_id
                channel_id += 1
    
    return trending_dates_dict, channels_dict

def create_trending_dates_csv(trending_dates_dict):
    ''' creates trending_dates.csv '''

    # id = 1
    with open('trending_dates.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for trending_date in trending_dates_dict:
            trending_date_id = trending_dates_dict[trending_date]
            writer.writerow([trending_date_id, trending_date])
            # id += 1

def create_channels_csv(channels_dict):
    ''' creates channels.csv '''

    # id = 1
    with open('channels.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        for channel in channels_dict:
            channel_id = channels_dict[channel]
            writer.writerow([channel_id, channel])
            # id += 1

def create_videos_csv():
    ''' create videos.csv, each row contains relevant unique data for a video'''
    
    videos_dict = {} # this dictionary uses video titles as keys
    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos.csv', 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                title = row['title']
                if title not in videos_dict:
                    videos_dict[title] = id

                    link = row['video_id']
                    title = row['title']
                    publish_time = row['publish_time']
                    thumbnail_link = row['thumbnail_link']
            
                    writer.writerow([id, link, title, publish_time,thumbnail_link])
                    id += 1
    
    return videos_dict

def create_videos_trending_views_csv(videos_dict, trending_dates_dict):
    ''' 
        create videos_trending_views.csv that links videos_id to trending_dates_id, 
        each row also contains views, likes, dislikes, and comment_count or each video trending on a date
    '''
    
    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos_trending_views.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                title = row['title']
                trending_date = row['trending_date']
                views = int(row['views'])
                likes = int(row['likes'])
                dislikes = int(row['dislikes'])
                comment_count = int(row['comment_count'])

                videos_id = videos_dict[title]
                trending_dates_id = trending_dates_dict[trending_date]

                writer.writerow([id, videos_id, trending_dates_id, views, likes, dislikes, comment_count])
                id += 1

def create_videos_channels_csv(videos_dict, channels_dict):
    ''' creates csv that links video id to channels_id '''

    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos_channels.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                title = row['title']
                channel = row['channel_title']

                videos_id = videos_dict[title]
                channels_id = channels_dict[channel]

                writer.writerow([videos_id,  channels_id])
                id += 1

def main():
    trending_dates_dict, channels_dict = extract_discrete_fields()
    videos_dict = create_videos_csv()

    create_trending_dates_csv(trending_dates_dict)
    create_channels_csv(channels_dict)
    create_videos_trending_views_csv(videos_dict, trending_dates_dict)
    create_videos_channels_csv(videos_dict, channels_dict)

main()
