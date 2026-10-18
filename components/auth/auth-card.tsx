import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-lg bg-black/50 border-white/10 backdrop-blur-xl text-white shadow-2xl shadow-fuchsia-500/10">
      <CardHeader className="pb-2 space-y-0.5">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription className="text-white/50 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-5">{children}</CardContent>
    </Card>
  );
}