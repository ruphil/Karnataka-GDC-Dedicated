# -*- coding: utf-8 -*-

import pandas

xlFile = 'D:/GIS/Seebekatte_form2_ 01-09-2020.xlsx'
txtFile = 'D:/GIS/utfuni.txt'
txtFile_out = 'D:/GIS/utfuni_out.txt'

string = open(txtFile, 'r').read()
print(string)

f = open(txtFile_out, "a")
f.write(string)
f.close()

# xldf = pandas.read_excel(xlFile)

# print(xldf.head())
