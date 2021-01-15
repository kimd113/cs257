# CS257 - Daeyeon Kim, Kevin Phung
import argparse
import csv

with open('books.csv') as csvfile:
    booksReader=csv.reader(csvfile, delimiter=',')

def get_parsed_arguments():
    parser = argparse.ArgumentParser(description='Tool to help find books from a list')
    parser.add_argument('--title', '-t', metavar='Word from Title', nargs='+', help='One or more words in the title of the book you seek')
    parser.add_argument('--author', '-a', metavar='Author Name', nargs='+', help='The name of the author who\'s books you want to find')
    parser.add_argument('--year','-y', metavar='[Year 1,Year 2]', nargs='+', help='A time range of years(inclusive) as publishing dates for the book you want')
    parsed_arguments = parser.parse_args()
    return parsed_arguments

def get_results(title=None, author=None,year=None):
    if title==None and author==None and year==None:
        with open('books.csv') as csvfile:
            booksReader=csv.reader(csvfile, delimiter=',')
            for row in booksReader:
                print(row[0],row[1],row[2])
    else:
        test=[]
        auth_list=[]
        ttl_list=[]
        yr_list=[]

        # Input of author
        if author!=None:
            with open('books.csv') as csvfile:
                booksReader=csv.reader(csvfile, delimiter=',')
                for row in booksReader:
                    if author[0].lower() in row[2].lower():
                        auth_list.append(row)
                if len(auth_list) == 0:
                    print('The keyword does not exist.')

        # Input of title
        if title!=None:
            with open('books.csv') as csvfile:
                booksReader=csv.reader(csvfile, delimiter=',')
                for row in booksReader:
                    if title[0].lower() in row[0].lower():
                        ttl_list.append(row)
                if len(ttl_list) == 0:
                    print('The keyword does not exist.')

        # Input of range of year
        if year!=None:
            with open('books.csv') as csvfile:
                booksReader=csv.reader(csvfile, delimiter=',')
                for row in booksReader:
                    if year[0]<=row[1] and year[1]>=row[1]:
                        yr_list.append(row)
                if len(yr_list) == 0:
                    print('The keyword does not exist.')

        # Handle one argument case
        if (len(auth_list) > 0 and len(ttl_list) == 0 and len(yr_list) == 0):
            for item in auth_list:
                print(item)
        elif (len(auth_list) == 0 and len(ttl_list) > 0 and len(yr_list) == 0):
            for item in ttl_list:
                print(item)
        elif (len(auth_list) == 0 and len(ttl_list) == 0 and len(yr_list) > 0):
            for item in yr_list:
                print(item)
        else:
            # Handle more than two arguments
            # 1. if auth and ttl, then check the items in common in both lists.
            # 2. if auth and yr, then check the items in common in both lists.
            # 3. if ttl and yr, then check the items in common in both lists.
            # 4. if auth and ttl and yr, then check the items in common in both lists.

            # 1
            if (len(auth_list) > 0 and len(ttl_list) > 0 and len(yr_list) == 0):
                for auth_item in auth_list:
                    for ttl_item in ttl_list:
                        if auth_item == ttl_item:
                            test.append(auth_item)
                for item in test:
                    print(item)
            # 2
            elif (len(auth_list) > 0 and len(ttl_list) == 0 and len(yr_list) > 0):
                for auth_item in auth_list:
                    for yr_item in yr_list:
                        if auth_item == yr_item:
                            test.append(auth_item)
                for item in test:
                    print(item)
            # 3
            elif (len(auth_list) == 0 and len(ttl_list) > 0 and len(yr_list) > 0):
                for ttl_item in ttl_list:
                    for yr_item in yr_list:
                        if ttl_item == yr_item:
                            test.append(ttl_item)
                for item in test:
                    print(item)
            # 4
            elif (len(auth_list) > 0 and len(ttl_list) > 0 and len(yr_list) > 0):
                for auth_item in auth_list:
                    for ttl_item in ttl_list:
                        if auth_item == ttl_item:
                            test.append(auth_item)
                filtered=[]
                for test_item in test:
                    for yr_item in yr_list:
                        if test_item == yr_item:
                            filtered.append(test_item)
                for item in filtered:
                    print(item)

# Main function
def main():
    arguments = get_parsed_arguments()
    get_results(arguments.title,arguments.author,arguments.year)

if __name__ == '__main__':
    main()