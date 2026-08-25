import type {Metadata} from "next";
import "./globals.css";
import "./publish.css";
export const metadata:Metadata={title:"MenuSathi — Photo to verified QR menu",description:"Turn a paper restaurant menu into a verified, mobile-friendly QR menu for Nepal.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
