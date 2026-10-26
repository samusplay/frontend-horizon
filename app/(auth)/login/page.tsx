import { LoginView } from "@/components/auth/login-view";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string; registered?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, registered, reset } = await searchParams;

  return (
    <LoginView
      redirectTo={redirectTo}
      justRegistered={registered === "1"}
      justReset={reset === "1"}
    />
  );
}
