# ==============================================================================
# Stage 1: Build Frontend (React + Vite)
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependencies first for efficient layer caching
COPY frontend/package*.json ./
RUN npm ci || npm install

# Copy source and build production bundle
COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Build Backend (Spring Boot 3 + Maven)
# ==============================================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app

# Copy pom.xml and cache Maven dependencies
COPY backend/pom.xml ./backend/
RUN mvn -f backend/pom.xml dependency:go-offline -B || true

# Copy backend sources
COPY backend/src ./backend/src

# Embed frontend production distribution into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist/ ./backend/src/main/resources/static/

# Package executable Spring Boot jar
RUN mvn -f backend/pom.xml clean package -DskipTests -B

# ==============================================================================
# Stage 3: Lightweight Runtime Container (Alpine JRE)
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Create unprivileged user for secure container execution
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable jar from backend-builder
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Adjust directory permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Configure dynamic server port (Render, Railway, Cloud Run inject $PORT)
ENV PORT=8080
EXPOSE ${PORT}

# Application healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=35s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Launch application with production container optimizations
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
