package com.fitempire.security.oauth2;

import lombok.Getter;

import java.util.Map;

@Getter
public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getId();
    public abstract String getEmail();
    public abstract String getFirstName();
    public abstract String getLastName();
    public abstract String getImageUrl();
}

class GoogleOAuth2UserInfo extends OAuth2UserInfo {
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override public String getId() { return (String) attributes.get("sub"); }
    @Override public String getEmail() { return (String) attributes.get("email"); }
    @Override public String getFirstName() { return (String) attributes.get("given_name"); }
    @Override public String getLastName() { return (String) attributes.get("family_name"); }
    @Override public String getImageUrl() { return (String) attributes.get("picture"); }
}

class AppleOAuth2UserInfo extends OAuth2UserInfo {
    public AppleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override public String getId() { return (String) attributes.get("sub"); }
    @Override public String getEmail() { return (String) attributes.get("email"); }
    @Override public String getFirstName() {
        @SuppressWarnings("unchecked")
        Map<String, Object> name = (Map<String, Object>) attributes.get("name");
        return name != null ? (String) name.get("firstName") : "";
    }
    @Override public String getLastName() {
        @SuppressWarnings("unchecked")
        Map<String, Object> name = (Map<String, Object>) attributes.get("name");
        return name != null ? (String) name.get("lastName") : "";
    }
    @Override public String getImageUrl() { return null; }
}
