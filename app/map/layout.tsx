export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[100] bg-[#050507]">{children}</div>;
}
