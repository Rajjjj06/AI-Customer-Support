import FileUpload from "@/components/FileUpload";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Calendar, Zap, Lock } from "lucide-react";
import { useEffect } from "react";
import { useFile } from "../hooks/useFile";
import { useSubscription } from "@/hooks/useSubscription";

export default function DocumentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { files, loading, upload, getAll, remove } = useFile();
  const { plan, limits, isAtLimit, usagePercent } = useSubscription();

  const docLimitReached = isAtLimit('documents', files.length);
  const docUsage = usagePercent('documents', files.length);

  useEffect(() => {
    if (id) getAll(id);
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Upload documents to train your chatbot. Supports PDF, DOCX, and TXT
          files.
        </p>
      </div>
      {/* Document limit usage bar */}
      {limits.documents !== Infinity && (
        <Card className={`border ${docLimitReached ? 'border-destructive/50 bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
          <CardContent className="py-3 px-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Document Usage</p>
                <span className={`text-xs font-bold ${docLimitReached ? 'text-destructive' : 'text-primary'}`}>
                  {files.length} / {limits.documents}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${docLimitReached ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${docUsage}%` }}
                />
              </div>
            </div>
            {docLimitReached && (
              <Button size="sm" onClick={() => navigate('/settings?upgrade=pro')}>
                <Zap className="h-3.5 w-3.5 mr-1" /> Upgrade
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          {docLimitReached ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Lock className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Document limit reached</p>
              <p className="text-xs text-muted-foreground">Your <strong>{plan}</strong> plan allows {limits.documents} documents. Upgrade or delete existing files.</p>
              <Button size="sm" onClick={() => navigate('/settings?upgrade=pro')}>
                <Zap className="h-3.5 w-3.5 mr-1" /> Upgrade Plan
              </Button>
            </div>
          ) : (
          <FileUpload
            upload={async (file, botId) => {
              await upload(file, botId);
              getAll(botId);
            }}
            botId={id}
            loading={loading}
          />
          )}
        </CardContent>
      </Card>
      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Uploaded Documents</CardTitle>
            <Badge variant="secondary">{files.length} files</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((doc) => (
                <div
                  key={doc._id || doc.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {doc.name || doc.filename}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {doc.type ||
                            (doc.filename &&
                              doc.filename.split(".").pop().toUpperCase())}
                        </Badge>
                        <span>
                          {doc.size
                            ? typeof doc.size === "number"
                              ? (doc.size / 1048576).toFixed(1) + " MB"
                              : doc.size
                            : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.uploadedAt ||
                            (doc.createdAt &&
                              new Date(doc.createdAt).toLocaleDateString())}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                        className="text-primary"
                      >
                        View
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => remove(doc._id || doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No documents uploaded yet. Upload files above to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
