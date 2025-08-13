#!/bin/bash

# Check if .env.local already exists
if [ -f ".env.local" ]; then
  echo ".env.local already exists. Please remove it first if you want to generate a new one."
  exit 1
fi

# Create .env.local with default values
cat > .env.local <<EOL
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Development
NODE_ENV=development
EOL

echo "Created .env.local with default values."
echo "Please review and update the configuration as needed."
