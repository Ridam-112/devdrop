import React from "react";
import { Metadata } from "next";
import ToolsClient from "@/components/ToolsClient";

export const metadata: Metadata = {
  title: "All Online Tools & Utilities Directory | DevDrop",
  description:
    "Explore 140+ interactive online utilities, developer tools, image editors, PDF makers, and diagnostic tools with instant search and filtering.",
  alternates: {
    canonical: "https://devdrop.online/tools",
  },
  openGraph: {
    title: "All Online Tools & Utilities | DevDrop",
    description:
      "Explore 140+ interactive online utilities, developer tools, image editors, and PDF makers.",
    url: "https://devdrop.online/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
