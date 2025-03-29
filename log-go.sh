#!/bin/bash

DATE=$(date +%F)
FILENAME="$DATE.json"
TARGET_PATH="System/Logs/$FILENAME"

mkdir -p System/Logs

# Copy from Downloads to Logs folder
cp ~/Downloads/$FILENAME $TARGET_PATH

# Commit and push to logs-staging
git add $TARGET_PATH
git commit -m "log: auto-push ($DATE)"
git push origin logs-staging

echo "✅ $FILENAME pushed to logs-staging"
