#!/bin/bash

# ==============================================================================
# MongoDB Backup & Restore Tool (Docker)
#
# This script manages MongoDB data operations using Docker containers.
# Supported operations: backup, restore, import.
# ==============================================================================

# --- Configuration Variables ---

# Service name in your docker-compose.yml
DB_SERVICE_NAME="mongodb"

# Default Docker network (often prefixed by the project name)
DOCKER_NETWORK="gamelib_gamelib_network"

# Directory to store backups in the host
BACKUP_DIR="$(pwd)/backups/database"

# Database name
DB_NAME="gamelib"

# Number of days to keep backups
DAYS_TO_KEEP=7

# --- Logic ---

function show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  backup            Create a full dump of the database."
    echo "  restore [folder]  Restore data from a specific backup folder."
    echo "  import [file]     Import a JSON array file into the 'prelude' collection."
    echo "  clean             Remove backups older than $DAYS_TO_KEEP days."
    echo "  help              Show this help message."
    echo ""
}

function check_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

function perform_backup() {
    check_dir
    TIMESTAMP=$(date +"%Y-%m-%d-%H-%M")
    echo "Starting MongoDB backup for service '$DB_SERVICE_NAME'..."
    
    docker run --rm \
        --network "$DOCKER_NETWORK" \
        -v "$BACKUP_DIR:/backups" \
        -u "$(id -u):$(id -g)" \
        mongo:latest mongodump --db "$DB_NAME" --host "$DB_SERVICE_NAME" --out "/backups/$TIMESTAMP"
    
    if [ $? -eq 0 ]; then
        echo "Backup completed successfully at: $BACKUP_DIR/$TIMESTAMP"
    else
        echo "Error: Backup failed. Check Docker network and service status."
        exit 1
    fi
}

function perform_restore() {
    local target=$1
    if [ -z "$target" ]; then
        echo "Error: Please specify the backup folder name or absolute path."
        exit 1
    fi
    
    local full_path
    if [[ "$target" == /* ]]; then
        full_path="$target"
    else
        full_path="$BACKUP_DIR/$target"
    fi

    if [ ! -d "$full_path" ]; then
        echo "Error: Backup folder not found at $full_path"
        exit 1
    fi

    local parent_dir=$(cd "$(dirname "$full_path")" && pwd)
    local target_name=$(basename "$full_path")

    echo "Starting MongoDB restore from '$full_path'..."
    docker run --rm \
        --network "$DOCKER_NETWORK" \
        -v "$parent_dir:/backups" \
        -u "$(id -u):$(id -g)" \
        mongo:latest mongorestore --drop --db "$DB_NAME" --host "$DB_SERVICE_NAME" "/backups/$target_name"
}

function perform_import() {
    local file=$1
    if [ -z "$file" ]; then
        echo "Error: Please specify the JSON file to import."
        exit 1
    fi

    # Convert to absolute path if relative
    if [[ ! "$file" == /* ]]; then
        file="$(pwd)/$file"
    fi

    if [ ! -f "$file" ]; then
        echo "Error: File not found at $file"
        exit 1
    fi

    local filename=$(basename "$file")
    local dirname=$(cd "$(dirname "$file")" && pwd)

    echo "Importing '$filename' into '$DB_NAME'..."
    docker run --rm \
        --network "$DOCKER_NETWORK" \
        -v "$dirname:/data" \
        mongo:latest mongoimport --host "$DB_SERVICE_NAME" --db "$DB_NAME" --collection prelude --file "/data/$filename" --jsonArray
}

function clean_old_backups() {
    echo "Cleaning up backups older than $DAYS_TO_KEEP days..."
    find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +"$DAYS_TO_KEEP" -exec rm -rf {} \;
    echo "Cleanup finished."
}

# --- Command Router ---

case "$1" in
    backup)
        perform_backup
        clean_old_backups
        ;;
    restore)
        perform_restore "$2"
        ;;
    import)
        perform_import "$2"
        ;;
    clean)
        clean_old_backups
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
