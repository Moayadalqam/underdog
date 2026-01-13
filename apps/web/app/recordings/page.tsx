// ===========================================
// Recordings Page (Stream 5)
// ===========================================
// Owner: Stream 5 (Call Recordings)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RecordingsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Recordings</h1>
          <p className="mt-2 text-muted-foreground">
            Upload and analyze your sales calls
          </p>
        </div>
        <Button>Upload Recording</Button>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-lg font-semibold">Upload a call recording</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop an audio file or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supported formats: MP3, WAV, M4A (max 100MB)
            </p>
            <Button variant="outline" className="mt-4">
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Recordings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recordings</CardTitle>
          <CardDescription>Previously uploaded calls and their analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recordings yet. Upload a call to get AI-powered feedback!
          </p>
        </CardContent>
      </Card>

      {/* TODO: Implement file upload and audio player */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">
          Recording upload, transcription, and analysis will be implemented by Stream 5
        </p>
      </div>
    </main>
  );
}
