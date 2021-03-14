AUTHORS: Harry Tian & Daniel Kim

DATA: information about trending Youtube videos from 2017.11.14 to 2018.06.14

[copyright info, plus a description of how I could get your raw
data myself, including relevant links]

The license for this data is CC0: Public Domain.
The dataset can be downloaded here https://www.kaggle.com/datasnaek/youtube-new

STATUS: [a concise description of what works, what's not working
yet, and any other information that might help me
test and evaluate your work]

FEATURES CURRENTLY WORKING:
- At mainpage, renders trending videos from a default date
- Maximum 10 videos are shown at once, and the prev/next buttons enable to switch to other videos in main page.
- Searching for trending videos on user-specified date & rendering the searched videos.
- Basic local sign up: creates an account for the user, stores it in the psql database, and returns a message 
- Basic local log in: checks the psql database if the username exists and returns a message
- Log out 
- Vertical view: Shows the list of trending videos vertically.
- Create playlist 
- Delete playlist: deletes a playlist along with the videos in it
- Save to my playlist: saves a selected video to user's playlist.
- Remove from playlist: removes a select video from a playlist
- sharing data from index.html to mypage.html using local storage
- My page: a page that shows users' playlist and videos.

FEATURES NOT WORKING:
    User signup and login feature using flask-login

NOTES: [(Optional) anything else you'd like to add]