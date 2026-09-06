import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIGSBD + Sarongo",
  description: "Shared commerce platform foundation",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
