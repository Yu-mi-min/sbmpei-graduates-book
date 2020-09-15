#!/bin/bash

# date    : 6 Sep 2020
# author  : Mikhail Pashkov <workpashkovmikhail@gmail.com>
# desc    : Script generates sbmpei graduates book html site to build directory

# constants ===============================================

VENV_NAME="venv"
REQ_FILE_NAME="req.txt"

RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
BLUE='\033[0;94m'
NC='\033[0m' # No Color

SHOW_PY_LOG=false
SKIP_PY_INSTALL=false

# functions ===============================================

function header() {
  echo -e "\n * ${CYAN}${1}${NC} *\n"
}

function error() {
  echo -e "${RED}${1}${NC}" >&2
}

function warn() {
  echo -e "${YELLOW}${1}${NC}"
}

function info() {
  echo -e "${BLUE}${1}${NC}"
}

function create_and_activate_venv() {
  if [ -d "./$VENV_NAME" ]; then
    info "$VENV_NAME folder exists"
    info "trying to activate $VENV_NAME"
    # shellcheck disable=SC1090
    if source "$VENV_NAME/bin/activate"; then
      info "$VENV_NAME successfully activated"
      info "VIRTUAL_ENV = $VIRTUAL_ENV"
    else
      error "Failure. Abort"
      exit 1
    fi
  else
    info "$VENV_NAME folder does not exists"
    info "run python -m venv $VENV_NAME"

    if python -m venv $VENV_NAME; then
      info "$VENV_NAME successfully created"
      info "VIRTUAL_ENV = $VIRTUAL_ENV"
    else
      error "virtual environment creation failure. Abort"
      exit 1
    fi
  fi
}

function install_python_requirements() {
  if [ -f "$REQ_FILE_NAME" ]; then
    info "$REQ_FILE_NAME exists"
    info "trying to install requirements"

    if [ $SHOW_PY_LOG = true ]; then
      warn "pip log will be shown. Clear -v or --verbose parameter for hiding"
      arg=""
    else
      warn "pip log will be hidden. Use -v or --verbose parameter for showing"
      arg="-q"
    fi

    if pip install $arg -U pip && pip install $arg -r $REQ_FILE_NAME; then
      info "python requirements successfully installed"
    else
      error "python requirements failure. Abort"
      exit 1
    fi
  else
    error "can't find requirements file ($REQ_FILE_NAME). Abort"
    exit 1
  fi
}

# arg parse ===============================================

while (("$#")); do
  case "$1" in
  -v | --verbose)
    SHOW_PY_LOG=true
    shift
    ;;
  -s | --skip-pip)
    SKIP_PY_INSTALL=true
    shift
    ;;
  -* | --*=)
    error "unsupported flag $1"
    exit 1
    ;;
  esac
done

# script ==================================================

header "Activate virtual environment"

if [ -z "$VIRTUAL_ENV" ]; then
  warn "Already in the virtual environment. Deactivating"
  if deactivate; then
    info "successfully deactivated"
  else
    warn "can't run 'deactivate'"
  fi
fi

create_and_activate_venv

header "Install python requirements"

if [ "$SKIP_PY_INSTALL" = false ]; then
  install_python_requirements
else
  warn "Python requirements installation will be skipped"
fi

header "Clear"

info "Clear build directory"

if ls build; then
  rm build/* -vr
else
  warn "build dir does not exists"
  mkdir build
  info "build dir created"
fi

header "Generate index.html and names_mapping.json"

if python build.py > build/index.html; then
  info "index.html generated in build directory"
  info "names_mapping.json generated in root directory"
  info "move names_mapping.json to build directory"
  mv names_mapping.json build/
else
  error "failed to generate index.html and/or names_mapping.json"
  exit 1
fi

header "Copy static files to build directory"

info "Create build/static dir"
mkdir build/static

info "copy files:"
cp graduates/static/* build/static -v

header "Done"
