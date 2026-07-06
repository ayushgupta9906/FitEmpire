package com.fitempire.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitempire.common.response.ApiResponse;
import com.fitempire.security.service.UserDetailsServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            final String userEmail = jwtService.extractSubject(jwt);
            final String tokenType = jwtService.extractTokenType(jwt);

            // Reject refresh tokens used as access tokens
            if ("REFRESH".equals(tokenType)) {
                sendUnauthorizedResponse(response, "Refresh token cannot be used for API access.");
                return;
            }

            if (StringUtils.hasText(userEmail)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userEmail)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated user: {} [{}]", userEmail, request.getRequestURI());
                }
            }
        } catch (JwtException ex) {
            log.warn("JWT processing failed: {}", ex.getMessage());
            sendUnauthorizedResponse(response, "Invalid or expired token.");
            return;
        } catch (Exception ex) {
            log.error("Authentication filter error: {}", ex.getMessage(), ex);
            sendUnauthorizedResponse(response, "Authentication processing error.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ApiResponse<Void> body = ApiResponse.error(message, "UNAUTHORIZED");
        objectMapper.writeValue(response.getWriter(), body);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/v1/auth/")
                || path.startsWith("/v1/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v1/actuator/health")
                || path.startsWith("/v1/payments/webhook");
    }
}
