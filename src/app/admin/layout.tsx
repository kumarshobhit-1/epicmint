import AdminWrapper from '@/components/admin-wrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminWrapper>{children}</AdminWrapper>;
}