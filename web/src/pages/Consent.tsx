import { useSearchParams } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export default function Consent() {
  const [params] = useSearchParams();
  const clientId = params.get('client_id') ?? 'Unknown App';
  const scope = params.get('scope') ?? '';
  const scopes = scope.split(' ').filter(Boolean);

  const handleConsent = async (accept: boolean) => {
    await (authClient as any).oauth2.consent({ accept });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Authorize Application</h2>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">{clientId}</span> is requesting access to:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-600 space-y-1">
          {scopes.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <div className="flex gap-3">
          <button
            onClick={() => handleConsent(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Allow
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}
