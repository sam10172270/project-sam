#!/bin/bash

# Map short keys to full types
declare -A TYPES
TYPES=( ["gen"]="general" ["m"]="mood" ["h"]="health" ["t"]="trauma" ["c"]="creativity" ["w"]="work" ["r"]="routine" ["ref"]="reflection" ["p"]="productivity" ["a"]="automation" )

# Set default type if no type is provided
TYPE="${TYPES[$1]:-general}"  # Default to 'general' if no match
KEY="$2"                      # Passed as argument (e.g., 'Ravi's Mood Log')

# Check if KEY is provided
if [ -z "$KEY" ]; then
  echo "Please provide the KEY (e.g., 'Ravi's Mood Log') as an argument."
  exit 1
fi

# Convert spaces to underscores for filenames
FILENAME="${KEY// /_}.json"

# Create the appropriate folder if it doesn't exist
mkdir -p "System/Logs/$TYPE"

# Generate the log content
cat <<EOF > "System/Logs/$TYPE/$FILENAME"
{
    "date": "$(date +%F)",
    "log_type": "$TYPE",
    "emotions": ["calm", "focused", "positive"],
    "decisions": [
        "Focus on staying grounded",
        "Track emotional progress"
    ],
    "insights": [
        "Daily emotional tracking helps build awareness",
        "Small, consistent actions create long-term change"
    ],
    "actions_taken": [
        "Created a structure for emotional reflection",
        "Committed to daily check-ins"
    ],
    "conversation_tags": ["mood", "emotional health", "awareness"],
    "source": "user-log",
    "notes": "This log reflects the state of mind and emotional well-being for the day, with a focus on tracking mood and setting emotional goals."
}
EOF

# Add the new log to Git
git add "System/Logs/$TYPE/$FILENAME"

# Commit with the message
git commit -m "log: auto-push ($FILENAME)"

# Push to logs-staging branch
git push origin logs-staging

# Confirm push
echo "✅ $FILENAME pushed to logs-staging"
