'''List all the NOCs (National Olympic Committees), in alphabetical order by abbreviation. 
These entities, by the way, are mostly equivalent to countries. 
But in some cases, you might find that a portion of a country participated in a particular games 
(e.g. one guy from Newfoundland in 1904) or some other oddball situation.'''

SELECT teams.NOC 
FROM teams
ORDER BY ASC
'''List the names of all the athletes from Kenya. 
If your database design allows it, sort the athletes by last name.'''


'''List all the medals won by Greg Louganis, sorted by year. 
Include whatever fields in this output that you think appropriate.'''


'''List all the NOCs and the number of gold medals they have won, 
in decreasing order of the number of gold medals.'''
