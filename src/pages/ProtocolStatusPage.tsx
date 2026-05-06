import React, { useEffect, useState } from 'react';

export const ProtocolStatusPage = () => {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const endpoints = ['/protocol-status', '/api/status'];
      let lastError = null;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
          });
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            throw new Error(`Endpoint ${url} returned HTML instead of JSON. Server routing issue.`);
          }

          if (!response.ok) throw new Error(`HTTP ${response.status} at ${url}`);
          
          const data = await response.json();
          setStatus(data);
          setError(null);
          return; // Success
        } catch (err: any) {
          console.warn(`Failed to fetch from ${url}:`, err.message);
          lastError = err.message;
        }
      }
      setError(lastError);
      setLoading(false);
    };

    fetchStatus().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 md:px-16 bg-background selection:bg-accent selection:text-black">
      <div className="max-w-4xl mx-auto border border-white/10 p-8 bg-white/5 backdrop-blur-md">
        <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-8 border-b border-white/10 pb-4">
          [UPLINK] PROTOCOL STATUS CHECK
        </h1>

        {loading && (
          <div className="font-mono text-xs text-neutral-500 animate-pulse">
            Establishing handshake...
          </div>
        )}

        {error && (
          <div className="font-mono text-xs text-red-500 border border-red-500/20 p-4 bg-red-500/5">
            CRITICAL FAILURE: {error}
            <br />
            <br />
            <span className="text-neutral-500">The protocol check failed to reach the uplink server. Verify connectivity or check server logs.</span>
          </div>
        )}

        {status && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-1">Status</span>
                <span className={`font-mono text-sm uppercase ${status.active ? 'text-green-500' : 'text-red-500'}`}>
                  {status.active ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-1">Node</span>
                <span className="font-mono text-sm uppercase text-white">{status.node}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-1">Environment</span>
                <span className="font-mono text-sm uppercase text-white">{status.env}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-1">Last Sync</span>
                <span className="font-mono text-sm uppercase text-white">{new Date(status.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="font-mono text-[10px] text-neutral-500 uppercase block mb-4">Transmission Trace</span>
              <pre className="font-mono text-[10px] text-neutral-400 bg-black p-4 overflow-x-auto">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-neutral-600 font-mono text-[8px] tracking-widest uppercase">
          End of transmission // Quettrix Protocol System v1.0.5
        </div>
      </div>
    </div>
  );
};
