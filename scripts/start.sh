#!/bin/bash

echo "Starting application..."

nohup java -jar /opt/finsmart/FinSmart_Finances-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
