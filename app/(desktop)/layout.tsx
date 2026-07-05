export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white font-primary">{children}</div>
  );
}
