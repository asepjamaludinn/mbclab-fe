"use client";

import { UsersRound } from "lucide-react";
import { GroupMember } from "../types/student-account.type";

type GroupInfoCardProps = {
  groupName?: string;
  groupMembers?: GroupMember[];
  currentUserNim?: string;
  compactCardClassName: string;
  iconClassName: string;
  dividerClassName: string;
};

export function GroupInfoCard({
  groupName,
  groupMembers = [],
  currentUserNim,
  compactCardClassName,
  iconClassName,
  dividerClassName,
}: GroupInfoCardProps) {
  return (
    <div className={compactCardClassName}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className={iconClassName}>
          <UsersRound className="h-4.5 w-4.5" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-grey-900">
            {groupName || "Belum Ada Kelompok"}
          </h3>
          <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
            Informasi anggota kelompok
          </p>
        </div>
      </div>

      {groupMembers.length > 0 ? (
        <div>
          {groupMembers.map((member, index) => {
            const isCurrentUser = member.nim === currentUserNim;
            const isLastItem = index === groupMembers.length - 1;

            return (
              <div key={member.id || `${member.name}-${index}`}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-secondary text-xs font-bold text-grey-900">
                      {member.name || "Nama Praktikan"}
                    </p>
                    <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                      {member.nim || "-"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 font-secondary text-[10px] font-bold ${
                      isCurrentUser
                        ? "bg-primary/10 text-primary"
                        : "bg-white/25 text-grey-600"
                    }`}
                  >
                    {isCurrentUser ? "Kamu" : "Anggota"}
                  </span>
                </div>

                {!isLastItem && <div className={dividerClassName} />}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className={dividerClassName} />
          <div className="px-4 py-4">
            <p className="text-center font-secondary text-xs font-semibold text-grey-500">
              Data anggota kelompok belum tersedia.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
