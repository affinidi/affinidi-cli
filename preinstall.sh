#!/bin/bash

output=$(affinidi --version)
mode="update"
npm_config_global=$(npm config get global)
if [ $npm_config_global = true ]; then
    if [[ $output =~ "command not found" ]]; then
        echo "Install"
        mode="install" 
    fi
fi

echo "$mode" >> installaionMode.txt
