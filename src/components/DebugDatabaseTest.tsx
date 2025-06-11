import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface TestResult {
  table: string;
  operation: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
}

const DebugDatabaseTest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (table: string, operation: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.table === table && r.operation === operation);
      const newResult = { table, operation, status, message, data };
      
      if (existing) {
        return prev.map(r => r.table === table && r.operation === operation ? newResult : r);
      } else {
        return [...prev, newResult];
      }
    });
  };

  const testTableAccess = async (tableName: string) => {
    // Test SELECT
    updateResult(tableName, 'SELECT', 'loading', 'Testing...');
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1);
      
      if (error) {
        updateResult(tableName, 'SELECT', 'error', error.message);
        console.error(`${tableName} SELECT error:`, error);
      } else {
        updateResult(tableName, 'SELECT', 'success', `Success - ${data?.length || 0} rows`, data);
        console.log(`${tableName} SELECT success:`, data);
      }
    } catch (err) {
      updateResult(tableName, 'SELECT', 'error', `Unexpected error: ${err}`);
      console.error(`${tableName} SELECT unexpected error:`, err);
    }

    // Test COUNT (different permission level)
    updateResult(tableName, 'COUNT', 'loading', 'Testing...');
    try {
      const { count, error } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        updateResult(tableName, 'COUNT', 'error', error.message);
        console.error(`${tableName} COUNT error:`, error);
      } else {
        updateResult(tableName, 'COUNT', 'success', `Success - ${count} total rows`);
        console.log(`${tableName} COUNT success:`, count);
      }
    } catch (err) {
      updateResult(tableName, 'COUNT', 'error', `Unexpected error: ${err}`);
      console.error(`${tableName} COUNT unexpected error:`, err);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    console.log('Starting database tests...');
    
    // Test critical music tables
    const tables = [
      'Track',
      'Album', 
      'Playlist',
      '_PlaylistTracks',
      '_LikedTracks',
      '_LikedAlbums',
      '_LikedPlaylists',
      'Follow',
      'ArtistProfile',
      'Genre'
    ];

    for (const table of tables) {
      await testTableAccess(table);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    console.log('Database tests completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'loading':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      loading: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status]} className="ml-2">
        {status}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection Test
          <Button onClick={runTests} disabled={isRunning} size="sm">
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 && !isRunning && (
          <p className="text-slate-600">Click "Run Tests" to check database table permissions</p>
        )}
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{result.table}</span>
                  <code className="text-sm bg-slate-100 px-2 py-1 rounded">{result.operation}</code>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-sm text-slate-600 mt-1">{result.message}</p>
                {result.data && result.status === 'success' && (
                  <details className="mt-2">
                    <summary className="text-xs text-slate-500 cursor-pointer">Show data</summary>
                    <pre className="text-xs bg-slate-50 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-2">Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">
                  ✓ {results.filter(r => r.status === 'success').length} Successful
                </span>
              </div>
              <div>
                <span className="text-red-600 font-medium">
                  ✗ {results.filter(r => r.status === 'error').length} Failed
                </span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">
                  ◐ {results.filter(r => r.status === 'loading').length} Running
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugDatabaseTest;
