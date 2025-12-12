import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-bg-app p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
            <Logo />
            <p className="mt-2 text-base text-text-secondary">
                Your thoughts, AI-organized
            </p>
        </div>
        {children}
      </div>
    </main>
  );
}
