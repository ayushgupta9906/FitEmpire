# ============================================================
# FitEmpire Backend — Multi-stage Dockerfile
# ============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 \
    mvn dependency:go-offline -B --no-transfer-progress 2>/dev/null || true

COPY src ./src

RUN --mount=type=cache,target=/root/.m2 \
    mvn package -DskipTests -B --no-transfer-progress

# ── Stage 2: Production Runtime ───────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS production

# Security: non-root user
RUN addgroup -S fitempire && adduser -S fitempire -G fitempire

WORKDIR /app

# JVM tuning for containers
ENV JAVA_OPTS="\
    -server \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+ExitOnOutOfMemoryError \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=prod \
    -Dfile.encoding=UTF-8 \
    -Duser.timezone=Asia/Kolkata"

# Copy JAR
COPY --from=builder --chown=fitempire:fitempire /app/target/fitempire-backend-1.0.0.jar app.jar

# Secrets mount point
RUN mkdir -p /secrets && chown fitempire:fitempire /secrets

# Log directory
RUN mkdir -p /var/log/fitempire && chown fitempire:fitempire /var/log/fitempire

USER fitempire

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:7860/api/v1/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=7860 -jar app.jar"]
