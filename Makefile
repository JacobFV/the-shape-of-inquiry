# The Shape of Inquiry — PDF and web build
#
#   make pdf    — compile LaTeX to PDF
#   make html   — regenerate index.html from LaTeX (pandoc + build.mjs)
#   make all    — pdf + html
#   make clean  — remove LaTeX aux files and pandoc temp
#
# Requirements:
#   pdf:  latexmk (TeX Live)
#   html: pandoc, node

TEX     := the_shape_of_inquiry.tex
PDF     := $(TEX:.tex=.pdf)
HTML    := index.html
FIG     := robot_lab_scene.png
PANDOC  := .paper-pandoc.html

.PHONY: all pdf html web clean cleanall

all: pdf html

pdf: $(PDF)

$(PDF): $(TEX) $(FIG)
	latexmk -pdf -interaction=nonstopmode -halt-on-error $(TEX)

html: $(HTML)

$(HTML): $(TEX) build.mjs paper.css
	node build.mjs

web: html

clean:
	-latexmk -c $(TEX)
	rm -f $(PANDOC)

cleanall: clean
	rm -f $(PDF)
