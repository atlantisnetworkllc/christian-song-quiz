export const metadata = {
  title: 'PrayerSong - Create Your Personalized Song',
  description: 'Create a beautiful, personalized song for your loved ones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
