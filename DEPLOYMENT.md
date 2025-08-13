# Deployment Guide

This guide will walk you through deploying the Real-Time Chat Application to a production environment.

## Prerequisites

1. A server with Docker and Docker Compose installed
2. A domain name pointing to your server's IP address
3. Ports 80, 443, and 3000 open in your server's firewall

## Step 1: Server Setup

1. **Update your system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker and Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/real-time-chat.git
   cd real-time-chat
   ```

## Step 2: Configuration

1. **Create a `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:
   ```env
   # Database
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=chat_db
   
   # Backend
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   
   # Frontend
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   NEXT_PUBLIC_WS_URL=wss://yourdomain.com/ws
   
   # Domain (for Let's Encrypt)
   DOMAIN=yourdomain.com
   EMAIL=your-email@example.com
   ```

## Step 3: Initialize Let's Encrypt SSL Certificates

1. **Update the domain** in `init-letsencrypt.sh`:
   ```bash
   domains=(yourdomain.com www.yourdomain.com)
   ```

2. **Run the initialization script**:
   ```bash
   ./init-letsencrypt.sh
   ```

## Step 4: Start the Application

1. **Start the services** in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. **Run database migrations**:
   ```bash
   ./migrate-db.sh
   ```

3. **Set up automatic tasks** (certificate renewal and backups):
   ```bash
   ./setup-cron.sh
   ```

## Step 5: Verify the Deployment

1. **Check the services** are running:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **Access the application** in your browser:
   - Frontend: https://yourdomain.com
   - Backend API: https://yourdomain.com/api
   - API Documentation: https://yourdomain.com/api/docs

## Maintenance

### Updating the Application

1. **Pull the latest changes**:
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart the services**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Run any new migrations**:
   ```bash
   ./migrate-db.sh
   ```

### Backing Up the Database

1. **Manual backup**:
   ```bash
   ./backup-db.sh
   ```

   Backups are stored in the `backups` directory.

2. **Automatic backups** are configured to run daily at 2 AM.

### Renewing SSL Certificates

Certificates are automatically renewed by a cron job. You can also renew them manually:

```bash
./renew-certs.sh
```

## Troubleshooting

### View Logs

- **View all logs**:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f
  ```

- **View specific service logs**:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f nginx
  docker-compose -f docker-compose.prod.yml logs -f backend
  docker-compose -f docker-compose.prod.yml logs -f frontend
  ```

### Common Issues

1. **Port conflicts**: Ensure ports 80, 443, and 3000 are not in use by other services.
2. **Permission issues**: Run `sudo chmod -R 755` on the project directory if you encounter permission errors.
3. **Database connection issues**: Verify the database credentials in your `.env` file.

## Security Considerations

1. **Firewall**: Ensure only necessary ports are open.
2. **Updates**: Regularly update your system and Docker images.
3. **Backups**: Regularly check that backups are being created and test restoration.
4. **Monitoring**: Consider setting up monitoring for your services.

## Scaling

For higher traffic, consider:

1. **Load Balancing**: Use a load balancer in front of multiple application instances.
2. **Database**: Consider using a managed database service or setting up database replication.
3. **Caching**: Implement Redis for caching frequently accessed data.

## Support

For support, please open an issue in the GitHub repository.
