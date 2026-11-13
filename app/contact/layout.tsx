import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact DevDrop — Get in Touch & Feedback",
  description: "Contact the DevDrop team for feature requests, tool suggestions, bug reports, and partnerships.",
  alternates: {
    canonical: "https://devdrop.online/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
