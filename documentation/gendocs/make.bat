@ECHO OFF
SET inputFiles= ../Technologies-Overview.md ../Configuration.md ../ItemViewerService-Manual-Setup.md
SET output=../../doc.pdf
SET docheader="AWS ECS"
@ECHO ON

pandoc --toc -s -o %output% %inputFiles%