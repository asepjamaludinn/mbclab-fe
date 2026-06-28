type MobileAppShellProps = {
  children: React.ReactNode;
};

export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white shadow-sm">
      {children}
    </div>
  );
}
