import csv

f_csv = open('D:\\GIS\\joinTable.csv', 'r')
reader = csv.reader(f_csv)

csv_rows = []
for row in reader:
    csv_rows.append(row)

f_csv.close()