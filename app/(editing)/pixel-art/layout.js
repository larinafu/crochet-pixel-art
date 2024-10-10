import { AuthProvider } from "@/utils/contexts/authContext";
import { PixelsProvider } from "@/utils/contexts/pixelsContext";
import { lato, afacad } from "../../../utils/fonts";

import "../../globals.css";

export default function Layout({ children }) {
  return (
    <>
      <PixelsProvider>{children}</PixelsProvider>
    </>
  );
}
