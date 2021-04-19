import Tkinter as tk
import tkFileDialog
import ttk
from tkFileDialog import askopenfilename
import tkMessageBox

import arcpy
import math
arcpy.env.overwriteOutput = True

class MainApplication():
    # View
    def __init__(self, root):
        self.padding = 10

        self.parentGDBBtn = tk.Button(root, text ="Select Parent GDB", command = self.selectParentGDB)
        self.parentGDBLabel = tk.Label(root, text="://parentGDBPath/")
        
        self.polygonfcLabel = tk.Label(root, text="Select Polygon Feature Class")
        self.polygonfcCombo = ttk.Combobox(root, values=[], state='readonly')
        
        self.targetGDBBtn = tk.Button(root, text ="Select Target GDB", command = self.selectTargetGDB)
        self.targetGDBLabel = tk.Label(root, text="://targetGDBPath/")

        self.labelcollinearity = tk.Label(root, text="Baseline Tolerance - Collinearity (cm)")
        self.entrycollinearity = tk.Entry(root, width=30)

        self.labelangle = tk.Label(root, text="Base Angle Tolerance (degrees)")
        self.entryangle = tk.Entry(root, width=30)
        
        self.statusLabel = tk.Label(root, text="Click on Start Operation (Creates PROPERTY_LINES_SIMPLIFIED)")

        self.startBtn = tk.Button(root, text ="Start Operation", command = self.startOperation)
        self.exitBtn = tk.Button(root, text ="Exit", command = root.destroy)


        self.parentGDBBtn.grid(row = 0, column = 0, pady = self.padding, padx = self.padding)
        self.parentGDBLabel.grid(row = 0, column = 1, pady = self.padding, padx = self.padding)
        
        self.polygonfcLabel.grid(row = 1, column = 0, pady = self.padding, padx = self.padding)
        self.polygonfcCombo.grid(row = 1, column = 1, pady = self.padding, padx = self.padding)
        
        self.targetGDBBtn.grid(row = 2, column = 0, pady = self.padding, padx = self.padding)
        self.targetGDBLabel.grid(row = 2, column = 1, pady = self.padding, padx = self.padding)

        self.labelcollinearity.grid(row = 3, column = 0, pady = self.padding, padx = self.padding)
        self.entrycollinearity.grid(row = 3, column = 1, pady = self.padding, padx = self.padding)

        self.labelangle.grid(row = 4, column = 0, pady = self.padding, padx = self.padding)
        self.entryangle.grid(row = 4, column = 1, pady = self.padding, padx = self.padding)

        self.statusLabel.grid(row = 5, column = 0, columnspan = 2, pady = self.padding, padx = self.padding)

        self.startBtn.grid(row = 6, column = 0, pady = self.padding, padx = self.padding)
        self.exitBtn.grid(row = 6, column = 1, pady = self.padding, padx = self.padding)

        self.polygonfcCombo.bind("<<ComboboxSelected>>", self.setDefaultValues)

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
            self.polygonfcCombo['values'] = tuple(fclist)

    def setDefaultValues(self, e):
        self.entrycollinearity.delete(0, 'end')
        self.entrycollinearity.insert(0, str(10))

        self.entryangle.delete(0, 'end')
        self.entryangle.insert(0, str(5))
    
    def selectTargetGDB(self):
        targetGDBPath = tkFileDialog.askdirectory(parent=root, title='Select Parent GDB', initialdir='::{20D04FE0-3AEA-1069-A2D8-08002B30309D}')
        
        if targetGDBPath is None or targetGDBPath == "":
            return
        
        self.targetGDBLabel['text'] = targetGDBPath

    # Model
    def startOperation(self):
        cond1 = self.parentGDBLabel['text'] == "://parentGDBPath/"
        cond2 = self.polygonfcCombo.get() == ""
        cond3 = self.targetGDBLabel['text'] == "://targetGDBPath/"
        cond4 = self.entrycollinearity.get() == ""
        cond5 = self.entryangle.get() == ""

        # print(cond1, cond2, cond3, cond4, cond5, cond6, cond7)

        if (cond1 or cond2 or cond3 or cond4 or cond5):
            tkMessageBox.showerror("Error", "Select All Parameters in the Tool")
        else:
            self.optimizePolygonVerticesNMakeLines()
    
    def tweakPolygon(self, poly_feat_geom):
        # print(poly_feat_geom)
        base_tolerance_collinearity = float(self.entrycollinearity.get()) / 100
        angle_tolerance = float(self.entryangle.get())
        # print(base_tolerance_collinearity, angle_tolerance)

        feat_part = poly_feat_geom[0]

        arcpy_pts_array = []
        simple_pts_array = []
        for pnt in feat_part:
            arcpy_pts_array.append(arcpy.Point(pnt.X, pnt.Y))
            simple_pts_array.append([pnt.X, pnt.Y])

        # print(len(simple_pts_array))
        pts_array_len = len(simple_pts_array)
        for index, _ in enumerate(arcpy_pts_array):
            # angle algorithm
            angleBtw = 45
            simplePt1 = simple_pts_array[int((index + 0) % pts_array_len)]
            simplePt2 = simple_pts_array[int((index + 1) % pts_array_len)]
            simplePt3 = simple_pts_array[int((index + 2) % pts_array_len)]

            try:
                m1 = (simplePt1[1] - simplePt2[1]) / (simplePt1[0] - simplePt2[0])
                m2 = (simplePt2[1] - simplePt3[1]) / (simplePt2[0] - simplePt3[0])

                tanTheta = abs((m1 - m2)/(1 + m1 * m2))

                angleBtw = math.degrees(math.atan(tanTheta))
            except:
                pass

            # length algorithm
            arcpt1 = arcpy_pts_array[int((index + 0) % pts_array_len)]
            arcpt2 = arcpy_pts_array[int((index + 1) % pts_array_len)]
            arcpt3 = arcpy_pts_array[int((index + 2) % pts_array_len)]

            lineAB = arcpy.Polyline(arcpy.Array([arcpt1, arcpt2]), arcpy.SpatialReference(32643))
            lineBC = arcpy.Polyline(arcpy.Array([arcpt2, arcpt3]), arcpy.SpatialReference(32643))
            lineAC = arcpy.Polyline(arcpy.Array([arcpt1, arcpt3]), arcpy.SpatialReference(32643))

            cond1 = abs((lineAB.length + lineBC.length) - lineAC.length) < base_tolerance_collinearity
            cond2 = angleBtw < angle_tolerance

            if cond1 and cond2:
                arcpy_pts_array.remove(arcpt2)

                poly_feat_geom_mod = arcpy.Polygon(arcpy.Array(arcpy_pts_array), arcpy.SpatialReference(32643))
                return [True, poly_feat_geom_mod]

        return [False]

    def optimizePolygonVerticesNMakeLines(self):
        inGDBPath = self.parentGDBLabel['text'] + "/"
        inFCName = self.polygonfcCombo.get()
        targetGDB = self.targetGDBLabel['text'] + "/"

        simplePolygons = arcpy.CreateFeatureclass_management("in_memory", "simplePolygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
        cursor_simplify = arcpy.da.InsertCursor(simplePolygons, ['SHAPE@'])

        total_feat_count = arcpy.GetCount_management(inGDBPath + inFCName)

        feat_count = 0
        for poly_feat in arcpy.da.SearchCursor(inGDBPath + inFCName, ["SHAPE@"]):
            poly_feat_geom = poly_feat[0].projectAs(arcpy.SpatialReference(32643))

            toTweakPolygonBool = True
            while toTweakPolygonBool:
                result = self.tweakPolygon(poly_feat_geom)
                toTweakPolygonBool = result[0]

                if(toTweakPolygonBool):
                    poly_feat_geom = result[1]

            cursor_simplify.insertRow([poly_feat_geom])
            feat_count += 1

            if feat_count % 10 == 0 or feat_count == int(str(total_feat_count)):
                print(str(feat_count) +  " Features of " + str(total_feat_count) + " Total Features simplified")

            # if feat_count == 20:
            #     break

        del cursor_simplify

        polygonToLine = arcpy.CreateFeatureclass_management("in_memory", "polygonToLine", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
        linesAtVertices = arcpy.CreateFeatureclass_management("in_memory", "linesAtVertices", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))

        arcpy.PolygonToLine_management(simplePolygons, polygonToLine, "IGNORE_NEIGHBORS")
        arcpy.SplitLine_management(polygonToLine, linesAtVertices)

        arcpy.CopyFeatures_management(linesAtVertices, targetGDB + "PROPERTY_LINES_SIMPLIFIED")
        print("all done")

        self.statusLabel['text'] = 'Operation Completed...'

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Simlify Polygon Lines")
    root.resizable(False, False)

    MainApplication(root)
    root.mainloop()