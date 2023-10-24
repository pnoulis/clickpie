#!/usr/bin/make

# Package
pkg_name:=clickpie

# Make configuration
SHELL:=/usr/bin/bash
.SHELLFLAGS:=-eu -o pipefail -c
.DEFAULT_GOAL:=all
.DELETE_ON_ERROR:
.ONESHELL:
.EXPORT_ALL_VARIABLES:
.SECONDEXPANSION:

# Directories
pkgdir:=.
pkgdir_abs:=$(realpath $(appdir))

# Tools and configurations
rclone:=/usr/bin/rclone
rclone_gdrive:=gdrive
rclone_ignore:=.rcloneignore
rclone_conf:=$(pkgdir)/tools/rclone/rclone.conf

all: pull-cloud pull-git
	@echo No target

pull-git:
	@echo $@

push-git:
	@echo $@

push-cloud:
	@$(rclone) copy \
	--config=$(rclone_conf) \
	--update \
	--progress \
	--exclude-from=$(rclone_ignore) \
	$(pkgdir) '$(rclone_gdrive):$(pkg_name)'

pull-cloud:
	@$(rclone) copy \
	--config=$(rclone_conf) \
	--update \
	--progress \
	'$(rclone_gdrive):$(pkg_name)' $(pkgdir)

.PHONY: push-cloud pull-cloud push-git pull-git all
