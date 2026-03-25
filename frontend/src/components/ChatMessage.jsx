import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isAI = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isAI ? '' : 'flex-row-reverse'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        {isAI ? (
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isAI
            ? 'bg-card border text-card-foreground rounded-bl-md'
            : 'bg-primary text-primary-foreground rounded-br-md'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
