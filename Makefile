SHELL := /bin/bash

OUT      := the_shape_of_inquiry
BUILD    := build
WEB      := web
PDF      := $(OUT).pdf

.PHONY: all build pdf web typecheck clean

all: build

build:
	npm run build

pdf: build

web: build

typecheck:
	npm run typecheck

clean:
	npm run clean
