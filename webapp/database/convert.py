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

def create_trending_dates_csv(trending_dates):
    ''' creates trending_dates.csv '''

    id = 1
    with open('trending_dates.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for trending_date in trending_dates:
            writer.writerow([id, trending_date])
            id += 1

def create_channels_csv(channels):
    ''' creates channels.csv '''

    id = 1
    with open('channels.csv', 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        for channel in channels:
            writer.writerow([id, channel])
            id += 1

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
    
    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                link = row['video_id']
                title = row['title']
                publish_time = row['publish_time']
                views = int(row['views'])
                likes = int(row['likes'])
                dislikes = int(row['dislikes'])
                comment_count = int(row['comment_count'])
                thumbnail_link = row['thumbnail_link']

                writer.writerow([id, link, title, publish_time, views, likes, dislikes, comment_count, thumbnail_link])
                id += 1

def create_videos_categories_trending_channels_csv(categories_dict, trending_dates_dict, channels_dict):
    ''' creates csv that links video id to category_id, trending_date_id, channels_id '''

    with open('USvideos.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open('videos_categories_trending_channels.csv', 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            id = 1
            for row in reader:
                categories_id = row['category_id']
                trending_date = row['trending_date']
                channel = row['channel_title']

                trending_dates_id = trending_dates_dict[trending_date]
                channels_id = channels_dict[channel]

                writer.writerow([id, categories_id, trending_dates_id, channels_id])
                id += 1

# def create_athletes_countries_age_competitions_csv(NOC_dict, competition):
#     ''' creates csv that links athlete id to their age, game, and NOC'''
	
#     with open('athletes_countries_age_competitions.csv', 'w', newline='') as csvfile: 
#         writer = csv.writer(csvfile)
#         reader = csv.reader(open('athlete_events.csv'))
#         next(reader)
#         for row in reader:
#             athlete_id = row[0]
#             age = row[3]
#             if age == 'NA':
#                 age = 'NULL'
#             game = row[8]
#             NOC = row[7]
#             competition_id = competition[game][0]

#             # hard coded to fix crashing
#             if NOC == "SGP":
#                 NOC = "SIN"

#             NOC_id = NOC_dict[NOC]
#             writer.writerow([athlete_id, NOC_id, age, competition_id])
	
# def create_events_csv(competitions):
#     ''' 
#         creates athletes_events.csv that links athlete id to event id
#         creates events_info.csv that stores event_id, competition_id, sport, event, and the athlete_id of the gold, silver, and bronze winners
#     '''
#     events = []
	
#     class Event():
#         def __init__(self, sport, event, competition_id, event_id):
#             self.sport = sport
#             self.event = event
#             self.competition_id = competition_id
#             self.event_id = event_id
#             self.gold = "NULL"
#             self.silver = "NULL"
#             self.bronze = "NULL"
		
#         def set_gold_id(self, athlete_id):
#             self.gold = athlete_id
#         def set_silver_id(self, athlete_id):
#             self.silver = athlete_id
#         def set_bronze_id(self, athlete_id):
#             self.bronze = athlete_id
	
#         def __eq__(self, other):
#             return self.competition_id == other.competition_id and self.event == other.event
			
#     with open('athletes_events.csv', 'w', newline='') as csvfile:
#         writer = csv.writer(csvfile)
#         with open('athlete_events.csv') as input_csv:
#             reader = csv.reader(input_csv)
#             next(reader)
#             event_id = 1
#             for row in reader:
#                 athlete_id = row[0]
#                 game = row[8]
#                 sport = row[12]
#                 event_name = row[13]
#                 medal = row[14]
#                 competition_id = competitions[game][0]
#                 event = Event(sport, event_name, competition_id, event_id)

#                 # checking for duplicates
#                 event_exists = False
#                 for ev in events:
#                     if ev == event:
#                         event = ev
#                         event_exists = True
#                         break

#                 if medal.lower() == 'gold':
#                     event.set_gold_id(athlete_id)
#                 elif medal.lower() == 'silver':
#                     event.set_silver_id(athlete_id)
#                 elif medal.lower() == 'bronze':
#                     event.set_bronze_id(athlete_id)
                
#                 if not event_exists:
#                     events.append(event)
#                     event_id += 1

#                 writer.writerow([athlete_id, event.event_id])

#     with open('events.csv', 'w', newline='') as csvfile: 
#         writer = csv.writer(csvfile)
#         for event in events:
#             writer.writerow([event.event_id, event.competition_id, event.sport, event.event, event.gold, event.silver, event.bronze])

def main():
    trending_dates_dict, channels_dict = extract_discrete_fields()
    categories_dict = create_categories_csv()

    create_trending_dates_csv(trending_dates_dict.keys())
    create_channels_csv(channels_dict.keys())
    create_videos_csv()
    create_videos_categories_trending_channels_csv(categories_dict, trending_dates_dict, channels_dict)

main()