
8. # google client id and secret
    - Go to [https://console.cloud.google.com/]
    - Create a new project or select existing one
    - Go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID" [if need project config, do it]
    - Choose "Web application"
    - Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
    - Add authorized redirect URI: http://[domain.com]/api/auth/callback/google
    - Save your Client ID and Client Secret
    - Create environment variables file and update GoogleAuthButton component:
