AUTHORS: Daniel Kim, Harry Tian

DATA: Trending YouTube Video Statistics (https://www.kaggle.com/datasnaek/youtube-new?select=USvideos.csv)

FEATURES CURRENTLY WORKING:
- The / endpoint takes a browser to the main page
- At the / endpoint, it renders the list of the most currently trending videos.
- Maximum 10 videos are shown at once, and the prev/next buttons enable to switch to other videos in main page.
- 3 inputs (date, month, year) to search the trending videos of the date & the search button will render the searched videos.
- A very basic local sign up feature: creates an account for the user, stores it in the psql database, and returns a message 
- A very basic local log in feature: checks the psql database if the username exists and returns a message
- log out feature
- My Page button redirects to my page
- Vertical view: Shows the list of trending videos vertically.

FEATURES NOT YET WORKING:
- better formatting for views, likes, dislikes
- A more elegant sign up/log in feature using flask-login
- Save to my playlist: button that saves a selected video to user's playlist.
- My page: a page that shows the lists of the videos saved.