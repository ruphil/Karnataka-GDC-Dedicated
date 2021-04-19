import Tkinter as tk
import tkFileDialog
import ttk
from tkFileDialog import askopenfilename
import tkMessageBox

import arcpy
import csv
arcpy.env.overwriteOutput = True

class MainApplication():
    # View
    def __init__(self, root):
        self.padding = 10

        self.parentGDBBtn = tk.Button(root, text ="Select Parent GDB", command = self.selectParentGDB)
        self.parentGDBLabel = tk.Label(root, text="://parentGDBPath/")
        
        self.gramfcLabel = tk.Label(root, text="Select Gramthana Feature Class")
        self.gramfcCombo = ttk.Combobox(root, values=[], state='readonly')

        self.gramSurveyFieldLabel = tk.Label(root, text="Select Survey Nos Field in Gramthana")
        self.gramSurveyFieldCombo = ttk.Combobox(root, values=[], state='readonly')

        self.propertyfcLabel = tk.Label(root, text="Select Property Boundary Feature Class")
        self.propertyfcCombo = ttk.Combobox(root, values=[], state='readonly')
        
        self.targetGDBBtn = tk.Button(root, text ="Select Target GDB", command = self.selectTargetGDB)
        self.targetGDBLabel = tk.Label(root, text="://targetGDBPath/")

        self.entryTargetFCLabel = tk.Label(root, text="Enter Target Feature Class Name")
        self.entryFCTarget = tk.Entry(root, width=30)

        self.entryTargetFieldLabel = tk.Label(root, text="Enter Target Feature Class SurveyNos Field Name")
        self.entryFieldTarget = tk.Entry(root, width=30)
        
        self.statusLabel = tk.Label(root, text="Click on Start Operation")

        self.startBtn = tk.Button(root, text ="Start Operation", command = self.startOperation)
        self.exitBtn = tk.Button(root, text ="Exit", command=root.destroy)


        self.parentGDBBtn.grid(row = 0, column = 0, pady = self.padding, padx = self.padding)
        self.parentGDBLabel.grid(row = 0, column = 1, pady = self.padding, padx = self.padding)
        
        self.gramfcLabel.grid(row = 1, column = 0, pady = self.padding, padx = self.padding)
        self.gramfcCombo.grid(row = 1, column = 1, pady = self.padding, padx = self.padding)
        
        self.gramSurveyFieldLabel.grid(row = 2, column = 0, pady = self.padding, padx = self.padding)
        self.gramSurveyFieldCombo.grid(row = 2, column = 1, pady = self.padding, padx = self.padding)
        
        self.propertyfcLabel.grid(row = 3, column = 0, pady = self.padding, padx = self.padding)
        self.propertyfcCombo.grid(row = 3, column = 1, pady = self.padding, padx = self.padding)
        
        self.targetGDBBtn.grid(row = 4, column = 0, pady = self.padding, padx = self.padding)
        self.targetGDBLabel.grid(row = 4, column = 1, pady = self.padding, padx = self.padding)

        self.entryTargetFCLabel.grid(row = 5, column = 0, pady = self.padding, padx = self.padding)
        self.entryFCTarget.grid(row = 5, column = 1, pady = self.padding, padx = self.padding)

        self.entryTargetFieldLabel.grid(row = 6, column = 0, pady = self.padding, padx = self.padding)
        self.entryFieldTarget.grid(row = 6, column = 1, pady = self.padding, padx = self.padding)

        self.statusLabel.grid(row = 7, column = 0, columnspan = 2, pady = self.padding, padx = self.padding)

        self.startBtn.grid(row = 8, column = 0, pady = self.padding, padx = self.padding)
        self.exitBtn.grid(row = 8, column = 1, pady = self.padding, padx = self.padding)

        self.gramfcCombo.bind("<<ComboboxSelected>>", self.showFields)
        self.propertyfcCombo.bind("<<ComboboxSelected>>", self.setTargetFCValue)

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
            self.gramfcCombo['values'] = tuple(fclist)
            self.propertyfcCombo['values'] = tuple(fclist)

    def showFields(self, e):
        featureClassStr = self.gramfcCombo.get()
        # print(featureClassStr)
        
        field_names_Gramthana = [f.name for f in arcpy.ListFields(featureClassStr)]

        self.gramSurveyFieldCombo['values'] = tuple(field_names_Gramthana)

    def setTargetFCValue(self, e):
        featureClassStr = self.propertyfcCombo.get()
        # print(featureClassStr)

        self.entryFCTarget.delete(0, 'end')
        self.entryFCTarget.insert(0, featureClassStr + "_1")

        self.entryFieldTarget.delete(0, 'end')
        self.entryFieldTarget.insert(0, "SurveyNos")
    
    def selectTargetGDB(self):
        targetGDBPath = tkFileDialog.askdirectory(parent=root, title='Select Parent GDB', initialdir='::{20D04FE0-3AEA-1069-A2D8-08002B30309D}')
        
        if targetGDBPath is None or targetGDBPath == "":
            return
        
        self.targetGDBLabel['text'] = targetGDBPath

    # Model
    def startOperation(self):
        cond1 = self.parentGDBLabel['text'] == "://parentGDBPath/"
        cond2 = self.gramfcCombo.get() == ""
        cond3 = self.gramSurveyFieldCombo.get() == ""
        cond4 = self.propertyfcCombo.get() == ""
        cond5 = self.targetGDBLabel['text'] == "://targetGDBPath/"
        cond6 = self.entryFCTarget.get() == ""
        cond7 = self.entryFieldTarget.get() == ""

        # print(cond1, cond2, cond3, cond4, cond5, cond6, cond7)

        if (cond1 or cond2 or cond3 or cond4 or cond5 or cond6 or cond7):
            tkMessageBox.showerror("Error", "Select All Parameters in the Tool")
        else:
            self.plungeSurveyNos()

    def plungeSurveyNos(self):
        parentgramthanaFeatureClass = self.parentGDBLabel['text'] + "/" + self.gramfcCombo.get()
        parentpropertyFeatureClass = self.parentGDBLabel['text'] + "/" + self.propertyfcCombo.get()
        targetpropertyFeatureClass = self.targetGDBLabel['text'] + "/" + self.entryFCTarget.get()
        
        gramthanaSurveyNosFieldName = self.gramSurveyFieldCombo.get()
        targetSurveyNosFieldName = self.entryFieldTarget.get()

        arcpy.CopyFeatures_management(parentpropertyFeatureClass, targetpropertyFeatureClass)

        arcpy.AddField_management(targetpropertyFeatureClass, targetSurveyNosFieldName, "TEXT")

        fields = ["OID@", "SHAPE@", targetSurveyNosFieldName]
        with arcpy.da.UpdateCursor(targetpropertyFeatureClass, fields) as cursor:
            for land_row in cursor:
                geom_land = land_row[1]
                geom_land_prj = geom_land.projectAs(arcpy.SpatialReference(32643))

                surveyNoCollections = ""
                for gram_row in arcpy.da.SearchCursor(parentgramthanaFeatureClass, ["SHAPE@", gramthanaSurveyNosFieldName]):
                    geom_gram = gram_row[0]
                    surveyNo_gram = gram_row[1]
                    geom_gram_prj = geom_gram.projectAs(arcpy.SpatialReference(32643))

                    if geom_gram_prj.overlaps(geom_land_prj) or geom_gram_prj.contains(geom_land_prj):
                        surveyNoCollections += surveyNo_gram + ", "

                surveyNoCollections = surveyNoCollections[:-2]
                land_row[2] = surveyNoCollections
                cursor.updateRow(land_row)

        self.statusLabel['text'] = 'Operation Completed...'

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Plunge Survey Numbers Tool")
    root.resizable(False, False)

    MainApplication(root)
    root.mainloop()