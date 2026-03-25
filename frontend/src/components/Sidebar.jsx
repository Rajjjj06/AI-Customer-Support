import { NavLink, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MessageSquare,
  BarChart3,
  Code2,
  Bot,
  Settings,
} from 'lucide-react';

const mainLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Create Bot', to: '/create-bot', icon: PlusCircle },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const botLinks = [
  { label: 'Documents', to: 'documents', icon: FileText },
  { label: 'Chat Test', to: 'chat', icon: MessageSquare },
  { label: 'Analytics', to: 'analytics', icon: BarChart3 },
  { label: 'Embed', to: 'embed', icon: Code2 },
];

export default function Sidebar() {
  const { id } = useParams();

  return (
    <ScrollArea className="h-full py-4">
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold gradient-text">DocuBot</span>
        </div>

        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        {id && (
          <>
            <Separator className="my-4" />
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Bot Settings
            </p>
            <div className="space-y-1">
              {botLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={`/bot/${id}/${link.to}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
