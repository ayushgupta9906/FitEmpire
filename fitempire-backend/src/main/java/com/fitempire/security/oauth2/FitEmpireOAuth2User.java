package com.fitempire.security.oauth2;

import com.fitempire.modules.users.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Getter
public class FitEmpireOAuth2User implements OAuth2User {

    private final UUID userId;
    private final String email;
    private final String role;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Map<String, Object> attributes;

    private FitEmpireOAuth2User(User user, Map<String, Object> attributes) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        this.attributes = attributes;
    }

    public static FitEmpireOAuth2User create(User user, Map<String, Object> attributes) {
        return new FitEmpireOAuth2User(user, attributes);
    }

    @Override
    public String getName() {
        return email;
    }
}
