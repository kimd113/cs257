# CS257 - Daeyeon Kim, Kevin Phung
# Revised by both Daeyeon Kim, Kevin Phung
import argparse
import csv

def get_parsed_arguments():
    ''' Adds arguments and parse them with argparse module.'''
    parser = argparse.ArgumentParser(description='Tool to help find books from a list')
    parser.add_argument('--title', '-t', metavar='Word from Title', nargs='+', help='One or more words in the title of the book you seek')
    parser.add_argument('--author', '-a', metavar='Author Name', nargs='+', help='The name of the author who\'s books you want to find')
    parser.add_argument('--year','-y', metavar='Year 1 Year 2', nargs='+', help='A time range of years(inclusive) as publishing dates for the book you want')
    parsed_arguments = parser.parse_args()
    return parsed_arguments


def format_printed_output(item_list):
    ''' Formats and prints the items in list '''
    # Sorted with help from GeeksforGeeks.org
    # (https://www.geeksforgeeks.org/python-sort-list-according-second-element-sublist/)
    sorted_item_list = sorted(item_list, key = lambda x: x[2])
    tracker = None
    for item in sorted_item_list:
        if tracker == item[2]:
            print('\nBook title:  ', item[0])
            print('Publication date:  ', item[1])
        else:
            print('-------------------------------------------------------')
            print('Author:  ', item[2], '\n')
            print('Book title:  ', item[0])
            print('Publication date:  ', item[1])
            tracker=item[2]

def filter_by_title(title,filtered_list):
    ''' filter by the input of title '''
    if title != None:
        joined_title = ' '.join(title)
        new_list=[]
        for row in filtered_list:
            if joined_title.lower() in row[0].lower():
                new_list.append(row)
        return new_list
    else:
        return filtered_list


def filter_by_author(author,filtered_list):
    ''' filter by the input of author '''
    if author != None:
        joined_author = ' '.join(author)
        if joined_author.isdigit():
            print('Please enter a name for the author, not a number')
            exit()
        else:
            new_list=[]
            for row in filtered_list:
                if joined_author.lower() in row[2].lower():
                    new_list.append(row)
            return new_list
    else:
        return filtered_list


def filter_by_year(year,filtered_list):
    ''' filter by the input of year '''
    if year != None:
        try:
            if int(year[0]) and len(year[0]) == 4 and int(year[1]) and len(year[1]) == 4:
                new_list=[]
                for row in filtered_list:
                    if year[0] <= row[1] and year[1] >= row[1]:
                        new_list.append(row)
                return new_list
            else:
                exit()

        except:
            print('Please enter a proper 4-digit integer for both year values')
            exit()
    else:
        return filtered_list

def search_books(title = None, author = None, year = None):
    ''' Function that searches the books from books.csv - filtered by the arguments '''

    with open('books.csv') as csvfile:
        books_reader = csv.reader(csvfile, delimiter = ',')
        filtered_list_0 = []
        for row in books_reader:
            filtered_list_0.append(row)

    # if no flags are given, shows all books
    if (title == None and author == None and year == None):
        format_printed_output(filtered_list_0)

    else:
        # lists to hold the items filtered by each arguments.
        # after each filter, checks if any eligible books are left and exits immediately if there are none
        filtered_list_1=filter_by_title(title,filtered_list_0)
        if len(filtered_list_1)==0:
            print('There is no title matches. Please try with different keywords.')
            exit()

        filtered_list_2=filter_by_author(author,filtered_list_1)
        if len(filtered_list_2)==0:
            print('There is no author matches. Please try with different keywords.')
            exit()

        filtered_list_3=filter_by_year(year, filtered_list_2)
        if len(filtered_list_3)==0:
            print('There is no range of year matches. Please try with different keywords.')
            exit()

        format_printed_output(filtered_list_3)


def main():
    ''' Main function '''
    arguments = get_parsed_arguments()
    search_books(arguments.title,arguments.author,arguments.year)

if __name__ == '__main__':
    main()
