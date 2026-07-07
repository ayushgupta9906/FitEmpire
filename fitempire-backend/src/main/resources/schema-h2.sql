-- ============================================================
-- FitEmpire H2 Database Schema
-- A simplified, H2-compatible schema for local development.
-- NOTE: This schema is a simplified version of the main
-- PostgreSQL schema. Array types are mapped to TEXT.
-- ============================================================

-- USERS (renamed to app_users to match entity mapping)
CREATE TABLE app_users (
    id                  UUID PRIMARY KEY, 
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20) UNIQUE,
    phone_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash       VARCHAR(255),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    display_name        VARCHAR(200),
    date_of_birth       DATE,
    gender              VARCHAR(50),
    profile_picture_url TEXT,
    role                VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_locked           BOOLEAN NOT NULL DEFAULT FALSE,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE, 
    oauth_provider      VARCHAR(50),
    oauth_provider_id   VARCHAR(255),
    referral_code       VARCHAR(20) UNIQUE,
    referred_by_id      UUID,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    failed_login_count  INT NOT NULL DEFAULT 0,
    locked_until        TIMESTAMP WITH TIME ZONE,
    fcm_token           TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

-- GYMS (PARTNERS / CENTERS)
CREATE TABLE gyms (
    id                  UUID PRIMARY KEY,
    owner_id            UUID NOT NULL,
    name                VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) NOT NULL UNIQUE,
    description         TEXT,
    logo_url            TEXT,
    cover_image_url     TEXT,
    website_url         TEXT,
    email               VARCHAR(255),
    phone               VARCHAR(20),
    gst_number          VARCHAR(20),
    pan_number          VARCHAR(20),
    category            VARCHAR(50) NOT NULL DEFAULT 'GYM',
    status              VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW',
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    avg_rating          DECIMAL(3,2) DEFAULT 0,
    total_reviews       INT DEFAULT 0,
    total_members       INT DEFAULT 0,
    rejection_reason    TEXT,
    approved_at         TIMESTAMP WITH TIME ZONE,
    approved_by_id      UUID,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES app_users(id) 
);

-- GYM BRANCHES
CREATE TABLE gym_branches (
    id                  UUID PRIMARY KEY,
    gym_id              UUID NOT NULL,
    name                VARCHAR(255) NOT NULL,
    address_line1       TEXT NOT NULL,
    address_line2       TEXT,
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL, 
    country             VARCHAR(100) NOT NULL DEFAULT 'India',
    pincode             VARCHAR(10) NOT NULL,
    latitude            DECIMAL(10,8),
    longitude           DECIMAL(11,8),
    phone               VARCHAR(20),
    email               VARCHAR(255),
    is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    capacity            INT NOT NULL DEFAULT 50,
    opening_time        TIME,
    closing_time        TIME,
    amenities           TEXT, -- Mapped from TEXT[] for H2
    working_days        TEXT, -- Mapped from VARCHAR[] for H2
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

-- MEMBERSHIP PLANS (Simplified)
CREATE TABLE membership_plans (
    id                  UUID PRIMARY KEY,
    gym_id              UUID NOT NULL,
    name                VARCHAR(255) NOT NULL,
    type                VARCHAR(50) NOT NULL,
    price               DECIMAL(12,2) NOT NULL,
    credit_count        INT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

-- USER MEMBERSHIPS (Simplified)
CREATE TABLE user_memberships (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    plan_id             UUID NOT NULL,
    gym_id              UUID NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    start_date          DATE,
    end_date            DATE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES app_users(id),
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id),
    FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

-- BOOKINGS (Simplified)
CREATE TABLE bookings (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    gym_id              UUID NOT NULL,
    branch_id           UUID NOT NULL,
    membership_id       UUID,
    class_schedule_id   UUID,
    trainer_id          UUID,
    booking_type        VARCHAR(50) NOT NULL,
    status              VARCHAR(50) NOT NULL,
    booking_date        DATE NOT NULL,
    start_time          TIME,
    end_time            TIME,
    qr_token            VARCHAR(255) UNIQUE,
    qr_expires_at       TIMESTAMP WITH TIME ZONE,
    checked_in_at       TIMESTAMP WITH TIME ZONE,
    checked_out_at      TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES app_users(id),
    FOREIGN KEY (gym_id) REFERENCES gyms(id),
    FOREIGN KEY (branch_id) REFERENCES gym_branches(id),
    FOREIGN KEY (membership_id) REFERENCES user_memberships(id)
);

-- TRAINERS (Simplified)
CREATE TABLE trainers (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL,
    gym_id              UUID NOT NULL,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES app_users(id),
    FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

-- TRAINER SCHEDULES (Simplified)
CREATE TABLE trainer_schedules (
    id              UUID PRIMARY KEY,
    trainer_id      UUID NOT NULL,
    branch_id       UUID NOT NULL,
    day_of_week     SMALLINT NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (trainer_id) REFERENCES trainers(id),
    FOREIGN KEY (branch_id) REFERENCES gym_branches(id)
);

-- AI RECOMMENDATIONS (Simplified)
CREATE TABLE ai_recommendations (
    id              UUID PRIMARY KEY,
    user_id         UUID NOT NULL,
    type            VARCHAR(50) NOT NULL,
    content         TEXT, -- Mapped from JSONB
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES app_users(id)
);