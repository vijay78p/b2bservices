#!/bin/sh

YELLOW="\033[33m"
CLOSE="\033[0m"

if [ -z $1 ] || [ "$1" != "c" ] && [ "$1" != "component" ] && [ "$1" != "a" ] && [ "$1" != "alias" ] &&
  [ "$1" != "m" ] && [ "$1" != "module" ] && [ "$1" != "s" ] && [ "$1" != "service" ] && [ "$1" != "sc" ] && [ "$1" != "scene" ]; then
  echo $YELLOW"Please provide a supported resource to generate"$CLOSE
  echo
  echo "Options:"
  echo "    a - alias"
  echo "    c - component"
  echo "    m - module"
  echo "    sc - scene"
  echo "    s - service"
  echo
  exit 0
fi

if [ $1 == "c" ] || [ $1 == "component" ]; then
  node ./tools/scripts/generate-component.js $@
fi

if [ $1 == "a" ] || [ $1 == "alias" ]; then
  node ./tools/scripts/generate-alias.js $@
fi

if [ $1 == "m" ] || [ $1 == "module" ]; then
  node ./tools/scripts/generate-module.js $@
fi

if [ $1 == "s" ] || [ $1 == "service" ]; then
  node ./tools/scripts/generate-service.js
fi

if [ $1 == "sc" ] || [ $1 == "scene" ]; then
  node ./tools/scripts/generate-scene.js
fi
