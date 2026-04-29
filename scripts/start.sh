#!/bin/bash

echo "Stopping old app..."
pkill -f Finsmart_Finances || true
sleep 3

echo "Starting new app..."

cd /opt/finsmart

nohup java -jar Finsmart_Finances-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
