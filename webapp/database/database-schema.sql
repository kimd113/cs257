CREATE TABLE trending_dates (
  id SERIAL,
  date text
);


CREATE TABLE videos (
  id SERIAL,
  link text,
  title text,
  publish_time text,
  thumbnail_link text
);

CREATE TABLE videos_trending_views (
  id SERIAL,
  videos_id int,
  trending_dates_id int,
  views int,
  likes int,
  dislikes int,
  comment_count int
);

CREATE TABLE channels (
  id SERIAL,
  title text
);

CREATE TABLE videos_channels (
  videos_id int,
  channels_id int
);

CREATE TABLE users (
  id SERIAL,
  username text
);

CREATE TABLE playlists (
  id SERIAL,
  title text
);

CREATE TABLE playlists_videos (
  id SERIAL,
  videos_id int,
  playlists_id int
);

CREATE TABLE users_playlists (
  id SERIAL,
  users_id int,
  playlists_id int
);