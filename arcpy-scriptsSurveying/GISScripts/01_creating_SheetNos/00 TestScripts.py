import thread
from datetime import datetime

# Define a function for the thread
##def print_time( threadName, delay):
##   count = 0
##   while count < 5:
##      time.sleep(delay)
##      count += 1
##      print "%s: %s" % ( threadName, time.ctime(time.time()) )

def computeFactorial(n):
   fact = 1
   for i in range(1, n+1):
      fact = fact * i
   return fact

t1 = datetime.now()

computeFactorial(99999)

t2 = datetime.now()

delta = t2 - t1
print(delta.total_seconds())
    
##thread.start_new_thread( print_time, ("Thread-1", 2, ) )
##thread.start_new_thread( print_time, ("Thread-2", 4, ) )


##import multiprocessing
##import time
##
##data = (
##    ['a', '2'], ['b', '4'], ['c', '6'], ['d', '8'],
##    ['e', '1'], ['f', '3'], ['g', '5'], ['h', '7']
##)
##
##def mp_worker((inputs, the_time)):
##    print " Process %s\tWaiting %s seconds" % (inputs, the_time)
##    time.sleep(int(the_time))
##    print " Process %s\tDONE" % inputs
##    sys.stdout.flush()
##    
##p = multiprocessing.Pool(2)
##p.map(mp_worker, data)


##import pandas as pd

##featureClass = "SHOAL"
##tlayerName = "OTHER_BOUNDARIES_AREA"
##
##commonChars = set((featureClass).lower()) & set((tlayerName).lower())
##
##print(float(len(commonChars)) / float(len(featureClass)))



##import pickle
##
##firstLoad = "no"
##try:
##    pickleFile = open("D:/outGIS/pickleFile.pickle", 'rb')      
##    jack = pickle.load(pickleFile) 
##    pickleFile.close()
##except:
##    firstLoad = "yes"
##
##print(firstLoad)
##
##if firstLoad == "yes":
##    jack = 2
##    pickleFile = open("D:/outGIS/pickleFile.pickle", "wb")
##    pickle.dump(jack, pickleFile)
##    pickleFile.close()
##
##print(jack)


##print(jack)

##import arcpy
##
##arcpy.env.workspace = "D:/inGIS/NTDBV2.gdb/ANNOTATION"
##
##fclist = arcpy.ListFeatureClasses()
##print(fclist)

##print fc

##lon = 75.775
##lat = 14.025
##print(str(int(round(4.5 - 4 * (lat % 1))) + int(round((16 * (lon % 1) - 2)))).zfill(2))

##cats = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
##
##catCalc = int(round(20 * (72.175 % 0.25) - 0.5, 1)) + int(round(22.5 - 100 * ( 24.175 % 0.25 )))

##print(cats[catCalc])

##print(str(int(4.5 - 4 * (24.875 % 1) + 16 * (72.375 % 1) - 2)).zfill(2))

##
##lonInc = float(1)
##print(23 + lonInc/2)

##print(int(66 % 6) + 6 * int(4 - 8 % 4))

##
##a = (2,3)
##print(a[0])


##print (2)
##
##latBand = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J']
##
##lat = 13
##latCalc = int(13 / 4)
##
##latCat = latBand[latCalc]
##
##lon = 75
##lon_crct = 180 + 75
##lonCalc = str(int(lon_crct / 6) + 1)
##
##sheetNo_1M = latCat + lonCalc
##
##print (latCat + lonCalc)
