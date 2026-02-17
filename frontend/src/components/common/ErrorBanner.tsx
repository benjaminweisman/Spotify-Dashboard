export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner">
      <p>{message}</p>
    </div>
  );
}
