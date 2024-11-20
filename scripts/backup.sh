#!/bin/bash

# Variables
BACKUP_SOURCE="/var/lib/mongodb"
BACKUP_DIR="/tmp/mongodb-backups"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mongodb-backup-$TIMESTAMP.tar.gz"
S3_BUCKET="mongodb-backup-akbar"
CRON_SCHEDULE="0 * * * *" # Schedule: Every Hour
SCRIPT_PATH="$(realpath "$0")"
MONGODB_PASSWORD="password123"


# Create admin user
mongosh admin --eval '
  db.createUser({
    user: "admin",
    pwd: "'$MONGODB_PASSWORD'",
    roles: [ { role: "root", db: "admin" } ]
  })
'

# Configure MongoDB to accept remote connections
sudo sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf

# Restart MongoDB to apply changes
sudo systemctl restart mongod
sleep 10

# Create backup directory if it doesn't exist
echo "Ensuring backup directory exists..."
mkdir -p "$BACKUP_DIR"

# Stop MongoDB to ensure data consistency
echo "Stopping MongoDB service..."
sudo systemctl stop mongod || { echo "Failed to stop MongoDB service"; exit 1; }
sleep 10

# Create a compressed backup
echo "Creating backup of $BACKUP_SOURCE..."
tar -czf "$BACKUP_FILE" "$BACKUP_SOURCE" || { echo "Backup creation failed"; sudo systemctl start mongod; exit 1; }

# Start MongoDB service
echo "Starting MongoDB service..."
sudo systemctl start mongod || { echo "Failed to start MongoDB service"; exit 1; }
sleep 10

# Upload backup to S3
echo "Uploading $BACKUP_FILE to S3 bucket $S3_BUCKET..."
aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/" || { echo "Failed to upload backup to S3"; exit 1; }

# Cleanup local backup (optional)
echo "Cleaning up local backup file $BACKUP_FILE..."
rm -f "$BACKUP_FILE"

echo "Backup completed and uploaded to S3 successfully."

# Add cron job for periodic execution
echo "Ensuring cron job is set up for periodic backups..."
CRON_JOB="$CRON_SCHEDULE $SCRIPT_PATH"
(crontab -l 2>/dev/null | grep -F "$SCRIPT_PATH") || (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "Cron job added: $CRON_JOB"