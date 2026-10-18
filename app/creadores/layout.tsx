import { CreatorSidebar } from "@/components/creators/CreatorSidebar";
import { cookies } from "next/headers";

export default async function CreadoresLayout({ children }: { children: React.ReactNode }) {
  //la preferencia del menú viaja en una cookie para que se pinte bien desde el primer render
  const collapsed = (await cookies()).get("creator_sidebar")?.value === "collapsed";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0221] via-[#0a0118] to-black pt-28 text-white">
      {/* mismo ancho y márgenes que el navbar dentro del panel, para que queden alineados */}
      <div className="mx-auto flex max-w-[1700px] flex-col gap-6 px-4 pb-16 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        <CreatorSidebar defaultCollapsed={collapsed} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}