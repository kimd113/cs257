CREATE TABLE athletes (
  id SERIAL,
  name string,
  sex string,
  height int,
  weight int
);

CREATE TABLE teams (
  id SERIAL,
  team string,
  NOC string
);

CREATE TABLE sports (
  id SERIAL,
  sport string
);

CREATE TABLE games (
  id SERIAL,
  year int,
  season string,
  city string
);

CREATE TABLE events (
  id SERIAL ,
  event sting
);

CREATE TABLE medals (
  id SERIAL,
  medal sting
);

CREATE TABLE athletes_teams (
  id SERIAL,
  athlete_id int,
  team_id int
);

CREATE TABLE athletes_events_medals (
  id SERIAL,
  athlete_team_id int,
  game_id int,
  medal_id int,
  sport_event_id int
);

CREATE TABLE sports_events (
  id SERIAL,
  sport_id int,
  event_id int
);