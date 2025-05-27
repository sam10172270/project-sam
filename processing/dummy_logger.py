import json
from datetime import datetime

def log_dummy_entries():
    """
    Creates and logs 5 dummy entries with timestamps and text.
    Each entry follows the format: {"timestamp": "ISO timestamp", "text": "entry text"}
    """
    entries = [
        {
            "timestamp": datetime.utcnow().isoformat(),
            "text": "First dummy entry - System initialization"
        },
        {
            "timestamp": datetime.utcnow().isoformat(),
            "text": "Second dummy entry - Processing started"
        },
        {
            "timestamp": datetime.utcnow().isoformat(),
            "text": "Third dummy entry - Data validation complete"
        },
        {
            "timestamp": datetime.utcnow().isoformat(),
            "text": "Fourth dummy entry - Results compiled"
        },
        {
            "timestamp": datetime.utcnow().isoformat(),
            "text": "Fifth dummy entry - Process completed"
        }
    ]
    
    # Save to log file (append mode)
    with open("log.jsonl", "a") as f:
        for entry in entries:
            f.write(json.dumps(entry) + "\n")
            print(f"Logged: {entry}")

if __name__ == "__main__":
    log_dummy_entries() 