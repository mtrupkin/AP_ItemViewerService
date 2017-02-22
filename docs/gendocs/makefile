inputFiles = ../Technologies-Overview.md ../Configuration.md ../ItemViewerService-Manual-Setup.md ../BuildApp.md ../Docker.md ../Loading-Items.md
htmlOutput = ../index.html
pdfOutput = ../doc.pdf
htmlOptions = -H style.html --toc -V docheader:"Item Viewer Service" --template=default.html5
pdfOptions = --toc --listings --template=default.latex -V title:"Item Viewer Service" -V monofont:"beramono" -V geometry:margin=1in -V urlcolor:blue --latex-engine=pdflatex

all: html pdf

html: $(inputFiles)
	pandoc $(htmlOptions) -s -o $(htmlOutput) $(inputFiles)

pdf: $(inputFiles)
	pandoc $(pdfOptions) -s -o $(pdfOutput) $(inputFiles)

clean:
	rm -f $(htmlOutput) $(pdfOutput)