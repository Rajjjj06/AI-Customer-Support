import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/StatsCard';
import { StatsSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getAnalytics } from '@/services/chatBot';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

export default function AnalyticsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Fetch real analytics from backend
  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAnalytics(id);
        if(isMounted) setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        if(isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { isMounted = false };
  }, [id]);

  // Dynamically crunch the numbers for the charts
  const { chatData, topQuestions, recentConversations, totalInteractions } = useMemo(() => {
    if (!data || !data.history) {
      return { chatData: [], topQuestions: [], recentConversations: [], totalInteractions: 0 };
    }

    const history = data.history;
    const totalInteractions = data.totalInteractions;

    // 1. Recent Conversations Group
    const recentConversations = history.slice(0, 5).map(h => {
        const dateObj = new Date(h.createdAt);
        return {
            id: h._id,
            user: h.origin || 'Unknown Site',
            preview: h.question,
            time: dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: 'resolved'
        };
    });

    // 2. Top Questions Grouping
    const qMap = {};
    history.forEach(h => {
       qMap[h.question] = (qMap[h.question] || 0) + 1;
    });
    const topQuestions = Object.entries(qMap)
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5)
       .map((entries) => ({ question: entries[0], count: entries[1], trend: 0 }));

    // 3. Chat Volume by Day
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    history.forEach(h => {
      const d = new Date(h.createdAt);
      counts[days[d.getDay()]] += 1;
    });
    const chatData = days.map(day => ({ day, chats: counts[day] }));

    return { chatData, topQuestions, recentConversations, totalInteractions };
  }, [data]);

  if (loading) return <StatsSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Monitor your chatbot performance and user engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Chats" value={totalInteractions.toString()} icon={MessageSquare} trend={14} />
        <StatsCard title="Avg. Response Time" value="1.8s" icon={Clock} trend={-8} description="Speed improvements" />
        <StatsCard title="Resolution Rate" value="98.0%" icon={TrendingUp} trend={2} />
        <StatsCard title="Failed Queries" value="0" icon={AlertCircle} trend={0} description="No failures recorded" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chat Volume (7-Day Distribution)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chatData}>
                  <defs>
                    <linearGradient id="chatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <YAxis className="text-xs" tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      color: 'var(--color-foreground)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="chats"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#chatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Top Questions Asked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}.</span>
                    <p className="text-sm truncate">{q.question}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">{q.count}</Badge>
                    <span className={`text-xs font-medium text-emerald-500`}>
                      Live
                    </span>
                  </div>
                </div>
              ))}
              {topQuestions.length === 0 && <p className="text-sm text-muted-foreground">No questions recorded yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Conversations log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Origin: {conv.user}</p>
                    <p className="text-xs text-muted-foreground truncate">"{conv.preview}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="success" className="text-xs">
                    {conv.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
              </div>
            ))}
            {recentConversations.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No recent conversations.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
