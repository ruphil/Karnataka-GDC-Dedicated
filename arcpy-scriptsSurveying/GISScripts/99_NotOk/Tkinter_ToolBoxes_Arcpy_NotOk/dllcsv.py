from Tkinter import *
import tkFileDialog
from tkFileDialog import askopenfilename

import os
import arcpy
arcpy.env.overwriteOutput = True

parentgdbSelectWindow = Tk()
parentgdbSelectWindow.withdraw() #use to hide tkinter window

parentgdbFileSelected = tkFileDialog.askdirectory(parent=parentgdbSelectWindow, title='Select Parent GDB')
parentgdbSelectWindow.quit()

parentgdbFilePath = ""
if len(parentgdbFileSelected) > 0:
    parentgdbFilePath = parentgdbFileSelected
else:
    exit()

arcpy.env.workspace = parentgdbFilePath

fclist = arcpy.ListFeatureClasses()
print(fclist)

featureClassSelectWindow = Tk()
l_fc = Listbox(featureClassSelectWindow, width = 30)
l_fc.pack()

for fc in fclist:
    l_fc.insert(END, fc)

featureClass = None
def select():
    global l_fc, featureClassSelectWindow, featureClass
    featureClass = l_fc.get(l_fc.curselection())
    featureClassSelectWindow.quit()

b = Button(featureClassSelectWindow, text = "Select FeatureClass", command = select).pack()
featureClassSelectWindow.mainloop()

field_names_Parent = [f.name for f in arcpy.ListFields(featureClass)]

fieldNameSelectWindow = Tk()
l_fn = Listbox(fieldNameSelectWindow, width = 30)
l_fn.pack()

for fn in field_names_Parent:
    l_fn.insert(END, fn)

matching_fieldName_GDB = None
def select():
    global l_fn, fieldNameSelectWindow, matching_fieldName_GDB
    matching_fieldName_GDB = l_fn.get(l_fn.curselection())
    fieldNameSelectWindow.quit()

b = Button(fieldNameSelectWindow, text = "Select Matching Field in GDB", command = select).pack()
fieldNameSelectWindow.mainloop()

filePath = askopenfilename()
f_csv = open(filePath,'r')
contents = f_csv.read()
f_csv.close()

# print(contents)
csv_rows = [x.strip() for x in contents.split('\n')]
heading_row_csv = [x.strip() for x in csv_rows[0].split(',')]
# print(rows)

targetgdbSelectWindow = Tk()
targetgdbSelectWindow.withdraw()
targetgdbFileSelected = tkFileDialog.askdirectory(parent=targetgdbSelectWindow, title='Select Target GDB')
targetgdbSelectWindow.quit()

targetgdbFilePath = ""
if len(targetgdbFileSelected) > 0:
    targetgdbFilePath = targetgdbFileSelected
else:
    exit()

fieldNameCSVSelectWindow = Tk()
l_fn_csv = Listbox(fieldNameCSVSelectWindow, width = 30)
l_fn_csv.pack()

for fn_csv in heading_row_csv:
    l_fn_csv.insert(END, fn_csv)

matching_fieldName_CSV = None
def select():
    global l_fn_csv, fieldNameCSVSelectWindow, matching_fieldName_GDB
    matching_fieldName_CSV = l_fn_csv.get(l_fn_csv.curselection())
    fieldNameCSVSelectWindow.quit()

b = Button(fieldNameCSVSelectWindow, text = "Select Matching Field in CSV", command = select).pack()
fieldNameCSVSelectWindow.mainloop()

targetFeatureClass = targetgdbFileSelected + "/" + featureClass + "_1"
joined_FieldNames_Parent = ["SHAPE@"] + field_names_Parent

joined_FieldNames_Target = joined_FieldNames_Parent + heading_row_csv

for field in joined_FieldNames_Target:
    arcpy.AddField_management(targetFeatureClass, field, "TEXT")

# cursorTarget = arcpy.da.InsertCursor(targetFeatureClass, ['SheetNo', 'SHAPE@'])



# for row in rows:
#     print(row)


# for feat in arcpy.da.SearchCursor(featureClass, joined_FieldNames):
#     print(feat)

print(filePath)


# arcpy.CopyFeatures_management(parentgdbFilePath + "/" + featureClass, targetgdbFileSelected + "/" + featureClass + "_1")