#!/bin/bash
# Wait for DB to be ready
until docker exec RideSuraksha-db pg_isready -U postgres; do
  echo "Waiting for database..."
  sleep 2
done

echo "Initializing database schemas..."
docker exec -i RideSuraksha-db psql -U postgres -d ridesuraksha < backend/schema-zones.sql
docker exec -i RideSuraksha-db psql -U postgres -d ridesuraksha < backend/schema-triggers.sql
docker exec -i RideSuraksha-db psql -U postgres -d ridesuraksha < backend/schema-claims.sql
docker exec -i RideSuraksha-db psql -U postgres -d ridesuraksha < backend/schema-payments.sql
echo "Database initialized."
