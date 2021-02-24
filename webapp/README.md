0. Create a youtube database in psql
1. load the database by running [psql -U USER_NAME DATABASE_NAME < data.sql]
2. create a config.py in the format:
	database = 
	user = 
	password = 
3. run [python app.py localhost 5000]
4. too see the JSON stuff, run [http://localhost:5000/api/] with a GET parameter trending_date