# -*- coding: utf-8 -*-

import codecs
import pandas

xlFile = 'D:/GIS/Seebekatte_form2_ 01-09-2020.xlsx'
txtFile = 'D:/GIS/utfuni.txt'
txtFile_out = 'D:/GIS/utfuni_out.txt'

xldf = pandas.read_excel(xlFile, header=None, encoding="utf-8")

columns = len(xldf.columns)
rows = len(xldf.index)

xlsxTable = []
for rowIndex in range(0, rows):
    xlsxRow = []
    for colIndex in range(0, columns):
        cellValue = u'{}'.format(xldf[colIndex][rowIndex])
        xlsxRow.append(cellValue)
    xlsxTable.append(xlsxRow)

f = codecs.open(txtFile_out, "a", "utf-8")
for row in xlsxTable:
    for cell in row:
        cellValue = u'{}'.format(cell)
        f.write(cellValue)

f.close()


