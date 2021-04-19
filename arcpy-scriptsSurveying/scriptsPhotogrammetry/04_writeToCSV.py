from time import gmtime, strftime
import csv

path = "D:/"

outputName = "jack"
csvFileName = outputName + "_Output.csv"

csv_file = open(path + csvFileName, 'w+', newline='')
csv_file.close()

def AppendToCSV(parameter, msg):
    csv_file = open(path + csvFileName, 'a+', newline='')
    
    current_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())

    writer = csv.writer(csv_file)
    writer.writerow([current_time, parameter, msg])
    csv_file.close()

AppendToCSV("initialError", "4")
AppendToCSV("initialPoints", "135268")
AppendToCSV("finalPoints", "135268")
AppendToCSV("finalError", "4")
