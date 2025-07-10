import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'logs', 'daily_index.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(file);
    
    // Process data to include additional fields
    const processedData = data.map((entry: any) => {
      const processed = {
        ...entry,
        // Extract sleep data
        sleep_quality: entry.status?.sleep_quality || entry.status?.sleepQuality,
        sleep_duration: entry.status?.sleep_duration || entry.status?.sleepDuration,
        energy_level: entry.status?.energy_level || entry.status?.energyLevel,
        stability_score: entry.status?.stability_score || entry.status?.stabilityScore,
      };
      return processed;
    });
    
    return NextResponse.json(processedData);
  } catch (e) {
    return NextResponse.json({ error: 'Could not load mood data.' }, { status: 500 });
  }
} 