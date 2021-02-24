1. Run [python convert.py]
2. Drop and create a new youtube database in psql
3. Run [psql -U USER_NAME DATABASE_NAME < database-schema.sql]
4. Navigate into the database in psql by running something like: psql -U USER_NAME youtube
5. Execute the following \copy commands:

\copy categories from 'categories.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy channels from 'channels.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy trending_dates from 'trending_dates.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy videos from 'videos.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy videos_categories_channels from 'videos_categories_channels.csv' DELIMITER ',' CSV NULL AS 'NULL'
\copy videos_trending_views from 'videos_trending_views.csv' DELIMITER ',' CSV NULL AS 'NULL'

5. Dump the database by running:

	pg_dump --no-owner --no-privileges -U YOURUSERNAME YOURDATABASE > data.sql
