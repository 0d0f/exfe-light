PREFIX = .
CHECK = \033[32m✔\033[39m
JS_DIR = ${PREFIX}/js
IMG_DIR = ${PREFIX}/img
LESS_DIR = ${PREFIX}/less

EXFE_LESS = ${LESS_DIR}/exfe/lib/exfe.less
EXFE_MOBILE_LESS = ${LESS_DIR}/mobile/lib/mobile.less

PRO = ${PREFIX}/production
PRO_IMG_DIR = ${PRO}/img
PRO_CSS_DIR = ${PRO}/css
RPO_JS_DIR = ${PRO}/js
EXFE_CSS = ${PRO_CSS_DIR}/exfe.css
EXFE_MIN_CSS = ${PRO_CSS_DIR}/exfe.min.css
EXFE_MOBILE_CSS = ${PRO_CSS_DIR}/exfe_mobile.css
EXFE_MOBILE_MIN_CSS = ${PRO_CSS_DIR}/exfe_mobile.min.css

#
# BUILD
#

all: build

start:
	@echo -e '\r'
	@echo "Building Exfe JS/CSS ..."

build: start CSS

CSS:
	@recess --compile ${EXFE_LESS} > ${EXFE_CSS}
	@recess --compress ${EXFE_LESS} > ${EXFE_MIN_CSS}
	@echo "Compiling LESS with Recess...                            ${CHECK} Done"

MOBILE:
	@recess --compile ${EXFE_MOBILE_LESS} > ${EXFE_MOBILE_CSS}
	@recess --compress ${EXFE_MOBILE_LESS} > ${EXFE_MOBILE_MIN_CSS}
	@echo "Compiling LESS with Recess...                            ${CHECK} Done"


#
# start static files server
#
#
up:
	@node ./tools/server.js > /dev/null &

down:
	@killall 'node'


#
# export project
#
#
export:
	@git archive master | bzip2 >source-tree.tar.bz2

.PHONY: build CSS up down export
