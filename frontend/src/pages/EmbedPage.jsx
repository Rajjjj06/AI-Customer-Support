import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmbedCodeBox from '@/components/EmbedCodeBox';
import { Code2, Globe, Palette, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function EmbedPage() {
  const { id } = useParams();

  const instructions = [
    { step: 1, title: 'Copy the embed code', description: 'Click the copy button above to copy the script tag to your clipboard.' },
    { step: 2, title: 'Paste into your website', description: 'Add the script tag just before the closing </body> tag on any page where you want the chatbot.' },
    { step: 3, title: 'Customize appearance', description: 'The widget will automatically match your website\'s style. You can customize colors via the dashboard.' },
    { step: 4, title: 'Start chatting', description: 'Your chatbot is now live! Visitors can click the chat icon to start a conversation.' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Embed Chatbot</h1>
        <p className="text-sm text-muted-foreground">
          Add your AI chatbot to any website with a single line of code
        </p>
      </div>

      {/* Embed Code */}
      <EmbedCodeBox botId={id} />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Integration Guide
          </CardTitle>
          <CardDescription>Follow these steps to add the chatbot to your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {instructions.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Widget Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Globe, label: 'Works on any website', description: 'HTML, WordPress, Shopify, and more' },
              { icon: Palette, label: 'Customizable design', description: 'Match your brand colors and style' },
              { icon: MessageSquare, label: 'Real-time chat', description: 'Instant AI-powered responses' },
              { icon: CheckCircle2, label: 'Mobile responsive', description: 'Works perfectly on all devices' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
