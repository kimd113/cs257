1. Run python convert.py
1. Create a youtube database in psql
2. Execute CREATE TABLE commands from database-schema.sql
4. Execute the following \copy commands:

\copy categories from 'categories.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy channels from 'channels.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy trending_dates from 'trending_dates.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy videos from 'videos.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy videos_categories_trending_channels from 'videos_categories_trending_channels.csv' DELIMITER ',' CSV NULL AS 'NULL'

5. Dump the database by running:

	pg_dump --no-owner --no-privileges -U YOURUSERNAME YOURDATABASE > data.sql