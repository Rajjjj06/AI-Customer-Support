import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Trash2, Building2 } from 'lucide-react';

export default function ChatbotCard({ bot, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{bot.name}</CardTitle>
          <Badge variant="success" className="text-xs">Active</Badge>
        </div>
        {bot.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>{bot.companyName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          onClick={() => navigate(`/bot/${bot._id}/documents`)}
        >
          Manage Bot
        </Button>
        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            onClick={() => onDelete(bot._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
