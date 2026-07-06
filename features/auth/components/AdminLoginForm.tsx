"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useLogin } from "../hooks/use-auth";
import { Input } from "@/shared/components/ui/input";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin({ expectedRole: "ADMIN" });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (err) => {
        const errorMessage = err.message.toLowerCase();

        if (
          errorMessage.includes("nim") &&
          !errorMessage.includes("password")
        ) {
          setError("nim", { type: "server", message: err.message });
        } else if (
          errorMessage.includes("password") &&
          !errorMessage.includes("nim")
        ) {
          setError("password", { type: "server", message: err.message });
        } else {
          setError("root.serverError", {
            type: "server",
            message: err.message,
          });
        }
      },
    });
  };

  const getInputClassName = (hasError?: boolean) =>
    `h-13 rounded-[22px] bg-white text-grey-900 placeholder:text-grey-400 shadow-sm transition ${
      hasError
        ? "border-2 border-error focus:border-error focus:ring-2 focus:ring-error/20"
        : "border border-grey-200 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
    }`;

  return (
    <main className="flex min-h-screen w-full bg-grey-50 font-primary">
      <section className="relative z-10 hidden w-1/2 flex-col justify-center overflow-hidden rounded-r-[48px] bg-[linear-gradient(135deg,#0065b0_0%,#1e3f75_100%)] px-16 shadow-[12px_0_40px_rgba(0,101,176,0.15)] lg:flex xl:px-24">
        <div className="pointer-events-none absolute -right-24 top-10 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px]" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-[400px] w-[400px] rounded-full bg-white/10 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5" />

        <div className="relative z-10 text-white">
          <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white p-4 shadow-xl">
            <Image
              src="/images/logo_utama.svg"
              alt="Logo MBC Laboratory"
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-6xl">
            Portal Manajemen
            <br />
            <span className="text-white/80">MBC Laboratory</span>
          </h1>
          <p className="mt-8 max-w-md font-secondary text-lg leading-relaxed text-white/80">
            Sistem informasi dan manajemen praktikum terpadu. Masuk untuk
            mengelola modul, jadwal, nilai praktikan, dan aktivitas asisten.
          </p>
        </div>
      </section>

      {/* Kolom Kanan - Form Login */}
      <section className="flex w-full items-center justify-center px-6 sm:px-12 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[36px] font-extrabold tracking-tight text-grey-900">
              Login Asisten
            </h2>
            <p className="mt-3 font-secondary text-[15px] leading-relaxed text-grey-500">
              Masuk menggunakan kredensial akun untuk mengakses dashboard admin.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block font-secondary text-sm font-bold text-grey-900">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <Input
                {...register("nim")}
                type="text"
                placeholder="Masukkan NIM Anda"
                icon={
                  <UserIcon
                    className={`h-5 w-5 ${errors.nim ? "text-error" : "text-primary"}`}
                  />
                }
                className={getInputClassName(!!errors.nim)}
              />
              {errors.nim && (
                <span className="mt-2 block font-secondary text-sm font-medium text-error">
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
                  icon={
                    <Lock
                      className={`h-5 w-5 ${errors.password ? "text-error" : "text-primary"}`}
                    />
                  }
                  className={`${getInputClassName(!!errors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${errors.password ? "text-error" : "text-grey-400 hover:text-primary"}`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="mt-2 block font-secondary text-sm font-medium text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {errors.root?.serverError && (
              <span className="block font-secondary text-sm font-semibold text-error text-center lg:text-left">
                {errors.root.serverError.message}
              </span>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-secondary text-[15px] font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
            >
              {isPending ? "Memverifikasi..." : "Masuk ke Dashboard"}
              <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center font-secondary text-xs font-medium text-grey-400 lg:text-left">
            &copy; {new Date().getFullYear()} MBC Laboratory. All rights
            reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
