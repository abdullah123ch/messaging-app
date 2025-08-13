#!/bin/bash

# Exit on error
set -e

# Get the absolute path to the project directory
PROJECT_DIR=$(pwd)

# Create a temporary crontab file
CRON_FILE=$(mktemp)

# Add the certificate renewal job (runs twice daily)
echo "0 0,12 * * * $PROJECT_DIR/renew-certs.sh >> $PROJECT_DIR/cert-renewal.log 2>&1" >> $CRON_FILE

# Add the database backup job (runs daily at 2 AM)
echo "0 2 * * * $PROJECT_DIR/backup-db.sh >> $PROJECT_DIR/backup-db.log 2>&1" >> $CRON_FILE

# Install the crontab
crontab $CRON_FILE
rm $CRON_FILE

echo "Cron jobs have been set up successfully!"
echo "Current crontab:"
crontab -l
