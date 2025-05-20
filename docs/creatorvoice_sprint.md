# 🧠 Project Log: CreatorVoice Studio | XTTS Local Voice Engine
**Log Date:** 2025-04-08 09:30:37
**Mode:** Execution Sprint | Day 1
**Owner:** Ravi
**Core Goal:** Build a local GUI-based voice engine using XTTS, surpassing ElevenLabs in controllable tone and local privacy.

---

## 🔥 Vision Summary:
CreatorVoice Studio will become a local, fast, GUI-powered voice generation system built on open-source TTS models. It will allow Ravi to:
- Host voice generation locally
- Clone his own voice + Suharl's
- Serve clients with zero dependency on paid APIs
- Showcase 10 voices on website
- Collaborate on demo videos with personalized cloned audio

---

## 🖥️ GUI Feature Plan:
- Dropdown: Select speaker identity
- Input: Text area with recent input memory
- Buttons: "Generate", "Play", "Download", "Open Folder"
- Sidebar: Voice info (name, tone, style, clone origin)
- Output: WAV file in local `outputs/` directory

---

## 🔩 Technical Stack:
- Core Model: XTTS (Mantell API variant)
- GUI: Gradio (local, styled)
- Local Run Mode: Python + FastAPI fallback
- Storage: voice_profiles/ folder with metadata.json per voice
- Output: WAV with original file name

---

## 🧱 File Structure Plan:
```
creator_voice_engine/
├── app.py                # Gradio GUI launcher
├── voices/
│   └── ravi/
│       ├── sample1.wav
│       └── metadata.json
├── outputs/
│   └── ravi_01.wav
├── static/
│   └── css/
│       └── theme.css
├── core/
│   └── xtts_interface.py
└── README.md
```

---

## 🤝 Creator Collab Plan:
- Clone Suharl’s voice (record base)
- Script + clone demo for him
- Post video under “ft. CreatorVoice Studio”
- Use as client proof + sample on homepage

---

## ⏳ 7-Day Sprint Goal:
- [ ] Clone Ravi’s voice with 3 styles
- [ ] Launch local Gradio GUI
- [ ] Generate & post 10 voice samples
- [ ] Create 1 client-facing video with voice + script
- [ ] Showcase full system on CreatorVoice.in

---

**Log Type:** Core Build Declaration  
**Save This As:** `creatorvoice_sprint_day1.md`