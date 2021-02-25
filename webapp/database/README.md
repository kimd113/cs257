This directory is for creating the data.sql file. Follow the instructions below:
1. Run [python3 convert.py]
2. Drop and create a new youtube database in psql
3. Run [psql -U USER_NAME DATABASE_NAME < database-schema.sql]
4. Navigate into the database in psql and execute the following \copy commands: <br/>
\copy categories from 'categories.csv' DELIMITER ',' CSV NULL AS 'NULL' <br/>
\copy channels from 'channels.csv' DELIMITER ',' CSV NULL AS 'NULL' <br/>
\copy trending_dates from 'trending_dates.csv' DELIMITER ',' CSV NULL AS 'NULL'<br/>
\copy videos from 'videos.csv' DELIMITER ',' CSV NULL AS 'NULL'<br/>
\copy videos_categories_channels from 'videos_categories_channels.csv' DELIMITER ',' CSV NULL AS 'NULL'<br/>
\copy videos_trending_views from 'videos_trending_views.csv' DELIMITER ',' CSV NULL AS 'NULL'<br/>
6. Dump the database by running:

	pg_dump --no-owner --no-privileges -U YOURUSERNAME YOURDATABASE > data.sql
