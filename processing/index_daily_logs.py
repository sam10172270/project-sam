import os
import json

def index_daily_logs():
    daily_dir = os.path.join('logs', 'daily')
    index = []
    count = 0
    for fname in os.listdir(daily_dir):
        if not fname.endswith('.json'):
            continue
        fpath = os.path.join(daily_dir, fname)
        try:
            with open(fpath, 'r') as f:
                data = json.load(f)
        except Exception as e:
            print(f"[WARN] Could not read {fpath}: {e}")
            continue
        entry = {'file_path': fpath}
        # List of all possible fields
        fields = [
            'timestamp', 'summary', 'mood', 'emotion', 'status',
            'insights', 'goals', 'tags', 'trigger_events', 'symptom_checklist',
            'symptomChecklist'  # for alternate spellings
        ]
        for field in fields:
            entry[field] = data.get(field, None)
        # Normalize symptomChecklist/symptom_checklist
        if entry['symptom_checklist'] is None and entry['symptomChecklist'] is not None:
            entry['symptom_checklist'] = entry['symptomChecklist']
        entry.pop('symptomChecklist', None)
        index.append(entry)
        count += 1
    # Save index
    out_path = os.path.join('logs', 'daily_index.json')
    with open(out_path, 'w') as f:
        json.dump(index, f, indent=2)
    print(f"Indexed {count} daily logs. Output: {out_path}")

if __name__ == '__main__':
    index_daily_logs() 