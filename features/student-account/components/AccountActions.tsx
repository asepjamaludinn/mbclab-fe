"use client";

import Link from "next/link";
import { ChevronRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { GroupMember } from "../types/student-account.type";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { GroupInfoCard } from "./GroupInfoCard";
import { LogoutDialog } from "./LogoutDialog";

type AccountActionsProps = {
  role?: string;
  currentUserNim?: string;
  groupName?: string;
  groupMembers?: GroupMember[];
};

export function AccountActions({
  role,
  currentUserNim,
  groupName,
  groupMembers = [],
}: AccountActionsProps) {
  const dashboardHref =
    role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  const compactCardClassName =
    "overflow-hidden rounded-[28px] border border-white/35 bg-white/20 shadow-[0_18px_45px_-30px_rgba(0,101,176,0.55),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl";
  const itemClassName =
    "group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/20";
  const iconClassName =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/80 text-white shadow-[0_10px_24px_-16px_rgba(0,101,176,0.9)]";
  const chevronClassName =
    "h-4 w-4 shrink-0 text-grey-500 transition group-hover:translate-x-0.5 group-hover:text-primary";
  const dividerClassName = "mx-4 h-px bg-white/30";

  return (
    <section className="space-y-5 px-5 pt-7">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Pengaturan Akun
          </h2>
          <span className="font-secondary text-[11px] font-bold text-white/75">
            Account
          </span>
        </div>

        <div className={compactCardClassName}>
          {/* Dashboard Link */}
          <Link href={dashboardHref} className={itemClassName}>
            <div className="flex min-w-0 items-center gap-3">
              <div className={iconClassName}>
                <LayoutDashboard className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-grey-900">
                  Dashboard
                </h3>
                <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                  Buka aktivitas praktikum
                </p>
              </div>
            </div>
            <ChevronRight className={chevronClassName} />
          </Link>

          <div className={dividerClassName} />

          {/* Change Password Dialog */}
          <ChangePasswordDialog
            itemClassName={itemClassName}
            iconClassName={iconClassName}
            chevronClassName={chevronClassName}
          />

          <div className={dividerClassName} />

          {/* Account Status */}
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className={iconClassName}>
                <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-grey-900">
                  Status Akun
                </h3>
                <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                  Aktif dan terverifikasi
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 font-secondary text-[10px] font-bold text-success">
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Group Info Card */}
      <GroupInfoCard
        groupName={groupName}
        groupMembers={groupMembers}
        currentUserNim={currentUserNim}
        compactCardClassName={compactCardClassName}
        iconClassName={iconClassName}
        dividerClassName={dividerClassName}
      />

      {/* Logout Dialog */}
      <LogoutDialog />
    </section>
  );
}
