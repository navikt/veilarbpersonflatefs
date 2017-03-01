#!/bin/bash

set -e

declare -a libs=("react"
		 "redux"
		 "redux-thunk"
		 "react-redux"
		)

mkdir -p ../main/webapp/js/

for lib in "${libs[@]}"
do
    echo "Kopierer $lib til ../main/webapp/js/"
    cp ./node_modules/$lib/dist/$lib.js ../main/webapp/js/
done
