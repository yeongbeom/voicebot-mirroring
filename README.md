<h1 align='center'>
  <img src='/diagram.png' alt='system diagram' width='700'>
</h1>

# Install

### Database (docker)

```bash
docker pull postgres
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

### `dotenv` file

Create `.env` file in the project's root directory. Open the file and add the following line of code:

```bash
DATABASE_URL='postgres://postgres:mysecretpassword@localhost:5432/database'
VITE_TTS_API_KEY_0={api-key}
VITE_TTS_API_KEY_1={api-key}
VITE_TTS_API_KEY_2={api-key}
VITE_TTS_API_KEY_3={api-key}
VITE_TTS_API_KEY_4={api-key}
VITE_TTS_API_KEY_5={api-key}
VITE_WEATHER_API_KEY={api-key}
```

### npm

```bash
npm i
npm run dev -- --host --https
```

# GitPod

1. Install GitPod chrome extension

   https://chrome.google.com/webstore/detail/gitpod-always-ready-to-co/dodmmooeoklaejobgleioelladacbeki

2. Run

# Mis.

### Weather API (Current Weather Data)

https://openweathermap.org/api

### TTS API

https://speech-api.kakao.com/
