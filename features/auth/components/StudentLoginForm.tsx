"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-auth";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export function StudentLoginForm() {
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
    <main className="min-h-screen bg-grey-200 pb-28">
      <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-12 pt-5 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10 mt-6">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-secondary text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali
          </Link>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <Image
              src="/images/logo_utama.svg"
              alt="Logo MBC Laboratory"
              width={56}
              height={56}
              className="h-full w-full object-contain drop-shadow-md"
              priority
            />
          </div>

          <p className="font-secondary text-xs font-semibold uppercase tracking-wide text-white/70">
            MBCLAB Portal
          </p>

          <h1 className="mt-2 max-w-sm text-3xl font-bold leading-[1.05] tracking-tight text-white">
            Login Praktikan
          </h1>

          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
            Silakan masuk menggunakan NIM dan kata sandi yang telah didaftarkan.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-6 px-4">
        <div className="mx-auto w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block font-secondary text-sm font-semibold text-grey-900">
                NIM
              </label>
              <Input
                {...register("nim")}
                type="text"
                placeholder="Masukkan NIM Anda"
                icon={<UserIcon className="h-5 w-5" />}
              />
              {errors.nim && (
                <span className="mt-2 block text-sm text-error">
                  {errors.nim.message}
                </span>
              )}
            </div>

            <div>
              <label className="mb-2 block font-secondary text-sm font-semibold text-grey-900">
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
              />
              {errors.password && (
                <span className="mt-2 block text-sm text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {error && (
              <div className="rounded-2xl bg-error/10 p-4 text-center font-secondary text-sm text-error">
                {error.message || "NIM atau Password salah."}
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full mt-6">
              {isPending ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
