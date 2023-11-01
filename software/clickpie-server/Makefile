#!/usr/bin/make

# Application
app_name:=clickpie-server
app_version:=0.0.1
app_vversion:=v$(app_version)
app_distname:=$(app_name)-$(app_vversion)

SHELL:=/usr/bin/bash
.DEFAULT_GOAL:=all
# Backtrack changes in case of an exception
.DELETE_ON_ERROR:
# By default export all variables to child processes.
.EXPORT_ALL_VARIABLES:
# Re-evaluate designated $$variables in prerequisites
.SECONDEXPANSION:
# Recipe lines all make use of the same shell process instance.
.ONESHELL:

# Specials symbols
comma:=,
empty:=
space:= $(empty) $(empty)
squote:=$(shell echo "'")
dquote:=$(shell echo '"')

# Environment
ifneq ($(mode),)
MODE:=$(mode)
else
MODE?=production
endif

# App directories
prjdir:=../..
prjdir_abs:=$(realpath $(prjdir))
softdir:=..
softdir_abs:=$(realpath $(softdir))
appdir:=.
appdir_abs:=$(realpath $(appdir))
srcdir:=$(appdir)/src
buildir:=$(appdir)/build
confdir:=$(appdir)/config

# Tools
install=/usr/bin/install
mkdirp:=/usr/bin/mkdir -p
sort:=/usr/bin/sort
cp:=/usr/bin/cp
rm:=/usr/bin/rm
chmod:=/usr/bin/chmod
mpp:=/usr/bin/m4
node:=$(NVM_BIN)/node
compiler:=
tester:=
linter:=
formatter:=
pretty_output:=
dotenv:=/home/pnoul/bin/dotenv
dotenvdirs:=$(softdir)/config/env $(softdir)/ $(confdir)/env $(appdir)
dotenvflags:=--mode=$(MODE)
dotenvfile:=.env
loadenv:=set -a; source $(dotenvfile)

# Metadata
timestamp:=$(shell date +%s)
date:=$(shell date --date=@$(timestamp))
date_path_safe:=$(shell date --date=@$(timestamp) +%y-%m-%dT%H-%M-%S)
git_author:=$(shell git config --get user.name)
git_author_email:=$(shell git config --get user.email)
git_branch:=$(shell git branch --show-current)
git_commit:=$(shell git rev-parse --short HEAD)
ifneq ($(strip $(shell git status --porcelain)),)
git_status:=dirty
else
git_status:=clean
endif
user:=$(shell id --name --user)
hostname:=$(shell hostname)

# Metafiles
releasefile:=RELEASE
changelogfile:=CHANGELOG
readmefile:=README.md
metafiles:=$(releasefile) $(changelogfile) $(readmefile)

# Distribute
distsrc_basename:=$(app_name)-$(app_vversion)+src.$(git_author).$(date_path_safe)
distbin_basename:=$(app_name)-$(app_vversion)+bin.$(git_author).$(date_path_safe)
distsrc:=$(appdir)/$(distsrc_basename)
distbin:=$(appdir)/$(distbin_basename)
archive?=tar.gz # User defined
dist_target:= # Target defined
dist_basename:= # Target defined
distribution:= # Target defined

all: build

# Run
run: file?=$(srcdir)/env.js
run: env
	$(loadenv)
	$(node) $(file)

# Scratch
scratch:
	$(loadenv)
	$(node) tmp/scratch.js

# Build
build:

# Develop
dev: env
	$(loadenv)
	$(node) $(srcdir)/index.js

# Release
release: distribution:=$(appdir_abs)
release: metafiles:=$(addprefix $(appdir_abs)/,$(metafiles))
release:

# Publish release
publish:

# Deploy
deploy:

# Distribute binary release
package: dist_target:=bin
package: dist_basename:=$(distbin_basename)
package: distribution:=$(distbin)
package: $(distbin).$$(archive)
$(distbin).tar.gz: $(distbin)
	tar --dereference --create --file=- $(distbin) \
	| gzip --to-stdout --best - > $(distbin).tar.gz
$(distbin).zip: $(distbin)
	zip -r - $(distbin) > $(distbin).zip
$(distbin): metafiles:=$(addprefix $(distbin)/, $(metafiles))
$(distbin): build mkdistdir $$(metafiles)

# Distribute source release
dist: dist_target:=src
dist: dist_basename:=$(distsrc_basename)
dist: distribution:=$(distsrc)
dist: $(distsrc).$$(archive)
$(distsrc).tar.gz: $(distsrc)
	@echo make $@
	tar --dereference --create --file=- $(distsrc) \
	| gzip --to-stdout --best - > $(distsrc).tar.gz
$(distsrc).zip: $(distsrc)
	@echo make $@
	zip -r - $(distsrc) > $(distsrc).zip
$(distsrc): metafiles:=$(addprefix $(distsrc)/, $(metafiles))
$(distsrc): mkdistdir $$(metafiles)

mkdistdir:
	-rm -rdf $(distribution)
	mkdir $(distribution)

%/$(releasefile):
	@echo make $@
	cat<<EOF > $@
	VERSION=$(app_version)
	DIST_TARGET=$(dist_target)
	DIST_NAME=$(dist_basename)
	DISTRIBUTER=$(git_author) <$(git_author_email)> $(user)@$(hostname)
	BRANCH=$(git_branch)
	COMMIT=$(git_commit)
	STATUS=$(git_status)
	DATE=$(date)
	EOF

%/$(changelogfile):
	@echo make $@
	cat<<EOF > $@
	changelogfile
	EOF

%/$(readmefile):
	@echo make $@
	cat<<EOF > $@
	readmefile
	EOF

env:
	$(dotenv) $(dotenvflags) $(dotenvdirs) | $(sort) > $(dotenvfile)

env-dry:
	$(dotenv) $(dotenvflags) $(dotenvdirs) | $(sort)

clean:
	-rm -rdf $(buildir)
	-rm -rdf *.tar.gz
	-rm -rdf $(app_name)-v*
	-rm -rdf *.log
	-rm -rdf $(dotenvfile)


distclean: clean
	-rm -rdf node_modules
	-rm -rdf package-lock.json


cleandocker: cleandockerc cleandockerimg

cleandockerimg:

cleandockerc:
	@containers=$$(docker ps --all | grep -i $(app_name) | awk '{ print $$1 }')
	if [[ -n "$$containers" ]]; then
	docker rm $$containers
	fi

test-makefile:
	@echo $(prjdir) $(prjdir_abs)
	echo $(softdir) $(softdir_abs)










help:
	@cat ./Makefile | grep -i --color=auto 'phony' | cut -d ' ' -f2- | tail --lines=+3

.PHONY: help
# General setup of the repository
.PHONY: all /* build application */
# Software development
.PHONY: dev /* develop application*/
.PHONY: run /* read dotenvfile and run any file */
.PHONY: scratch /* read dotenvfile and run the scratch file */
.PHONY: env /* write environment into .env */
.PHONY: env-dry /* print environment */
.PHONY: build /* build application */
# Software distribution
.PHONY: release /* release a new application version */
.PHONY: publish /* publish current release to a cloud VCS */
.PHONY: package /* package a new built and metadata into a form suitable for distribution */
.PHONY: dist /* package the source repo and metadata into a form suitable for distribution */
.PHONY: deploy /* deploy the application to the consumer, such as a server */
# Cleaning
.PHONY: clean /* Remove files created by make build, install, package, dist... */
.PHONY: distclean /* Remove files created by configure */
.PHONY: cleandocker /* Removes docker containers and images */
.PHONY: cleandockerc /* Remove docker containers */
.PHONY: cleandockerimg /* Removes docker images */
# Miscellaenous
.PHONY: test-makefile
