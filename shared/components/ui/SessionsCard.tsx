"use client";

import { useState } from "react";
import { Laptop, Smartphone, LogOut, ShieldAlert } from "lucide-react";
import {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/features/auth/hooks/use-sessions";
import { UserSession } from "@/features/auth/types/auth.type";
import { parseDeviceLabel } from "@/shared/utils/user-agent";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";

export function SessionsCard() {
  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: revoke, isPending: isRevoking } = useRevokeSession();
  const { mutate: revokeOthers, isPending: isRevokingOthers } =
    useRevokeOtherSessions();

  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);
  const [revokingSession, setRevokingSession] = useState<UserSession | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="h-40 w-full animate-pulse rounded-[28px] bg-white/40 backdrop-blur-md" />
    );
  }

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  const handleConfirmRevokeOne = () => {
    if (!revokingSession) return;
    revoke(revokingSession.id, {
      onSuccess: () => setRevokingSession(null),
    });
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/50 bg-white/60 shadow-sm backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-grey-900">Perangkat Aktif</h3>
          <p className="mt-0.5 font-secondary text-xs text-grey-500">
            Kelola sesi login di perangkat lain.
          </p>
        </div>
        {otherSessionsCount > 0 && (
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3 text-xs"
            onClick={() => setConfirmRevokeAll(true)}
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Keluar dari perangkat lain
          </Button>
        )}
      </div>

      <div className="divide-y divide-white/40">
        {sessions.map((s) => {
          const isMobile = /Mobile|Android|iPhone/i.test(s.userAgent || "");
          const Icon = isMobile ? Smartphone : Laptop;

          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-grey-900">
                    {parseDeviceLabel(s.userAgent)}
                    {s.isCurrent && (
                      <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                        Perangkat ini
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                    {s.ipAddress || "IP tidak diketahui"} • terakhir aktif{" "}
                    {new Date(s.lastUsedAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {!s.isCurrent && (
                <button
                  onClick={() => setRevokingSession(s)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-grey-400 transition hover:bg-error/10 hover:text-error"
                  aria-label="Keluarkan sesi ini"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.8} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Konfirmasi revoke satu sesi */}
      <Dialog
        open={!!revokingSession}
        onOpenChange={(open) => !open && setRevokingSession(null)}
      >
        <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6">
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-lg">
              <ShieldAlert className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Keluarkan Perangkat Ini?</DialogTitle>
            <DialogDescription>
              {revokingSession && (
                <>
                  Sesi{" "}
                  <span className="font-semibold text-grey-700">
                    {parseDeviceLabel(revokingSession.userAgent)}
                  </span>{" "}
                  ({revokingSession.ipAddress || "IP tidak diketahui"}) akan
                  langsung logout dari perangkat tersebut.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="danger"
              disabled={isRevoking}
              onClick={handleConfirmRevokeOne}
              className="w-full sm:w-auto"
            >
              {isRevoking ? "Memproses..." : "Ya, Keluarkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi revoke semua sesi lain */}
      <Dialog open={confirmRevokeAll} onOpenChange={setConfirmRevokeAll}>
        <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6">
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-lg">
              <ShieldAlert className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Keluar dari Semua Perangkat Lain?</DialogTitle>
            <DialogDescription>
              {otherSessionsCount} sesi lain akan diakhiri. Perangkat ini tidak
              terpengaruh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="danger"
              disabled={isRevokingOthers}
              onClick={() =>
                revokeOthers(undefined, {
                  onSuccess: () => setConfirmRevokeAll(false),
                })
              }
              className="w-full sm:w-auto"
            >
              {isRevokingOthers ? "Memproses..." : "Ya, Keluarkan Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
