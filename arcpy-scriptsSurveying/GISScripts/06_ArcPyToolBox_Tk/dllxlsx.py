# -*- coding: utf-8 -*-

import Tkinter as tk
import tkFileDialog
import ttk
from tkFileDialog import askopenfilename
import tkMessageBox

import arcpy
# import codecs
import pandas
arcpy.env.overwriteOutput = True

class MainApplication():
    # View
    def __init__(self, root):
        self.padding = 10

        self.parentGDBBtn = tk.Button(root, text ="Select Parent GDB", command = self.selectParentGDB)
        self.parentGDBLabel = tk.Label(root, text="://parentGDBPath/")
        
        self.fcLabel = tk.Label(root, text="Select Feature Class")
        self.featureClassesCombo = ttk.Combobox(root, values=[], state='readonly')
        
        self.fieldLabelFC = tk.Label(root, text="Select Matching Field in Feature Class")
        self.fieldComboFC = ttk.Combobox(root, values=[], state='readonly')
        
        self.xlsxBtn = tk.Button(root, text ="Select XLSX File", command = self.selectXLSX)
        self.xlsxLabel = tk.Label(root, text="://xlsxPath/")
        self.fieldLabelXLSX = tk.Label(root, text="Select Matching Field in XLSX")
        self.fieldComboXLSX = ttk.Combobox(root, values=[], state='readonly')
        
        self.targetGDBBtn = tk.Button(root, text ="Select Target GDB", command = self.selectTargetGDB)
        self.targetGDBLabel = tk.Label(root, text="://targetGDBPath/")

        self.entryTargetLabel = tk.Label(root, text="Enter Target Feature Class Name")
        self.entryTarget = tk.Entry(root, width=30)
        
        self.statusLabel = tk.Label(root, text="Click on Start Operation")

        self.startBtn = tk.Button(root, text ="Start Operation", command = self.startOperation)
        self.exitBtn = tk.Button(root, text ="Exit", command=root.destroy)


        self.parentGDBBtn.grid(row = 0, column = 0, pady = self.padding, padx = self.padding)
        self.parentGDBLabel.grid(row = 0, column = 1, pady = self.padding, padx = self.padding)
        
        self.fcLabel.grid(row = 1, column = 0, pady = self.padding, padx = self.padding)
        self.featureClassesCombo.grid(row = 1, column = 1, pady = self.padding, padx = self.padding)
        
        self.fieldLabelFC.grid(row = 2, column = 0, pady = self.padding, padx = self.padding)
        self.fieldComboFC.grid(row = 2, column = 1, pady = self.padding, padx = self.padding)
        
        self.xlsxBtn.grid(row = 3, column = 0, pady = self.padding, padx = self.padding)
        self.xlsxLabel.grid(row = 3, column = 1, pady = self.padding, padx = self.padding)
        
        self.fieldLabelXLSX.grid(row = 4, column = 0, pady = self.padding, padx = self.padding)
        self.fieldComboXLSX.grid(row = 4, column = 1, pady = self.padding, padx = self.padding)
        
        self.targetGDBBtn.grid(row = 5, column = 0, pady = self.padding, padx = self.padding)
        self.targetGDBLabel.grid(row = 5, column = 1, pady = self.padding, padx = self.padding)

        self.entryTargetLabel.grid(row = 6, column = 0, pady = self.padding, padx = self.padding)
        self.entryTarget.grid(row = 6, column = 1, pady = self.padding, padx = self.padding)

        self.statusLabel.grid(row = 7, column = 0, columnspan = 2, pady = self.padding, padx = self.padding)

        self.startBtn.grid(row = 8, column = 0, pady = self.padding, padx = self.padding)
        self.exitBtn.grid(row = 8, column = 1, pady = self.padding, padx = self.padding)

        self.featureClassesCombo.bind("<<ComboboxSelected>>", self.showFields)

    # Controller
    def selectParentGDB(self):
        parentGDBPath = tkFileDialog.askdirectory(parent=root, title='Select Parent GDB', initialdir='::{20D04FE0-3AEA-1069-A2D8-08002B30309D}')
        
        if parentGDBPath is None or parentGDBPath == "":
            return
        
        self.parentGDBLabel['text'] = parentGDBPath

        arcpy.env.workspace = parentGDBPath

        fclist = arcpy.ListFeatureClasses()
        # print(fclist)

        if fclist is not None:
            self.featureClassesCombo['values'] = tuple(fclist)

    def showFields(self, e):
        featureClassStr = self.featureClassesCombo.get()
        # print(featureClassStr)

        self.entryTarget.delete(0, 'end')
        self.entryTarget.insert(0, featureClassStr + "_4")
        
        field_names_ParentClass = [f.name for f in arcpy.ListFields(featureClassStr)]

        self.field_names_ParentClass = field_names_ParentClass
        self.fieldComboFC['values'] = tuple(field_names_ParentClass)

    def selectXLSX(self):
        xlsxFilePath = askopenfilename(parent=root, title='Select XLSX File')

        if xlsxFilePath is None or xlsxFilePath == "":
            return

        self.xlsxLabel['text'] = xlsxFilePath

        xldf = pandas.read_excel(xlsxFilePath, header=None, encoding="utf-8")

        columns = len(xldf.columns)
        rows = len(xldf.index)

        xlsxTable = []
        for rowIndex in range(0, rows):
            xlsxRow = []
            for colIndex in range(0, columns):
                cellValue = u'{}'.format(xldf[colIndex][rowIndex])
                xlsxRow.append(cellValue)
            xlsxTable.append(xlsxRow)

        self.heading_row_xlsxList_actual = xlsxTable[0]
        self.fieldTotalColumns = len(xlsxTable[0])

        heading_row_xlsxList_mod = []
        for i in range(1, self.fieldTotalColumns + 1):
            heading_row_xlsxList_mod.append(self.colnum_string(i))

        self.heading_row_xlsxList_mod = heading_row_xlsxList_mod
        
        xlsxTable.pop(0)
        self.xlsxTable = xlsxTable

        self.fieldComboXLSX['values'] = tuple(self.heading_row_xlsxList_actual)
    
    def colnum_string(self, n):
        string = ""
        while n > 0:
            n, remainder = divmod(n - 1, 26)
            string = chr(65 + remainder) + string
        return string

    def selectTargetGDB(self):
        targetGDBPath = tkFileDialog.askdirectory(parent=root, title='Select Parent GDB', initialdir='::{20D04FE0-3AEA-1069-A2D8-08002B30309D}')
        
        if targetGDBPath is None or targetGDBPath == "":
            return
        
        self.targetGDBLabel['text'] = targetGDBPath

    # Model
    def startOperation(self):
        # self.targetGDBLabel['text'] = self.parentGDBLabel['text']
        cond1 = self.parentGDBLabel['text'] == "://parentGDBPath/"
        cond2 = self.featureClassesCombo.get() == ""
        cond3 = self.fieldComboFC.get() == ""
        cond4 = self.xlsxLabel['text'] == "://xlsxPath/"
        cond5 = self.fieldComboXLSX.get() == ""
        cond6 = self.targetGDBLabel['text'] == "://targetGDBPath/"
        cond7 = self.entryTarget.get() == ""

        # print(cond1, cond2, cond3, cond4, cond5, cond6, cond7)

        if (cond1 or cond2 or cond3 or cond4 or cond5 or cond6 or cond7):
            tkMessageBox.showerror("Error", "Select All Parameters in the Tool")
        else:
            self.joinXLSX()

    def joinXLSX(self):
        parentFeatureClass = self.parentGDBLabel['text'] + "/" + self.featureClassesCombo.get()
        targetFeatureClass = self.targetGDBLabel['text'] + "/" + self.entryTarget.get()
        
        arcpy.CreateFeatureclass_management(self.targetGDBLabel['text'], self.entryTarget.get(), "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
        
        matchingFieldActual = self.fieldComboXLSX.get()

        indexMatchingFieldFC = self.field_names_ParentClass.index(self.fieldComboFC.get())
        indexMatchingFieldXLSX = self.heading_row_xlsxList_actual.index(matchingFieldActual)

        joined_FieldNames_Target = self.field_names_ParentClass + self.heading_row_xlsxList_mod
        # print(joined_FieldNames_Target)

        for field in joined_FieldNames_Target:
            if (field != 'OBJECTID' and field != 'SHAPE' and field != 'SHAPE_Length' and field != 'SHAPE_Area'):
                arcpy.AddField_management(targetFeatureClass, field, "TEXT")

        self.field_names_ParentClass.remove('SHAPE')
        self.field_names_ParentClass.insert(0, 'SHAPE@')

        joined_FieldNames_Target.remove('SHAPE')
        joined_FieldNames_Target.insert(0, 'SHAPE@')

        cursorTarget = arcpy.da.InsertCursor(targetFeatureClass, joined_FieldNames_Target)
        for feat in arcpy.da.SearchCursor(parentFeatureClass, self.field_names_ParentClass):
            uniqueFieldValueFC = str(feat[indexMatchingFieldFC])
            for xlsx_row in self.xlsxTable:
                uniqueFieldValueXLSX = xlsx_row[indexMatchingFieldXLSX]

                if (uniqueFieldValueFC == uniqueFieldValueXLSX):
                    joined_feature_row = list(feat) + xlsx_row
                    # print(joined_feature_row)
                    # print(len(joined_feature_row))
                    cursorTarget.insertRow(joined_feature_row)

        del cursorTarget

        for i in range(0, self.fieldTotalColumns):
            old_field = self.heading_row_xlsxList_mod[i]
            new_field = self.heading_row_xlsxList_actual[i]
            arcpy.AlterField_management(targetFeatureClass, old_field, new_field[:30])

        self.statusLabel['text'] = 'Operation Completed...'
        print("All Done")
        

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Join XLSX Tool")
    root.resizable(False, False)

    MainApplication(root)
    root.mainloop()