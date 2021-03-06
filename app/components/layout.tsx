// Internals
import { Footer } from "./footer";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar";
import { LoadingMessage } from "./loading-message";
import { RightSidebar } from "./right-sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <LeftSidebar />
      <RightSidebar />

      {children}

      <Footer />

      <LoadingMessage />
    </>
  );
}
