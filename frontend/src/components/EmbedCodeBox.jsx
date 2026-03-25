import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Code2 } from 'lucide-react';

export default function EmbedCodeBox({ botId }) {
  const [copied, setCopied] = useState(false);
  const [copiedBtn, setCopiedBtn] = useState(false);

  const widgetUrl = `${import.meta.env.VITE_BACKEND_URL ? window.location.origin : 'https://your-app.vercel.app'}/widget/${botId}`;

  // The iframe that gets embedded in any website
  const iframeCode = `<iframe
  src="${window.location.origin}/widget/${botId}"
  style="position:fixed;bottom:24px;right:24px;width:380px;height:600px;border:none;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);z-index:9999;"
  allow="clipboard-write">
</iframe>`;

  // Optional floating button version
  const floatingCode = `<!-- Floating Chat Button + Widget -->
<button onclick="document.getElementById('cw-${botId}').style.display='block';this.style.display='none'"
  style="position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#2563eb;color:white;border:none;cursor:pointer;font-size:24px;box-shadow:0 10px 20px rgba(37,99,235,0.3);z-index:10000">
  💬
</button>
<iframe id="cw-${botId}"
  src="${window.location.origin}/widget/${botId}"
  style="display:none;position:fixed;bottom:24px;right:24px;width:380px;height:600px;border:none;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);z-index:9999;"
  allow="clipboard-write">
</iframe>`;

  const handleCopy = async (text, setter) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Code2 className="h-5 w-5 text-primary" />
          Embed Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Option 1 - Always Visible iframe */}
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Option 1 — Always Visible Widget</p>
        <div className="relative">
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap">
            <code className="text-foreground">{iframeCode}</code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(iframeCode, setCopied)}
          >
            {copied ? (
              <><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5 mr-1" />Copy</>
            )}
          </Button>
        </div>

        {/* Option 2 - Floating button */}
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Option 2 — Floating Button (Recommended)</p>
        <div className="relative">
          <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap">
            <code className="text-foreground">{floatingCode}</code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(floatingCode, setCopiedBtn)}
          >
            {copiedBtn ? (
              <><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5 mr-1" />Copy</>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">Paste either snippet before the <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag of your website.</p>
      </CardContent>
    </Card>
  );
}
