"use client";
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';

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

function getDateString(date: Date) {
  if (isNaN(date.getTime())) {
    // Return today's date if invalid
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

// Date formatter for X axis
const formatDateLabel = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'd/MMM/yy');
  } catch {
    return dateStr;
  }
};

export default function Home() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [tagData, setTagData] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mood-data')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Extract mood data
          const rows: MoodEntry[] = data
            .map((entry: any) => {
              let mood: number | undefined = undefined;
              
              // Try to extract mood from status object first (more reliable)
              if (entry.status?.mood_level && !isNaN(Number(entry.status.mood_level))) {
                mood = parseFloat(entry.status.mood_level);
              } else if (entry.status?.moodLevel && !isNaN(Number(entry.status.moodLevel))) {
                mood = parseFloat(entry.status.moodLevel);
              } else if (entry.mood && typeof entry.mood === 'string' && entry.mood.includes('(')) {
                // Handle cases like "4 (1 to 10)" - extract the number
                const match = entry.mood.match(/(\d+(?:\.\d+)?)/);
                if (match && !isNaN(Number(match[1]))) {
                  mood = parseFloat(match[1]);
                }
              } else if (entry.mood && !isNaN(Number(entry.mood))) {
                // Only try direct mood field if it's a number
                mood = parseFloat(entry.mood);
              }
              
              if (typeof mood === 'number' && mood >= 0 && mood <= 10) {
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
            .filter((d): d is MoodEntry => d !== null && Boolean(d.date) && !isNaN(new Date(d.date).getTime()));

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

          // Set default date range to last 30 days
          if (rows.length > 0) {
            const sortedRows = [...rows].sort((a, b) => a.date.localeCompare(b.date));
            const lastDate = sortedRows[sortedRows.length - 1].date;
            const lastDateObj = new Date(lastDate);
            const firstDateObj = new Date(sortedRows[0].date);
            const startDateObj = new Date(lastDateObj);
            startDateObj.setDate(lastDateObj.getDate() - 30);
            // If the calculated startDate is before the first log, use the first log's date
            const startDateStr = startDateObj < firstDateObj ? sortedRows[0].date : getDateString(startDateObj);
            setStartDate(startDateStr);
            setEndDate(lastDate);
          }
        } else {
          console.error('Mood data API did not return an array:', data);
          setError('Could not load mood data.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching mood data:', err);
        setError('Could not load mood data.');
        setLoading(false);
      });
  }, []);

  // Apply filters and sort by date ascending (oldest first)
  const filteredMoodData = moodData
    .filter((d) => {
      const dateOk = (!startDate || d.date >= startDate) && (!endDate || d.date <= endDate);
      return dateOk;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Quick filter functions
  const setLastDays = (days: number) => {
    if (moodData.length > 0) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      setEndDate(getDateString(end));
      setStartDate(getDateString(start));
    }
  };

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-800 rounded-xl shadow p-6 text-gray-100">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">SAM Analytics</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-end justify-center">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1"
            value={startDate || ''}
            min={moodData[0]?.date}
            max={endDate || moodData[moodData.length - 1]?.date}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1"
            value={endDate || ''}
            min={startDate || moodData[0]?.date}
            max={moodData[moodData.length - 1]?.date}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLastDays(1)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          >
            Last 1 Day
          </button>
          <button
            onClick={() => setLastDays(7)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setLastDays(30)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => {
              if (moodData.length > 0) {
                setStartDate(moodData[0].date);
                setEndDate(moodData[moodData.length - 1].date);
              }
            }}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          >
            Lifetime
          </button>
        </div>
      </div>
      {/* Graphs in requested order */}
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {/* Sleep Duration Chart */}
        <ChartCard title="Sleep Duration (hours)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredMoodData.filter(d => d.sleep_duration)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" tickFormatter={formatDateLabel} />
              <YAxis tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" />
              <Tooltip contentStyle={{ background: '#222', color: '#fff', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} labelFormatter={formatDateLabel} />
              <Line type="monotone" dataKey="sleep_duration" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        {/* Mood Chart */}
        <ChartCard title="Mood Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredMoodData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" tickFormatter={formatDateLabel} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" />
              <Tooltip contentStyle={{ background: '#222', color: '#fff', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} labelFormatter={formatDateLabel} />
              <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        {/* Energy Levels Chart */}
        <ChartCard title="Energy Levels">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredMoodData.filter(d => d.energy_level)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" tickFormatter={formatDateLabel} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" />
              <Tooltip contentStyle={{ background: '#222', color: '#fff', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} labelFormatter={formatDateLabel} />
              <Line type="monotone" dataKey="energy_level" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        {/* Sleep Quality Chart */}
        <ChartCard title="Sleep Quality">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredMoodData.filter(d => d.sleep_quality)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" tickFormatter={formatDateLabel} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 13, fontWeight: 600, fill: '#fff' }} stroke="#fff" />
              <Tooltip contentStyle={{ background: '#222', color: '#fff', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} labelFormatter={formatDateLabel} />
              <Line type="monotone" dataKey="sleep_quality" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
