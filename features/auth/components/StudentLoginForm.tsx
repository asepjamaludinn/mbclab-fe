"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-auth";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export function StudentLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: login,
    isPending,
    error,
  } = useLogin({ expectedRole: "STUDENT" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-52 w-52 -translate-x-1/2 rounded-full bg-white/60 blur-[70px]" />

      <section className="relative z-10 px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <div className="mt-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
            <Image
              src="/images/logo_utama.svg"
              alt="Logo MBC Laboratory"
              width={56}
              height={56}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            MBCLAB Portal
          </p>

          <h1 className="mt-2 max-w-sm text-[38px] font-extrabold leading-[1.02] tracking-tight text-grey-900">
            Login Praktikan
          </h1>

          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-grey-600">
            Masuk menggunakan NIM dan password untuk mengakses dashboard
            praktikum.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-8 px-5">
        <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 p-5 shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/15 blur-[80px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-primary/10" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 space-y-5"
          >
            <div>
              <label className="mb-2 block font-secondary text-sm font-bold text-grey-900">
                NIM
              </label>

              <Input
                {...register("nim")}
                type="text"
                placeholder="Masukkan NIM Anda"
                icon={<UserIcon className="h-5 w-5 text-secondary" />}
                className="border-white/70 bg-white/80 text-grey-900 placeholder:text-grey-400 backdrop-blur-xl"
              />

              {errors.nim && (
                <span className="mt-2 block font-secondary text-sm text-error">
                  {errors.nim.message}
                </span>
              )}
            </div>

            <div>
              <label className="mb-2 block font-secondary text-sm font-bold text-grey-900">
                Password
              </label>

              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="h-5 w-5 text-secondary" />}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className="border-white/70 bg-white/80 pr-12 text-grey-900 placeholder:text-grey-400 backdrop-blur-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-500 transition hover:text-primary"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="mt-2 block font-secondary text-sm text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {error && (
              <div className="rounded-[22px] border border-error/10 bg-error/10 p-4 text-center font-secondary text-sm font-semibold text-error">
                {error.message || "NIM atau Password salah."}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="group mt-6 flex w-full items-center justify-between rounded-[22px] px-5 py-4 font-secondary text-sm font-bold"
            >
              <span>{isPending ? "Memproses..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>

        <p className="mx-auto mt-5 max-w-xs text-center font-secondary text-xs leading-relaxed text-grey-500">
          Jika mengalami kendala login, hubungi asisten praktikum atau admin
          MBCLAB.
        </p>
      </section>
    </main>
  );
}
