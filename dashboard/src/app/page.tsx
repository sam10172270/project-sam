"use client";
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

interface MoodEntry {
  date: string;
  mood: number;
  sleep_quality?: number;
  sleep_duration?: number;
  energy_level?: number;
  stability_score?: number;
}

interface TagCount {
  tag: string;
  count: number;
}

export default function Home() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [tagData, setTagData] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mood-data')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Extract mood data
          const rows: MoodEntry[] = data
            .map((entry: any) => {
              let mood: number | undefined = undefined;
              if (entry.mood && !isNaN(Number(entry.mood))) {
                mood = parseFloat(entry.mood);
              } else if (entry.status?.mood_level && !isNaN(Number(entry.status.mood_level))) {
                mood = parseFloat(entry.status.mood_level);
              } else if (entry.status?.moodLevel && !isNaN(Number(entry.status.moodLevel))) {
                mood = parseFloat(entry.status.moodLevel);
              }
              if (typeof mood === 'number') {
                return {
                  date: entry.timestamp ? entry.timestamp.slice(0, 10) : '',
                  mood: mood,
                  sleep_quality: entry.sleep_quality ? parseFloat(entry.sleep_quality) : undefined,
                  sleep_duration: entry.sleep_duration ? parseFloat(entry.sleep_duration) : undefined,
                  energy_level: entry.energy_level ? parseFloat(entry.energy_level) : undefined,
                  stability_score: entry.stability_score ? parseFloat(entry.stability_score) : undefined,
                } as MoodEntry;
              }
              return null;
            })
            .filter((d): d is MoodEntry => d !== null && Boolean(d.date));

          // Extract tag data
          const tagCounts: { [key: string]: number } = {};
          data.forEach((entry: any) => {
            if (entry.tags && Array.isArray(entry.tags)) {
              entry.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          });
          const tagRows: TagCount[] = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 tags

          setMoodData(rows);
          setTagData(tagRows);
          setError(null);
        } else {
          setError('Could not load mood data.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load mood data.');
        setLoading(false);
      });
  }, []);

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Mood Chart */}
        <ChartCard title="Mood Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sleep Quality Chart */}
        <ChartCard title="Sleep Quality">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData.filter(d => d.sleep_quality)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sleep_quality" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Energy Levels Chart */}
        <ChartCard title="Energy Levels">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData.filter(d => d.energy_level)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="energy_level" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tags Analysis */}
        <ChartCard title="Most Common Tags">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tagData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tag" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
