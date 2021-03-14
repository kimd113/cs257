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

def create_categories_csv():
    ''' 
        creates categories.csv by reading from US_category_id.json 
        returns a dictionary where the keys are category_title and the values are category_id
        NOTE: category_id are not continuous, they are based on the ids specified in the JSON file
    '''

    category_ids = []
    category_titles = []
    row_num = 1
    with open('US_category_id.json') as JSONfile:
        for row in JSONfile:
            # the 8th, 18th, 28th ... row conatins the category_id
            if (row_num - 8) % 10 == 0:
                category_id = row[10:-3]
                category_ids.append(category_id)

            # the 11th, 21th, 31th ... row contains the category_title
            if (row_num - 1) % 10 == 0 and row_num != 1:
                category = row[14:-3]
                category_titles.append(category)

            row_num += 1
    
    with open('categories.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for i in range(len(category_ids)):
            category_id = category_ids[i]
            category_title = category_titles[i]
            writer.writerow([category_id, category_title])

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

def create_videos_categories_channels_csv(videos_dict, channels_dict):
    ''' creates csv that links video id to category_id, channels_id '''

    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos_categories_channels.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                title = row['title']
                categories_id = row['category_id']
                channel = row['channel_title']

                videos_id = videos_dict[title]
                channels_id = channels_dict[channel]

                writer.writerow([videos_id, categories_id, channels_id])
                id += 1

def main():
    trending_dates_dict, channels_dict = extract_discrete_fields()
    create_categories_csv()
    videos_dict = create_videos_csv()

    create_trending_dates_csv(trending_dates_dict)
    create_channels_csv(channels_dict)
    create_videos_trending_views_csv(videos_dict, trending_dates_dict)
    create_videos_categories_channels_csv(videos_dict, channels_dict)

main()
