export const metadata = {
  title: 'PrayerSong - Create Your Personalized Song',
  description: 'Create a beautiful, personalized song for your loved ones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
