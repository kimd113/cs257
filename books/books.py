# CS257 - Daeyeon Kim, Kevin Phung
import argparse
import csv

def get_parsed_arguments():
    ''' Adds arguments and parse them with argparse module.'''
    parser = argparse.ArgumentParser(description='Tool to help find books from a list')
    parser.add_argument('--title', '-t', metavar='Word from Title', nargs='+', help='One or more words in the title of the book you seek')
    parser.add_argument('--author', '-a', metavar='Author Name', nargs='+', help='The name of the author who\'s books you want to find')
    parser.add_argument('--year','-y', metavar='[Year 1,Year 2]', nargs='+', help='A time range of years(inclusive) as publishing dates for the book you want')
    parsed_arguments = parser.parse_args()
    return parsed_arguments

def check_items_in_common (first_list = [], second_list = [], filtered_list = []):
    ''' Checks the items in common in two lists and append them to a new list(filtered_list ).'''
    for first_item in first_list:
        for second_item in second_list:
            if first_item == second_item:
                filtered_list.append(first_item)

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

def filter_by_title(title, books, title_list):
    ''' filter by the input of title '''
    if title != None:
        joined_title = ' '.join(title)
        for row in books:
            if joined_title.lower() in row[0].lower():
                title_list.append(row)
        if len(title_list) == 0:
            print('There is no title matches. Please try with different keywords.')

def filter_by_author(author, books, author_list):
    ''' filter by the input of author '''
    if author != None:
        joined_author = ' '.join(author)
        if joined_author.isdigit():
            print('Please enter a name, not a number')
        else:
            for row in books:
                if joined_author.lower() in row[2].lower():
                    author_list.append(row)
        if len(author_list) == 0:
            print('There is no author matches. Please try with different keywords.')

def filter_by_year(year, books, year_list):
    ''' filter by the input of year '''
    if year != None:
        try:
            if isinstance(int(year[0]), int) and isinstance(int(year[1]), int):
                for row in books:
                    if year[0] <= row[1] and year[1] >= row[1]:
                        year_list.append(row)
                if len(year) == 0:
                    print('There is no range of year matches. Please try with different keywords.')
        except:
            print('Please input an integer for both year values')

def search_books(title = None, author = None, year = None):
    ''' Function that searches the books from books.csv - filtered by the arguments '''
    with open('books.csv') as csvfile:
        books_reader = csv.reader(csvfile, delimiter = ',')
        books = []
        for row in books_reader:
            books.append(row)

        if (title == None and author == None and year == None):
            for row in books_reader:
                print(row[0], row[1], row[2])
        else:
            # lists to hold the items filtered by each arguments.
            filtered_list = []
            title_list = []
            author_list = []
            year_list = []

            filter_by_title(title, books, title_list)
            filter_by_author(author, books, author_list)
            filter_by_year(year, books, year_list)

            # Handle one argument case
            if (len(author_list) > 0 and len(title_list) == 0 and len(year_list) == 0):
                format_printed_output(author_list)
            elif (len(author_list) == 0 and len(title_list) > 0 and len(year_list) == 0):
                format_printed_output(title_list)
            elif (len(author_list) == 0 and len(title_list) == 0 and len(year_list) > 0):
                format_printed_output(year_list)
            else:
                # Handle more than two arguments
                # 1. if author and title, then check the items in common in both lists.
                # 2. if author and year, then check the items in common in both lists.
                # 3. if title and year, then check the items in common in both lists.
                # 4. if author and title and year, then check the items in common in both lists.
                #   4-1. Check the items in common in author and title first.
                #   4-2. Then compare the list with year list and filter the items in common.

                # 1
                if (len(author_list) > 0 and len(title_list) > 0 and len(year_list) == 0):
                    check_items_in_common(author_list, title_list, filtered_list)
                    format_printed_output(filtered_list)
                # 2
                elif (len(author_list) > 0 and len(title_list) == 0 and len(year_list) > 0):
                    check_items_in_common(author_list, year_list, filtered_list)
                    format_printed_output(filtered_list)
                # 3
                elif (len(author_list) == 0 and len(title_list) > 0 and len(year_list) > 0):
                    check_items_in_common(title_list, year_list, filtered_list)
                    format_printed_output(filtered_list)
                # 4
                elif (len(author_list) > 0 and len(title_list) > 0 and len(year_list) > 0):
                    check_items_in_common(author_list, title_list, filtered_list)
                    filtered_all_three_args_list=[]
                    check_items_in_common(filtered_list, year_list, filtered_all_three_args_list)
                    format_printed_output(filtered_all_three_args_list)

def main():
    ''' Main function '''
    arguments = get_parsed_arguments()
    search_books(arguments.title,arguments.author,arguments.year)

if __name__ == '__main__':
    main()
