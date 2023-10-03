import './globals.css'
import { Inter, Lexend } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const lexend = Lexend({ subsets: ['latin'] })


export const metadata = {
  title: "Samwel's Master's Project",
  description: "Samwel's Master's Project",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  )
}
