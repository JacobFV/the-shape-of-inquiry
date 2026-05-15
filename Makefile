# The Shape of Inquiry — PDF and web build
#
#   make pdf    — compile LaTeX to PDF
#   make html   — regenerate index.html from LaTeX (pandoc + build.mjs)
#   make all    — pdf + html
#   make clean  — remove build outputs and LaTeX aux files
#
# Requirements:
#   pdf:  latexmk (TeX Live), robot_lab_scene.png
#   html: pandoc, node

TEX     := the_shape_of_inquiry.tex
PDF     := $(TEX:.tex=.pdf)
HTML    := index.html
FIG     := robot_lab_scene.png
PANDOC  := .paper-pandoc.html

.PHONY: all pdf html web clean cleanall

all: pdf html

pdf: $(TEX) $(FIG)
	latexmk -pdf -interaction=nonstopmode -halt-on-error $(TEX)

html: $(TEX) build.mjs paper.css
	node build.mjs

web: html

clean:
	-latexmk -C $(TEX)
	rm -f $(PANDOC) $(HTML)

cleanall: clean
