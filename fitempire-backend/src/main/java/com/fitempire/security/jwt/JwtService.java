package com.fitempire.security.jwt;

import com.fitempire.common.exception.UnauthorizedException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-expiry-ms}")
    private long accessTokenExpiryMs;

    @Value("${app.jwt.refresh-token-expiry-ms}")
    private long refreshTokenExpiryMs;

    // ── Token Generation ───────────────────────────────────────────────────────

    public String generateAccessToken(UUID userId, String email, String role) {
        return buildToken(
                Map.of(
                        "userId", userId.toString(),
                        "role", role,
                        "type", "ACCESS"
                ),
                email,
                accessTokenExpiryMs
        );
    }

    public String generateRefreshToken(UUID userId, String email) {
        return buildToken(
                Map.of(
                        "userId", userId.toString(),
                        "type", "REFRESH"
                ),
                email,
                refreshTokenExpiryMs
        );
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expiryMs) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiryMs))
                .id(UUID.randomUUID().toString())
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    // ── Token Validation ───────────────────────────────────────────────────────

    public boolean isTokenValid(String token, String userEmail) {
        try {
            final String subject = extractSubject(token);
            return subject.equals(userEmail) && !isTokenExpired(token);
        } catch (JwtException e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public void validateTokenOrThrow(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
        } catch (ExpiredJwtException ex) {
            throw new UnauthorizedException("Token has expired.");
        } catch (JwtException ex) {
            throw new UnauthorizedException("Invalid token: " + ex.getMessage());
        }
    }

    // ── Claims Extraction ──────────────────────────────────────────────────────

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public UUID extractUserId(String token) {
        String userId = extractClaim(token, claims -> claims.get("userId", String.class));
        return UUID.fromString(userId);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public long getAccessTokenExpiryMs() {
        return accessTokenExpiryMs;
    }

    public long getRefreshTokenExpiryMs() {
        return refreshTokenExpiryMs;
    }
}
