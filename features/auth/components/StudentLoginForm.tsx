"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  LogIn,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-auth";
import { Input } from "@/shared/components/ui/input";

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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <section className="relative z-10 px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <div className="mt-8 text-white">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow-sm">
            <Image
              src="/images/logo_utama.svg"
              alt="Logo MBC Laboratory"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <h1 className="max-w-sm text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Login
            <br />
            Praktikan
          </h1>

          <p className="mt-4 max-w-[310px] font-secondary text-sm leading-relaxed text-white/75">
            Masuk menggunakan NIM dan password untuk mengakses dashboard
            praktikum.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-8 px-5">
        <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/75 p-5 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.55)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-[55px]" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-[55px]" />

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
                icon={<UserIcon className="h-5 w-5 text-primary" />}
                className="rounded-[22px] border border-white/70 bg-white/80 text-grey-900 placeholder:text-grey-400 shadow-sm backdrop-blur-xl"
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
                  icon={<Lock className="h-5 w-5 text-primary" />}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className="rounded-[22px] border border-white/70 bg-white/80 pr-12 text-grey-900 placeholder:text-grey-400 shadow-sm backdrop-blur-xl"
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

            <button
              type="submit"
              disabled={isPending}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
            >
              {isPending ? "Memproses..." : "Masuk"}
              <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
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
