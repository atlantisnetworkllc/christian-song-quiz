module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### Fichier 5 : `.gitignore`
```
node_modules
.next
.env*.local
.vercel
```

#### Fichier 6 : `.env.local.example`
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.christian-song.com/webhook/quiz-submit
NEXT_PUBLIC_CHECKOUT_URL=https://christian-song.com/checkout
NEXT_PUBLIC_SITE_NAME=PrayerSong
