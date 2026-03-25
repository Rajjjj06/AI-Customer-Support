import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowLeft, Loader2, Lock, Zap } from 'lucide-react';
import { useBots } from '@/hooks/useBots';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export default function CreateBotPage() {
  const navigate = useNavigate();
  const { bots, createBot, loading, getAll } = useBots();
  const { plan, limits, isAtLimit } = useSubscription();
  const [form, setForm] = useState({ name: '', company: '', description: '' });

  const atLimit = isAtLimit('chatbots', bots.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBot({
        name: form.name,
        companyName: form.company,
        description: form.description,
      });
      toast.success('Chatbot created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create chatbot');
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isValid = form.name.trim() && form.company.trim() && !atLimit;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Create New Chatbot</CardTitle>
              <CardDescription>Set up a new AI chatbot for your organization</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Plan limit banner */}
          {atLimit && (
            <div className="flex items-center gap-3 p-4 mb-4 rounded-xl border border-destructive/40 bg-destructive/5">
              <Lock className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Chatbot limit reached</p>
                <p className="text-xs text-muted-foreground">Your <strong>{plan}</strong> plan allows {limits.chatbots} chatbot(s). Upgrade to create more.</p>
              </div>
              <Button size="sm" onClick={() => navigate('/settings?upgrade=pro')}>
                <Zap className="h-3.5 w-3.5 mr-1" /> Upgrade
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Name *</Label>
              <Input
                id="bot-name"
                placeholder="e.g. Customer Support Bot"
                value={form.name}
                onChange={handleChange('name')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={handleChange('company')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this chatbot will be used for..."
                value={form.description}
                onChange={handleChange('description')}
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Create Chatbot
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
