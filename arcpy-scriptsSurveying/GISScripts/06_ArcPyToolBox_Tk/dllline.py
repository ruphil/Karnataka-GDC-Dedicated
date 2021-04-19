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
        
        self.propertyfcLabel = tk.Label(root, text="Select Property Boundary Feature Class")
        self.propertyfcCombo = ttk.Combobox(root, values=[], state='readonly')

        self.linefcLabel = tk.Label(root, text="Select Line Feature Class")
        self.linefcCombo = ttk.Combobox(root, values=[], state='readonly')
        
        self.targetGDBBtn = tk.Button(root, text ="Select Target GDB", command = self.selectTargetGDB)
        self.targetGDBLabel = tk.Label(root, text="://targetGDBPath/")

        self.entryTargetFCLabel = tk.Label(root, text="Enter Target Feature Class Name")
        self.entryFCTarget = tk.Entry(root, width=30)

        self.entryTargetFieldLabel = tk.Label(root, text="Enter Target Feature House Number Field Name")
        self.entryFieldTarget = tk.Entry(root, width=30)
        
        self.statusLabel = tk.Label(root, text="Click on Start Operation")

        self.startBtn = tk.Button(root, text ="Start Operation", command = self.startOperation)
        self.exitBtn = tk.Button(root, text ="Exit", command=root.destroy)


        self.parentGDBBtn.grid(row = 0, column = 0, pady = self.padding, padx = self.padding)
        self.parentGDBLabel.grid(row = 0, column = 1, pady = self.padding, padx = self.padding)
        
        self.propertyfcLabel.grid(row = 1, column = 0, pady = self.padding, padx = self.padding)
        self.propertyfcCombo.grid(row = 1, column = 1, pady = self.padding, padx = self.padding)

        self.linefcLabel.grid(row = 2, column = 0, pady = self.padding, padx = self.padding)
        self.linefcCombo.grid(row = 2, column = 1, pady = self.padding, padx = self.padding)
        
        self.targetGDBBtn.grid(row = 3, column = 0, pady = self.padding, padx = self.padding)
        self.targetGDBLabel.grid(row = 3, column = 1, pady = self.padding, padx = self.padding)

        self.entryTargetFCLabel.grid(row = 4, column = 0, pady = self.padding, padx = self.padding)
        self.entryFCTarget.grid(row = 4, column = 1, pady = self.padding, padx = self.padding)

        self.entryTargetFieldLabel.grid(row = 5, column = 0, pady = self.padding, padx = self.padding)
        self.entryFieldTarget.grid(row = 5, column = 1, pady = self.padding, padx = self.padding)

        self.statusLabel.grid(row = 6, column = 0, columnspan = 2, pady = self.padding, padx = self.padding)

        self.startBtn.grid(row = 7, column = 0, pady = self.padding, padx = self.padding)
        self.exitBtn.grid(row = 7, column = 1, pady = self.padding, padx = self.padding)

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
            self.propertyfcCombo['values'] = tuple(fclist)
            self.linefcCombo['values'] = tuple(fclist)

    def setTargetFCValue(self, e):
        featureClassStr = self.propertyfcCombo.get()
        # print(featureClassStr)

        self.entryFCTarget.delete(0, 'end')
        self.entryFCTarget.insert(0, featureClassStr + "_3")

        self.entryFieldTarget.delete(0, 'end')
        self.entryFieldTarget.insert(0, "HouseNo")
    
    def selectTargetGDB(self):
        targetGDBPath = tkFileDialog.askdirectory(parent=root, title='Select Parent GDB', initialdir='::{20D04FE0-3AEA-1069-A2D8-08002B30309D}')
        
        if targetGDBPath is None or targetGDBPath == "":
            return
        
        self.targetGDBLabel['text'] = targetGDBPath

    # Model
    def startOperation(self):
        cond1 = self.parentGDBLabel['text'] == "://parentGDBPath/"
        cond2 = self.propertyfcCombo.get() == ""
        cond3 = self.linefcCombo.get() == ""
        cond4 = self.targetGDBLabel['text'] == "://targetGDBPath/"
        cond5 = self.entryFCTarget.get() == ""
        cond6 = self.entryFieldTarget.get() == ""

        # print(cond1, cond2, cond3, cond4, cond5, cond6)

        if (cond1 or cond2 or cond3 or cond4 or cond5 or cond6):
            tkMessageBox.showerror("Error", "Select All Parameters in the Tool")
        else:
            self.putHouseNumbers()

    def putHouseNumbers(self):
        parentpropertyFeatureClass = self.parentGDBLabel['text'] + "/" + self.propertyfcCombo.get()
        parentLineClass = self.parentGDBLabel['text'] + "/" + self.linefcCombo.get()
        targetpropertyFeatureClass = self.targetGDBLabel['text'] + "/" + self.entryFCTarget.get()
        
        targetHouseNosFieldName = self.entryFieldTarget.get()

        arcpy.CopyFeatures_management(parentpropertyFeatureClass, targetpropertyFeatureClass)
        arcpy.AddField_management(targetpropertyFeatureClass, targetHouseNosFieldName, "TEXT")

        partNo_objectID_LineFeature = 0
        total_linear_numbers = 1
        line_row = arcpy.da.SearchCursor(parentLineClass, ["OID@", "SHAPE@"]).next()
        print(line_row)

        line_geom = line_row[1].projectAs(arcpy.SpatialReference(32643))
        line_part = line_geom[partNo_objectID_LineFeature]
        
        first_point = []
        second_point = []
        for pnt in line_part:
            first_point = second_point
            second_point = [pnt.X, pnt.Y]
            if not first_point:
                continue
            
            array = arcpy.Array([arcpy.Point(first_point[0], first_point[1]), arcpy.Point(second_point[0], second_point[1])])
            polyline = arcpy.Polyline(array, arcpy.SpatialReference(32643))

            distance_array = []
            for property_row in arcpy.da.SearchCursor(targetpropertyFeatureClass, ["SHAPE@"]):
                geom_property_prj = property_row[0].projectAs(arcpy.SpatialReference(32643))
                if polyline.crosses(geom_property_prj):
                    first_point_geom = arcpy.PointGeometry(arcpy.Point(first_point[0], first_point[1]), arcpy.SpatialReference(32643))
                    distance = round(first_point_geom.distanceTo(geom_property_prj), 2)
                    
                    distance_array.append(distance)
            
            distance_array = sorted(distance_array)
            # print(distance_array, len(distance_array))
            
            fields = ["OID@", "SHAPE@", targetHouseNosFieldName]
            for distance_in_array in distance_array:
                with arcpy.da.UpdateCursor(targetpropertyFeatureClass, fields) as cursor:
                    for property_row in cursor:
                        geom_property_prj = property_row[1].projectAs(arcpy.SpatialReference(32643))
                        if polyline.crosses(geom_property_prj):
                            first_point_geom = arcpy.PointGeometry(arcpy.Point(first_point[0], first_point[1]), arcpy.SpatialReference(32643))
                            distance = round(first_point_geom.distanceTo(geom_property_prj), 2)
                            
                            if (property_row[2] == "" or property_row[2] is None) and distance_in_array == distance:
                                property_row[2] = str(total_linear_numbers)
                                cursor.updateRow(property_row)
                                total_linear_numbers += 1

        self.statusLabel['text'] = 'Operation Completed...'

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Built Up Area Calculation Tool")
    root.resizable(False, False)

    MainApplication(root)
    root.mainloop()