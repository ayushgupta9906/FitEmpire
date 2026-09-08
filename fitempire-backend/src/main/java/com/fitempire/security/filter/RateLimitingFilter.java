package com.fitempire.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * IP-based sliding-window rate limiting filter.
 * Protects authentication and booking endpoints from burst abuse.
 */
@Slf4j
@Component
@Order(1)
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 120;
    private final Map<String, RequestBucket> clientBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = extractClientIp(request);
        long currentMinute = System.currentTimeMillis() / 60000;

        RequestBucket bucket = clientBuckets.compute(clientIp, (key, existing) -> {
            if (existing == null || existing.minute != currentMinute) {
                return new RequestBucket(currentMinute, new AtomicInteger(1));
            }
            existing.counter.incrementAndGet();
            return existing;
        });

        if (bucket.counter.get() > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded for client IP: {} on {}", clientIp, request.getRequestURI());
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please slow down.\",\"code\":\"RATE_LIMIT_EXCEEDED\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private static class RequestBucket {
        final long minute;
        final AtomicInteger counter;

        RequestBucket(long minute, AtomicInteger counter) {
            this.minute = minute;
            this.counter = counter;
        }
    }
}
