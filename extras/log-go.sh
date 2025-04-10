#!/bin/bash

# === Config ===
LOG_DIR="System"
SUMMARY_FILE="$LOG_DIR/compressed-log-summary.json"
LOG_PATTERN1="2025-03-29-*.json"
LOG_PATTERN2="2025-03-30-*.json"

# Detect current Git branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# === Collect + Compress ===
echo "Compressing logs into summary..."

compressed_data="{\n  \"date_range\": \"2025-03-29 to 2025-03-30\",\n  \"summary_logs\": ["

for file in $LOG_DIR/$LOG_PATTERN1 $LOG_DIR/$LOG_PATTERN2; do
  if [[ -f \"$file\" ]]; then
    content=$(jq 'del(.conversation_tags, .source, .notes) | {source_file: input_filename, emotions, decisions, insights, actions_taken}' \"$file\")
    compressed_data+="\n    $content,"
  fi
  done

# Trim trailing comma + close JSON
compressed_data=${compressed_data%,}
compressed_data+="\n  ]\n}"

echo -e "$compressed_data" > "$SUMMARY_FILE"
echo "✅ Logs compressed to: $SUMMARY_FILE"

# === Clean Raw Logs ===
echo "Deleting original log files..."
find "$LOG_DIR" -name "$LOG_PATTERN1" -delete
find "$LOG_DIR" -name "$LOG_PATTERN2" -delete

echo "🧹 Deleted raw logs."

# === Git Commit ===
echo "Adding to git..."
git add "$SUMMARY_FILE"
git commit -m "Compressed & cleaned logs via log-go"
git push origin "$CURRENT_BRANCH"

echo "🚀 log-go complete. System is clean + pushed to $CURRENT_BRANCH."
