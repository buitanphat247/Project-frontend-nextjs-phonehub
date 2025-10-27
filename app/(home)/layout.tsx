import Header from "../components/layout/header/Header";
import Footer from "../components/layout/Footer";

// Layout cho route group (home) - chỉ thêm Header & Footer
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}