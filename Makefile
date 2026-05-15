SHELL := /bin/bash

TEX      := main.tex
OUT      := the_shape_of_inquiry
BUILD    := build
WEB      := web
PDF      := $(OUT).pdf

.PHONY: tex2pdf tex2web clean

tex2pdf:
	mkdir -p $(BUILD)
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=$(BUILD) -jobname=$(OUT) $(TEX)
	cp $(BUILD)/$(OUT).pdf $(PDF)

tex2web: tex2pdf
	python3 scripts/build_web.py $(TEX) $(PDF) $(WEB)

clean:
	rm -rf $(BUILD) $(WEB) $(PDF)
	latexmk -C -outdir=$(BUILD) -jobname=$(OUT) $(TEX) || true
