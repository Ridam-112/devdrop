import React from "react";
import { Metadata } from "next";
import ToolsClient from "@/components/ToolsClient";

export const metadata: Metadata = {
  title: "All Cyber Tools & Simulators — Complete Directory | DEVDROP",
  description:
    "Explore 87+ interactive cybersecurity simulators, gaming tools, network diagnostic monitors, and terminal command visualizers with instant search and filtering.",
  alternates: {
    canonical: "https://devdrop.vercel.app/tools",
  },
  openGraph: {
    title: "All Cyber Tools & Simulators | DEVDROP",
    description:
      "Explore 87+ interactive cybersecurity simulators, gaming tools, network monitors, and terminal command visualizers.",
    url: "https://devdrop.vercel.app/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
