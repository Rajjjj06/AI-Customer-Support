import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatbotCard from '@/components/ChatbotCard';
import EmptyState from '@/components/EmptyState';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import StatsCard from '@/components/StatsCard';
import { useBots } from '@/hooks/useBots';
import { useSubscription, PLAN_LIMITS } from '@/hooks/useSubscription';
import { PlusCircle, Bot, MessageSquare, FileText, Zap, Lock } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { bots, loading, getAll, remove } = useBots();
  const { plan, limits, isAtLimit, usagePercent, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => { getAll(); }, [getAll]);

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toast.success('Chatbot deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chatbot');
    }
  };

  const handleCreateBot = () => {
    if (isAtLimit('chatbots', bots.length)) {
      toast.error(`Your ${plan} plan allows max ${limits.chatbots} chatbot(s). Upgrade in Settings!`);
      return;
    }
    navigate('/create-bot');
  };

  if (loading && bots.length === 0) return <DashboardSkeleton />;

  const botLimitReached = isAtLimit('chatbots', bots.length);
  const botUsage = usagePercent('chatbots', bots.length);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Chatbots" value={`${bots.length}${limits.chatbots !== Infinity ? ` / ${limits.chatbots}` : ''}`} icon={Bot} />
        <StatsCard title="Plan" value={PLAN_LIMITS[plan]?.label || 'Starter'} icon={Zap} />
        <StatsCard title="Total Conversations" value={0} icon={MessageSquare} />
        <StatsCard title="Documents" value={`${limits.documents !== Infinity ? limits.documents + ' max' : 'Unlimited'}`} icon={FileText} />
      </div>

      {/* Usage Bar (only for non-enterprise) */}
      {limits.chatbots !== Infinity && (
        <Card className={`border ${botLimitReached ? 'border-destructive/50 bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
          <CardContent className="py-3 px-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Chatbot Usage</p>
                <span className={`text-xs font-bold ${botLimitReached ? 'text-destructive' : 'text-primary'}`}>
                  {bots.length} / {limits.chatbots}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${botLimitReached ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${botUsage}%` }}
                />
              </div>
            </div>
            {botLimitReached && (
              <Button size="sm" onClick={() => navigate('/settings?upgrade=pro')}>
                <Zap className="h-3.5 w-3.5 mr-1" /> Upgrade
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Chatbots</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor your AI chatbots</p>
        </div>
        <Button
          onClick={handleCreateBot}
          className="group"
          variant={botLimitReached ? 'outline' : 'default'}
          disabled={subLoading}
        >
          {botLimitReached ? (
            <><Lock className="h-4 w-4 mr-2" /> Limit Reached</>
          ) : (
            <><PlusCircle className="h-4 w-4 mr-2" /> Create Chatbot</>
          )}
        </Button>
      </div>

      {/* Chatbot Grid */}
      {bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <ChatbotCard key={bot._id} bot={bot} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bot}
          title="No chatbots yet"
          description="Create your first AI chatbot to get started. Upload documents and let AI handle customer queries."
          action="Create Chatbot"
          onAction={handleCreateBot}
        />
      )}
    </div>
  );
}
