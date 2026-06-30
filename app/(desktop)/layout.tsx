export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-grey-50">
      <main className="w-full">{children}</main>
    </div>
  );
}
