#!/bin/bash

echo "Stopping old app..."
pkill -f 'java -jar' || true

echo "Starting new app..."
nohup java -jar /opt/finsmart/*.jar > /opt/finsmart/app.log 2>&1 &
