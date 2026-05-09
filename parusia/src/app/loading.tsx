export default function Loading() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-4 px-4 py-8 sm:px-6">
      <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </main>
  );
}
