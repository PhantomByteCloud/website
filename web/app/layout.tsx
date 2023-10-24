// Library imports
import React from "react";
import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";

// Style imports
import "@mantine/core/styles.css";
import "../styles/globals.css";

// Component imports
import MantineClientProvider from "@/components/providers/MantineClientProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "PhantomByte",
  description: "Cloud Based Logging Service for Modern Software Applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link
          href="https://fonts.googleapis.com/css2?family=Nosifer&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </MantineClientProvider>
      </body>
    </html>
  );
}