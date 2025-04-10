import os
import datetime

os.system("git add .")
msg = f"Auto sync on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
os.system(f'git commit -m "{msg}"')
os.system("git push")
print("Memory synced to GitHub.")