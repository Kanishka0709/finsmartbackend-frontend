#!/bin/bash
pkill -f "Finsmart_Finances" || true
sleep 2
nohup java -jar /opt/finsmart/Finsmart_Finances-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=$(aws secretsmanager get-secret-value \
    --secret-id finsmart/app-config --query 'SecretString' \
    --output text | jq -r '."spring.datasource.url"') \
  > /opt/finsmart/app.log 2>&1 &
