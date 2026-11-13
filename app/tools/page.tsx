import React from "react";
import { Metadata } from "next";
import ToolsClient from "@/components/ToolsClient";
import { INDEXABLE_TOOLS_LABEL } from "@/lib/data/tools";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "All Online Tools & Utilities Directory | DevDrop",
  description:
    `Explore ${INDEXABLE_TOOLS_LABEL} interactive online utilities, developer tools, image editors, PDF makers, and converters with instant search.`,
  alternates: {
    canonical: `${SITE_URL}/tools`,
  },
  openGraph: {
    title: "All Online Tools & Utilities | DevDrop",
    description:
      `Explore ${INDEXABLE_TOOLS_LABEL} interactive online utilities, developer tools, image editors, and PDF makers.`,
    url: `${SITE_URL}/tools`,
    type: "website",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
