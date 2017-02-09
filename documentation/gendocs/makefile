inputFiles = ../Technologies-Overview.md ../Configuration.md ../ItemViewerService-Manual-Setup.md
htmlOutput = ../../doc.html
pdfOutput = ../../doc.pdf
pdfOptions = --toc --listings --template=default.latex -V title:"Item Viewer" -V monofont:"beramono" -V geometry:margin=1in --latex-engine=pdflatex

all: html pdf

html: $(inputFiles)
	pandoc -H style.html --toc -V docheader:"Item Viewer" --template=default.html5 -s -o $(htmlOutput) $(inputFiles)

pdf: $(inputFiles)
	pandoc $(pdfOptions) -s -o $(pdfOutput) $(inputFiles)

clean:
	rm -f $(htmlOutput) $(pdfOutput)