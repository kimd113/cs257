import csv

# with open("noc_regions.csv") as csvfile:
#     reader = csv.reader(csvfile, delimiter = ",")
#     teams_list = []
#     for row in reader:
#         teams_list[row[0] - 1] = {row[1], row[2], row[4], row[5]}

with open("athlete_events.csv") as csvfile:
    reader = csv.reader(csvfile, delimiter = ",")
    athletes_list = []
    for row in reader:
        current_id = 0
        if row[0] != "ID":
            if int(row[0]) != current_id:
                athletes_list.append({"name": row[1], "sex": row[2], "weight": row[4], "height": row[5]})
                current_id += 1

    with open("athletes.csv", "w") as athletes_file:
        fieldnames = ["name", "sex", "weight", "height"]
        athletes_writer =  csv.DictWriter(athletes_file, fieldnames=fieldnames)
        athletes_writer.writeheader()
        for athlete in athletes_list:
            athletes_writer.writerow(athlete)

    # with open("teams.csv", "w", newline="") as teams_file:
    #     athletes_writer =  csv.writer(csvfile, delimiter=",",  quoting=csv.QUOTE_AL)
    #     athletes_writer.writerow(teams_list)        
    
    
    # with open("events_games_medals.csv", "w", newline="") as athletes_file:
    #     athletes_writer =  csv.writer(csvfile, delimiter=",",  quoting=csv.QUOTE_AL)
    #     athletes_writer.writerow(events_games_medals_list)  
    
    # sports_events_list = []
    # with open("sports_events.csv", "w", newline="") as athletes_file:
    #     athletes_writer =  csv.writer(csvfile, delimiter=",",  quoting=csv.QUOTE_AL)
    #     athletes_writer.writerow(sports_events_list)  