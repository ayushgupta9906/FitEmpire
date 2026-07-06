package com.fitempire.security.oauth2;

import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        String email = userInfo.getEmail();
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> existingUser = userRepository.findByEmailAndDeletedFalse(email);
        User user;

        if (existingUser.isPresent()) {
            user = updateExistingUser(existingUser.get(), userInfo, registrationId);
        } else {
            user = createNewUser(userInfo, registrationId);
        }

        return FitEmpireOAuth2User.create(user, oAuth2User.getAttributes());
    }

    private User updateExistingUser(User user, OAuth2UserInfo userInfo, String provider) {
        user.setFirstName(userInfo.getFirstName());
        user.setLastName(userInfo.getLastName());
        if (user.getProfilePictureUrl() == null) {
            user.setProfilePictureUrl(userInfo.getImageUrl());
        }
        user.setOauthProvider(provider.toUpperCase());
        user.setOauthProviderId(userInfo.getId());
        user.setLastLoginAt(Instant.now());
        return userRepository.save(user);
    }

    private User createNewUser(OAuth2UserInfo userInfo, String provider) {
        User user = new User();
        user.setEmail(userInfo.getEmail());
        user.setFirstName(userInfo.getFirstName());
        user.setLastName(userInfo.getLastName());
        user.setProfilePictureUrl(userInfo.getImageUrl());
        user.setOauthProvider(provider.toUpperCase());
        user.setOauthProviderId(userInfo.getId());
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setEmailVerified(true);
        user.setLastLoginAt(Instant.now());
        return userRepository.save(user);
    }
}
