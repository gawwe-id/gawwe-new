import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - 404",
  description: "The page you are looking for could not be found.",
};

export default function CatchAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return the children directly so we can trigger the not-found page
  return children;
}
