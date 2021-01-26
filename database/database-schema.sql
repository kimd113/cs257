CREATE TABLE athletes (
  id SERIAL,
  name text,
  sex text,
  height integer,
  weight integer
);

CREATE TABLE teams (
  id SERIAL,
  team text,
  NOC text
);

CREATE TABLE sports (
  id SERIAL,
  sport text
);

CREATE TABLE games (
  id SERIAL,
  games text,
  year integer,
  season text,
  city text
); 

CREATE TABLE events (
  id SERIAL,
  event text
);

CREATE TABLE medals (
  id SERIAL,
  medal text
);

CREATE TABLE athletes_games (
  id SERIAL,
  athlete_id integer,
  age integer,
  game_id integer
);

CREATE TABLE athletes_teams (
  id SERIAL,
  athlete_id integer,
  team_id integer
);

CREATE TABLE events_games_medals (
  id SERIAL,
  event_id integer,
  athlete_game_id integer,
  medal_id integer
);

CREATE TABLE sports_events (
  id SERIAL,
  sport_id integer,
  event_id integer
);