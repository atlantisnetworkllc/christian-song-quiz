import './globals.css'

export const metadata = {
  title: 'PrayerSong - Create Your Personalized Song',
  description: 'Create a beautiful, personalized song for your loved ones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
