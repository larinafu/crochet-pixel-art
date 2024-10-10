import { AuthProvider } from "@/utils/contexts/authContext";

import { lato, afacad } from "@/utils/fonts";
import "@/app/globals.css";
import { PixelsProvider } from "@/utils/contexts/pixelsContext";

export const metadata = {
  title: "Yarn Toolkit",
  description: "Pixel art generator for crochet and knitting projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={afacad.className}>
        <AuthProvider>
          <PixelsProvider>{children}</PixelsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
