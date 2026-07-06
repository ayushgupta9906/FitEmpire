package com.fitempire.security.oauth2;

import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.security.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        FitEmpireOAuth2User oAuth2User = (FitEmpireOAuth2User) authentication.getPrincipal();

        User user = userRepository.findByEmailAndDeletedFalse(oAuth2User.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login"));

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("token", accessToken)
                .queryParam("refresh_token", refreshToken)
                .queryParam("new_user", !user.isProfileComplete())
                .build().toUriString();

        log.info("OAuth2 login success for user: {}", user.getEmail());
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
