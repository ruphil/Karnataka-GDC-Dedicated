import os, Metashape as ps, math, textwrap
from time import gmtime, strftime
import csv
global doc
doc = Metashape.app.document
Metashape.app.console.clear()

outputCSVName = Metashape.app.getString(label = "Enter Valid Output CSV Name")

#Path to Photos
path_photos = Metashape.app.getExistingDirectory("Select Geo-Tagged Image Folder")

#Creating New Chunk
chunk = doc.chunks
doc.remove(chunk)
doc.addChunk()
chunk = doc.chunks[-1]
chunk.label = outputCSVName

#Loading Images
image_list = os.listdir(path_photos)
photo_list = list()
for photo in image_list:
   photo_list.append(path_photos + "\\" + photo)
chunk.addPhotos(photo_list)

#Output Location
output_path = Metashape.app.getExistingDirectory("Select Folder to Save Output CSV")

csvFileName = output_path + "\\" + outputCSVName + "_Output.csv"
csv_file = open(csvFileName, 'w+', newline='')
csv_file.close()

#Append CSV File Function
def AppendToCSV(parameter, msg):
    csv_file = open(csvFileName, 'a+', newline='') 
    current_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    writer = csv.writer(csv_file)
    writer.writerow([current_time, parameter, msg])
    csv_file.close()

#Coordinate Reference System
out_crs = Metashape.CoordinateSystem("EPSG::4326")
for camera in chunk.cameras:
    if camera.reference.location:
        camera.reference.location = Metashape.CoordinateSystem.transform(camera.reference.location, chunk.crs, out_crs)
for marker in chunk.markers:
    if marker.reference.location:
        marker.reference.location = Metashape.CoordinateSystem.transform(marker.reference.location, chunk.crs, out_crs)
chunk.crs = out_crs
chunk.updateTransform()

#Camera Accuracy in (m)
chunk.camera_location_accuracy = Metashape.Vector([0.03,0.03,0.03])

#Align Photos
chunk = doc.chunk
chunk.matchPhotos(accuracy=Metashape.HighAccuracy,
                  generic_preselection=False,
                  reference_preselection=True,
                  keypoint_limit=40000, 
                  tiepoint_limit=4000,
                  filter_mask=False,
                  mask_tiepoints=False)

chunk.alignCameras(adaptive_fitting=True)

#Total Error Calculation Function
def TotalErrorCalc():
   sums = 0
   num = 0
   for camera in chunk.cameras:
       if not camera.transform:
            continue
       if not camera.reference.location:
            continue

       estimated_geoc = chunk.transform.matrix.mulp(camera.center)
       error = chunk.crs.unproject(camera.reference.location) - estimated_geoc
       error = error.norm()
       sums += error**2
       num += 1
   TotalError = math.sqrt(sums / num)
   return TotalError

#Otimization of Camera Alignment Errors Function
def OptCameras():
   chunk.optimizeCameras(fit_f=True, fit_cx=True, fit_cy=True, fit_b1=True, fit_b2=True,
                         fit_k1=True, fit_k2=True, fit_k3=True, fit_k4=False, fit_p1=True,
                         fit_p2=True, fit_p3=False, fit_p4=False, adaptive_fitting=True,
                         tiepoint_covariance=False)
   
def Optimization():
   THRESHOLD = 1 #percentage values for selection
   
   """ Reduce Reconstruction Uncertainty """
   pnts_init = len(pc.points)
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ReconstructionUncertainty)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init * (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   OptCameras()

   """ Reduce Projection Accuracy """
   pnts_init = len(pc.points)
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ProjectionAccuracy)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init * (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   OptCameras()

   """ Reduce Reprojection Error """
   pnts_init = len(pc.points)
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ReprojectionError)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init* (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   OptCameras()

pc = chunk.point_cloud

initialError = TotalErrorCalc()
initialPoints = len(pc.points)

AppendToCSV("initialError", str(initialError))
AppendToCSV("initialPoints", str(initialPoints))

#Optimization of Camera Alignment
while TotalErrorCalc() > 0.03:
    Optimization()

finalPoints = len(pc.points)
finalError = TotalErrorCalc()

AppendToCSV("finalPoints", str(finalPoints))
AppendToCSV("finalError", str(finalError))

if finalError <= 3.0:
    errorAfterOptimization = "OK"
else:
    errorAfterOptimization = "Not OK"

if finalPoints >= 0.5 * initialPoints:
    pointsNumberAfterOptimization = "OK"
else:
    pointsNumberAfterOptimization = "Not OK"

if finalError <= 3.0 and finalPoints >= 0.5 * initialPoints:
    conclusion = "GeoTagged / Raw Data \n Can be Sent To Office"
else:
    conclusion = "Area To Be Reflown \n (or) Check GeoTagging Again"

#Completion message
message = "Initial Processing Completed \n\n Initial Error(m):\n" + str(initialError) + "\n Initial Points:\n" + str(initialPoints) + "\n Final Points:\n" + str(finalPoints) + "\n Error After Processing(m):\n" + str(finalError) + "\n\n Processing Stats: \n Error Permissible:\n" + str(errorAfterOptimization) + "\n Sufficient Points: " + str(pointsNumberAfterOptimization) + "\n\n Conclusion: \n" + str(conclusion) +"\n\n Output CSV File Path:\n" + str(output_path)
Metashape.app.messageBox(message)