import Header from "../components/layout/header/Header";
import Footer from "../components/layout/Footer";
import ToastProvider from "../components/layout/ToastProvider";

// Force dynamic rendering because Header component uses cookies
export const dynamic = 'force-dynamic';

// Layout cho route group (home) - chỉ thêm Header & Footer
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ToastProvider />
    </>
  );
}