package com.fitempire.security.config;

import com.fitempire.security.jwt.JwtAuthenticationFilter;
import com.fitempire.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.fitempire.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.fitempire.security.oauth2.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final com.fitempire.security.service.UserDetailsServiceImpl userDetailsService;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2FailureHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private List<String> allowedOrigins;

    @Value("${spring.security.oauth2.client.registration.google.client-id:dummy}")
    private String googleClientId;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ── CSRF (stateless JWT — disable) ───────────────────────────
                .csrf(AbstractHttpConfigurer::disable)

                // ── CORS ─────────────────────────────────────────────────────
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ── Session (stateless) ───────────────────────────────────────
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ── Security Headers ─────────────────────────────────────────
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentTypeOptions(contentType -> {
                        })
                        .referrerPolicy(referrer -> referrer
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .httpStrictTransportSecurity(hsts -> hsts
                                .maxAgeInSeconds(31536000)
                                .includeSubDomains(true)
                                .preload(true)))

                // ── Authorization Rules ───────────────────────────────────────
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight requests must pass through without auth/redirect
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public auth endpoints
                        .requestMatchers(HttpMethod.POST, "/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/auth/oauth2/**").permitAll()

                        // Public content endpoints (read-only gym/class discovery)
                        .requestMatchers(HttpMethod.GET, "/v1/gyms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/classes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/trainers/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/membership-plans/**").permitAll()

                        // Webhook (payment gateway callbacks)
                        .requestMatchers("/v1/payments/webhook/**").permitAll()

                        // Swagger / API docs
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v1/api-docs/**",
                                "/v3/api-docs/**")
                        .permitAll()

                        // Actuator health
                        .requestMatchers("/v1/actuator/health", "/v1/actuator/info").permitAll()

                        // Admin endpoints
                        .requestMatchers("/v1/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/v1/super-admin/**").hasRole("SUPER_ADMIN")

                        // Partner endpoints
                        .requestMatchers("/v1/partners/**").hasAnyRole("GYM_PARTNER", "ADMIN", "SUPER_ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated())

        // ── OAuth2 (only if real credentials configured) ──────────────
        ;
        if (!"dummy".equals(googleClientId) && !googleClientId.isEmpty()) {
            http.oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                    .successHandler(oAuth2SuccessHandler)
                    .failureHandler(oAuth2FailureHandler));
        }

        http
                // ── Authentication Provider ───────────────────────────────────
                .authenticationProvider(authenticationProvider())

                // ── JWT Filter ────────────────────────────────────────────────
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Hardcode all known origins for reliability
        List<String> origins = new java.util.ArrayList<>(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5173",
                "http://localhost:8081",
                "http://localhost:8082",
                "http://localhost:19006",
                "https://fitempire.netlify.app",
                "https://fitempire.vercel.app"
        ));

        // Also add any configured origins from env vars
        if (allowedOrigins != null) {
            for (String origin : allowedOrigins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty() && !origins.contains(trimmed)) {
                    origins.add(trimmed);
                }
            }
        }

        log.info("Configured CORS Allowed Origins: {}", origins);
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Refresh-Token"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
