export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Admin Test Page</h1>
      <p>If you see this, routing works!</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}
