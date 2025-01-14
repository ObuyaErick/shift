# Postgres Container
FROM postgres:latest

# Set environment variables
ENV POSTGRES_DB db_multitenant
ENV POSTGRES_USER user_multitenant
ENV POSTGRES_PASSWORD password_multitenant

# Copy the custom entrypoint script into the container
# COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Expose the default PostgreSQL port (5432)
EXPOSE 5432