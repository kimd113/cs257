# CS257 - Daeyeon Kim, Kevin Phung
import argparse
import csv

# Read books.csv file with csv module.
with open('books.csv') as csvfile:
    booksReader=csv.reader(csvfile, delimiter=',')

# Adds arguments and parse them with argparse module.
def get_parsed_arguments():
    parser = argparse.ArgumentParser(description='Tool to help find books from a list')
    parser.add_argument('--title', '-t', metavar='Word from Title', nargs='+', help='One or more words in the title of the book you seek')
    parser.add_argument('--author', '-a', metavar='Author Name', nargs='+', help='The name of the author who\'s books you want to find')
    parser.add_argument('--year','-y', metavar='[Year 1,Year 2]', nargs='+', help='A time range of years(inclusive) as publishing dates for the book you want')
    parsed_arguments = parser.parse_args()
    return parsed_arguments

# Checks the items in common in two lists and append them to a new list(filtered_list).
def checkItemsInCommon (first_list = [], second_list = [], filtered_list = []):
    for first_item in first_list:
        for second_item in second_list:
            if first_item == second_item:
                filtered_list.append(first_item)

# Formats and prints the items in list
def output_setter(item_list):
    sorted_item_list= sorted(item_list, key = lambda x: x[2]) # Sorted with help from GeeksforGeeks.org (https://www.geeksforgeeks.org/python-sort-list-according-second-element-sublist/)
    tracker=None
    for item in sorted_item_list:
        if tracker==item[2]:
            print("\nBook title:  " + item[0])
            print("Publication date:  " + item[1])
        else:
            print("-------------------------------------------------------")
            print("Author:  "+ item[2]+ "\n")
            print("Book title:  " + item[0])
            print("Publication date:  " + item[1])
            tracker=item[2]

# Function that searches the books from books.csv - filtered by the arguments
def search_books(title = None, author = None, year = None):
    if (title == None and author == None and year == None):
        with open('books.csv') as csvfile:
            booksReader = csv.reader(csvfile, delimiter = ',')
            for row in booksReader:
                print(row[0], row[1], row[2])
    else:
        # lists to hold the items filtered by each arguments.
        books_list = []
        auth_list = []
        ttl_list = []
        yr_list = []

        # Input of author
        if author != None:
            with open('books.csv') as csvfile:
                booksReader=csv.reader(csvfile, delimiter = ',')
                for row in booksReader:
                    if author[0].lower() in row[2].lower():
                        auth_list.append(row)
                if len(auth_list) == 0:
                    print('The keyword does not exist.')

        # Input of title
        if title != None:
            with open('books.csv') as csvfile:
                booksReader=csv.reader(csvfile, delimiter = ',')
                for row in booksReader:
                    if title[0].lower() in row[0].lower():
                        ttl_list.append(row)
                if len(ttl_list) == 0:
                    print('The keyword does not exist.')

        # Input of range of year
        if year != None:
            try:
                if isinstance(int(year[0]),int) and isinstance(int(year[1]),int):
                    with open('books.csv') as csvfile:
                        booksReader = csv.reader(csvfile, delimiter = ',')
                        for row in booksReader:
                            if year[0] <= row[1] and year[1] >= row[1]:
                                yr_list.append(row)
                        if len(yr_list) == 0:
                            print('The keyword does not exist.')
            except:
                print('Please input an integer for both year values')

        # Handle one argument case
        if (len(auth_list) > 0 and len(ttl_list) == 0 and len(yr_list) == 0):
            output_setter(auth_list)
        elif (len(auth_list) == 0 and len(ttl_list) > 0 and len(yr_list) == 0):
            output_setter(ttl_list)
        elif (len(auth_list) == 0 and len(ttl_list) == 0 and len(yr_list) > 0):
            output_setter(yr_list)
        else:
            # Handle more than two arguments
            # 1. if auth and ttl, then check the items in common in both lists.
            # 2. if auth and yr, then check the items in common in both lists.
            # 3. if ttl and yr, then check the items in common in both lists.
            # 4. if auth and ttl and yr, then check the items in common in both lists.
            #   4-1. Check the items in common in auth and ttl first.
            #   4-2. Then compare the list with yr list and filter the items in common.

            # 1
            if (len(auth_list) > 0 and len(ttl_list) > 0 and len(yr_list) == 0):
                checkItemsInCommon(auth_list, ttl_list, books_list)
                output_setter(books_list)
            # 2
            elif (len(auth_list) > 0 and len(ttl_list) == 0 and len(yr_list) > 0):
                checkItemsInCommon(auth_list, yr_list, books_list)
                output_setter(books_list)
            # 3
            elif (len(auth_list) == 0 and len(ttl_list) > 0 and len(yr_list) > 0):
                checkItemsInCommon(ttl_list, yr_list, books_list)
                output_setter(books_list)
            # 4
            elif (len(auth_list) > 0 and len(ttl_list) > 0 and len(yr_list) > 0):
                checkItemsInCommon(auth_list, ttl_list, books_list)
                filteredAllThreeArgs_list=[]
                checkItemsInCommon(books_list, yr_list, filteredAllThreeArgs_list)
                output_setter(filteredAllThreeArgs_list)

# Main function
def main():
    arguments = get_parsed_arguments()
    search_books(arguments.title,arguments.author,arguments.year)

if __name__ == '__main__':
    main()
