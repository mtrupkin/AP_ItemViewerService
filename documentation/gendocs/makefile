inputFiles= ../Technologies-Overview.md ../Configuration.md ../ItemViewerService-Manual-Setup.md
htmlOutput= ../../doc.html
pdfOutput= ../../doc.pdf


all: html pdf

html: $(inputFiles)
	pandoc -H style.html --toc -V docheader:"AWS ECS" --template=default.html5 -s -o $(htmlOutput) $(inputFiles)

pdf: $(inputFiles)
	pandoc --toc -V docheader:"AWS ECS" -s -o $(pdfOutput) $(inputFiles)

clean:
	rm -f $(htmlOutput) $(pdfOutput)