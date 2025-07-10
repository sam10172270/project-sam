import streamlit as st
import json
import pandas as pd
from datetime import datetime

# Load the index
with open('logs/daily_index.json') as f:
    data = json.load(f)

# Extract date, mood, tags, summary
def extract_mood(entry):
    # Try to get mood from different places
    mood = None
    if entry.get('mood'):
        try:
            mood = float(entry['mood'])
        except:
            pass
    elif entry.get('status') and entry['status'].get('mood_level'):
        try:
            mood = float(entry['status']['mood_level'])
        except:
            pass
    elif entry.get('status') and entry['status'].get('moodLevel'):
        try:
            mood = float(entry['status']['moodLevel'])
        except:
            pass
    return mood

def extract_date(entry):
    ts = entry.get('timestamp', '')
    if ts:
        try:
            return ts[:10]
        except:
            return ''
    return ''

rows = []
for entry in data:
    date = extract_date(entry)
    mood = extract_mood(entry)
    tags = ', '.join(entry.get('tags', []) or [])
    summary = entry.get('summary', '')
    if date and mood is not None:
        rows.append({'date': date, 'mood': mood, 'tags': tags, 'summary': summary})

df = pd.DataFrame(rows)
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df = df.dropna(subset=['date', 'mood'])
df = df.sort_values('date')

st.title('Mood Over Time Dashboard')

# Date range filter
min_date = df['date'].min()
max_date = df['date'].max()
date_range = st.date_input('Select date range', [min_date, max_date])

if len(date_range) == 2:
    start, end = date_range
    mask = (df['date'] >= pd.to_datetime(start)) & (df['date'] <= pd.to_datetime(end))
    df = df[mask]

st.line_chart(df.set_index('date')['mood'])

st.subheader('Daily Log Details')
st.dataframe(df[['date', 'mood', 'tags', 'summary']].reset_index(drop=True)) 