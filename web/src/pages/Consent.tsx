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
    <div className="page">
      <h2>Authorize Application</h2>
      <p><strong>{clientId}</strong> is requesting access to:</p>
      <ul>
        {scopes.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <div className="buttons">
        <button onClick={() => handleConsent(true)}>Allow</button>
        <button className="secondary" onClick={() => handleConsent(false)}>Deny</button>
      </div>
    </div>
  );
}
