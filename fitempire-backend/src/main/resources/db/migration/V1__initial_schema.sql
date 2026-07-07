-- ============================================================
-- FitEmpire Database Schema — V1 Initial Migration
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ── ENUMS ────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('CUSTOMER','GYM_PARTNER','TRAINER','ADMIN','SUPER_ADMIN');
CREATE TYPE user_gender AS ENUM ('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY');
CREATE TYPE fitness_goal AS ENUM ('WEIGHT_LOSS','MUSCLE_GAIN','ENDURANCE','FLEXIBILITY','GENERAL_FITNESS','SPORTS_PERFORMANCE');
CREATE TYPE gym_status AS ENUM ('PENDING_REVIEW','ACTIVE','SUSPENDED','REJECTED','CLOSED');
CREATE TYPE membership_type AS ENUM ('MONTHLY','QUARTERLY','SEMI_ANNUAL','ANNUAL','DAY_PASS','CREDIT_PACK','CORPORATE');
CREATE TYPE membership_status AS ENUM ('ACTIVE','EXPIRED','CANCELLED','SUSPENDED','PENDING');
CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','CHECKED_IN','COMPLETED','CANCELLED','NO_SHOW');
CREATE TYPE booking_type AS ENUM ('CLASS','PERSONAL_TRAINING','GYM_ACCESS');
CREATE TYPE payment_status AS ENUM ('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED','PARTIALLY_REFUNDED');
CREATE TYPE payment_method AS ENUM ('CARD','UPI','WALLET','NET_BANKING','RAZORPAY','STRIPE','CASH');
CREATE TYPE payment_gateway AS ENUM ('RAZORPAY','STRIPE','INTERNAL');
CREATE TYPE transaction_type AS ENUM ('CREDIT','DEBIT');
CREATE TYPE wallet_txn_type AS ENUM ('TOPUP','PURCHASE','REFUND','REWARD_REDEMPTION','EXPIRY');
CREATE TYPE notification_type AS ENUM ('BOOKING_CONFIRMATION','BOOKING_REMINDER','MEMBERSHIP_EXPIRY','PAYMENT_SUCCESS','PAYMENT_FAILED','CLASS_CANCELLED','REWARD_EARNED','PROMOTIONAL','SYSTEM');
CREATE TYPE notification_channel AS ENUM ('PUSH','EMAIL','SMS','IN_APP');
CREATE TYPE ticket_status AS ENUM ('OPEN','IN_PROGRESS','RESOLVED','CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW','MEDIUM','HIGH','URGENT');
CREATE TYPE coupon_type AS ENUM ('PERCENTAGE','FIXED_AMOUNT','FREE_SESSION');
CREATE TYPE review_status AS ENUM ('PENDING','APPROVED','REJECTED','FLAGGED');
CREATE TYPE document_type AS ENUM ('GST_CERTIFICATE','PAN_CARD','AADHAAR','BUSINESS_REGISTRATION','OWNER_ID','OTHER');
CREATE TYPE class_difficulty AS ENUM ('BEGINNER','INTERMEDIATE','ADVANCED','ALL_LEVELS');
CREATE TYPE trainer_specialization AS ENUM ('YOGA','PILATES','STRENGTH','HIIT','CARDIO','ZUMBA','BOXING','CROSSFIT','SWIMMING','NUTRITION','REHABILITATION','GENERAL');
CREATE TYPE audit_action AS ENUM ('CREATE','UPDATE','DELETE','LOGIN','LOGOUT','PAYMENT','REFUND','ROLE_CHANGE','SUSPENSION','APPROVAL');
CREATE TYPE otp_purpose AS ENUM ('REGISTRATION','LOGIN','PASSWORD_RESET','PHONE_VERIFICATION','EMAIL_VERIFICATION');

-- ── USERS ────────────────────────────────────────────────────

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20) UNIQUE,
    phone_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash       VARCHAR(255),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    display_name        VARCHAR(200),
    date_of_birth       DATE,
    gender              user_gender,
    profile_picture_url TEXT,
    role                user_role NOT NULL DEFAULT 'CUSTOMER',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    is_locked           BOOLEAN NOT NULL DEFAULT FALSE,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider      VARCHAR(50),
    oauth_provider_id   VARCHAR(255),
    referral_code       VARCHAR(20) UNIQUE,
    referred_by_id      UUID REFERENCES users(id),
    last_login_at       TIMESTAMPTZ,
    failed_login_count  INT NOT NULL DEFAULT 0,
    locked_until        TIMESTAMPTZ,
    fcm_token           TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_users_email ON users(email) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_phone ON users(phone) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_role ON users(role) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_deleted = FALSE;

-- ── USER PROFILES ─────────────────────────────────────────────

CREATE TABLE user_profiles (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio                 TEXT,
    fitness_goal        fitness_goal,
    fitness_level       VARCHAR(50),
    height_cm           DECIMAL(5,2),
    weight_kg           DECIMAL(5,2),
    target_weight_kg    DECIMAL(5,2),
    bmi                 DECIMAL(4,2),
    fitness_score       INT DEFAULT 0,
    total_checkins      INT DEFAULT 0,
    total_classes       INT DEFAULT 0,
    preferred_workout_time VARCHAR(50),
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    pincode             VARCHAR(10),
    address_line1       TEXT,
    address_line2       TEXT,
    notification_push   BOOLEAN DEFAULT TRUE,
    notification_email  BOOLEAN DEFAULT TRUE,
    notification_sms    BOOLEAN DEFAULT TRUE,
    dark_mode           BOOLEAN DEFAULT FALSE,
    language            VARCHAR(10) DEFAULT 'en',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ── BODY MEASUREMENTS ────────────────────────────────────────

CREATE TABLE body_measurements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg       DECIMAL(5,2),
    height_cm       DECIMAL(5,2),
    bmi             DECIMAL(4,2),
    body_fat_pct    DECIMAL(4,2),
    muscle_mass_kg  DECIMAL(5,2),
    chest_cm        DECIMAL(5,2),
    waist_cm        DECIMAL(5,2),
    hips_cm         DECIMAL(5,2),
    bicep_cm        DECIMAL(5,2),
    thigh_cm        DECIMAL(5,2),
    notes           TEXT,
    measured_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_body_measurements_user_id ON body_measurements(user_id);
CREATE INDEX idx_body_measurements_date ON body_measurements(user_id, measured_at DESC);

-- ── OTP CODES ────────────────────────────────────────────────

CREATE TABLE otp_codes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    code            VARCHAR(10) NOT NULL,
    purpose         otp_purpose NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    verified_at     TIMESTAMPTZ,
    attempts        INT NOT NULL DEFAULT 0,
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_codes_email ON otp_codes(email, purpose) WHERE is_used = FALSE;
CREATE INDEX idx_otp_codes_phone ON otp_codes(phone, purpose) WHERE is_used = FALSE;
CREATE INDEX idx_otp_codes_expires ON otp_codes(expires_at);

-- ── REFRESH TOKENS ────────────────────────────────────────────

CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(512) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    device_info     VARCHAR(500),
    ip_address      VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id) WHERE is_revoked = FALSE;
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- ── GYMS ─────────────────────────────────────────────────────

CREATE TABLE gyms (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id            UUID NOT NULL REFERENCES users(id),
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
    status              gym_status NOT NULL DEFAULT 'PENDING_REVIEW',
    category            VARCHAR(50) NOT NULL DEFAULT 'GYM',
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    avg_rating          DECIMAL(3,2) DEFAULT 0,
    total_reviews       INT DEFAULT 0,
    total_members       INT DEFAULT 0,
    rejection_reason    TEXT,
    approved_at         TIMESTAMPTZ,
    approved_by_id      UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_gyms_owner ON gyms(owner_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_gyms_status ON gyms(status) WHERE is_deleted = FALSE;
CREATE INDEX idx_gyms_slug ON gyms(slug);
CREATE INDEX idx_gyms_featured ON gyms(is_featured, avg_rating DESC) WHERE is_deleted = FALSE;

-- ── GYM BRANCHES ─────────────────────────────────────────────

CREATE TABLE gym_branches (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id              UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    address_line1       TEXT NOT NULL,
    address_line2       TEXT,
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    country             VARCHAR(100) NOT NULL DEFAULT 'India',
    pincode             VARCHAR(10) NOT NULL,
    latitude            DECIMAL(10,8),
    longitude           DECIMAL(11,8),
    location            GEOGRAPHY(POINT, 4326),
    phone               VARCHAR(20),
    email               VARCHAR(255),
    is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    capacity            INT NOT NULL DEFAULT 50,
    opening_time        TIME,
    closing_time        TIME,
    amenities           TEXT[],
    working_days        VARCHAR(20)[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_gym_branches_gym ON gym_branches(gym_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_gym_branches_location ON gym_branches USING GIST(location) WHERE is_deleted = FALSE;
CREATE INDEX idx_gym_branches_city ON gym_branches(city) WHERE is_deleted = FALSE;
CREATE INDEX idx_gym_branches_active ON gym_branches(is_active) WHERE is_deleted = FALSE;

-- ── GYM PHOTOS ───────────────────────────────────────────────

CREATE TABLE gym_photos (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_branch_id   UUID NOT NULL REFERENCES gym_branches(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    thumbnail_url   TEXT,
    caption         VARCHAR(255),
    sort_order      INT DEFAULT 0,
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gym_photos_branch ON gym_photos(gym_branch_id);

-- ── GYM DOCUMENTS ────────────────────────────────────────────

CREATE TABLE gym_documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id          UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    document_type   document_type NOT NULL,
    file_url        TEXT NOT NULL,
    file_name       VARCHAR(255),
    is_verified     BOOLEAN DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    verified_by_id  UUID REFERENCES users(id),
    rejection_note  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gym_documents_gym ON gym_documents(gym_id);

-- ── AMENITIES ────────────────────────────────────────────────

CREATE TABLE amenities (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(100),
    category    VARCHAR(50)
);

CREATE TABLE gym_branch_amenities (
    branch_id   UUID REFERENCES gym_branches(id) ON DELETE CASCADE,
    amenity_id  UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (branch_id, amenity_id)
);

-- ── TRAINERS ─────────────────────────────────────────────────

CREATE TABLE trainers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id),
    gym_id              UUID NOT NULL REFERENCES gyms(id),
    bio                 TEXT,
    experience_years    INT,
    certifications      TEXT[],
    specializations     trainer_specialization[],
    profile_picture_url TEXT,
    cover_image_url     TEXT,
    hourly_rate         DECIMAL(10,2),
    is_available        BOOLEAN DEFAULT TRUE,
    avg_rating          DECIMAL(3,2) DEFAULT 0,
    total_reviews       INT DEFAULT 0,
    total_sessions      INT DEFAULT 0,
    is_featured         BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_trainers_gym ON trainers(gym_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_trainers_user ON trainers(user_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_trainers_rating ON trainers(avg_rating DESC) WHERE is_deleted = FALSE;

-- ── TRAINER SCHEDULES ─────────────────────────────────────────

CREATE TABLE trainer_schedules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id      UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    branch_id       UUID NOT NULL REFERENCES gym_branches(id),
    day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trainer_schedules_trainer ON trainer_schedules(trainer_id);

-- ── FITNESS CLASSES ───────────────────────────────────────────

CREATE TABLE fitness_classes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id          UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id       UUID REFERENCES gym_branches(id),
    trainer_id      UUID REFERENCES trainers(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    thumbnail_url   TEXT,
    duration_mins   INT NOT NULL,
    max_capacity    INT NOT NULL DEFAULT 20,
    difficulty      class_difficulty NOT NULL DEFAULT 'ALL_LEVELS',
    category        VARCHAR(100),
    tags            TEXT[],
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255)
);

CREATE INDEX idx_fitness_classes_gym ON fitness_classes(gym_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_fitness_classes_trainer ON fitness_classes(trainer_id) WHERE is_deleted = FALSE;

-- ── CLASS SCHEDULES ───────────────────────────────────────────

CREATE TABLE class_schedules (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fitness_class_id    UUID NOT NULL REFERENCES fitness_classes(id) ON DELETE CASCADE,
    branch_id           UUID NOT NULL REFERENCES gym_branches(id),
    trainer_id          UUID REFERENCES trainers(id),
    scheduled_date      DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    max_capacity        INT NOT NULL,
    booked_count        INT NOT NULL DEFAULT 0,
    waitlist_count      INT NOT NULL DEFAULT 0,
    is_cancelled        BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_class_schedules_class ON class_schedules(fitness_class_id);
CREATE INDEX idx_class_schedules_date ON class_schedules(scheduled_date, branch_id) WHERE is_cancelled = FALSE;
CREATE INDEX idx_class_schedules_branch ON class_schedules(branch_id, scheduled_date);

-- ── MEMBERSHIP PLANS ─────────────────────────────────────────

CREATE TABLE membership_plans (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id              UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    branch_id           UUID REFERENCES gym_branches(id),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    type                membership_type NOT NULL,
    price               DECIMAL(12,2) NOT NULL,
    gst_amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price         DECIMAL(12,2) NOT NULL,
    duration_days       INT,
    credit_count        INT,
    max_freeze_days     INT DEFAULT 7,
    max_sessions_per_day INT DEFAULT 1,
    includes_classes    BOOLEAN DEFAULT TRUE,
    includes_personal_training BOOLEAN DEFAULT FALSE,
    includes_amenities  TEXT[],
    is_active           BOOLEAN DEFAULT TRUE,
    is_corporate        BOOLEAN DEFAULT FALSE,
    sort_order          INT DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_membership_plans_gym ON membership_plans(gym_id, is_active) WHERE is_deleted = FALSE;
CREATE INDEX idx_membership_plans_type ON membership_plans(type) WHERE is_deleted = FALSE;

-- ── USER MEMBERSHIPS ──────────────────────────────────────────

CREATE TABLE user_memberships (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id),
    plan_id             UUID NOT NULL REFERENCES membership_plans(id),
    gym_id              UUID NOT NULL REFERENCES gyms(id),
    branch_id           UUID REFERENCES gym_branches(id),
    status              membership_status NOT NULL DEFAULT 'PENDING',
    start_date          DATE,
    end_date            DATE,
    credits_remaining   INT,
    credits_total       INT,
    sessions_used_today INT DEFAULT 0,
    last_session_date   DATE,
    freeze_start_date   DATE,
    freeze_end_date     DATE,
    freeze_days_used    INT DEFAULT 0,
    auto_renew          BOOLEAN DEFAULT FALSE,
    corporate_code      VARCHAR(100),
    payment_id          UUID,
    cancelled_at        TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_user_memberships_user ON user_memberships(user_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_user_memberships_gym ON user_memberships(gym_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_user_memberships_expiry ON user_memberships(end_date, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_user_memberships_plan ON user_memberships(plan_id) WHERE is_deleted = FALSE;

-- ── BOOKINGS ─────────────────────────────────────────────────

CREATE TABLE bookings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id),
    gym_id              UUID NOT NULL REFERENCES gyms(id),
    branch_id           UUID NOT NULL REFERENCES gym_branches(id),
    membership_id       UUID REFERENCES user_memberships(id),
    class_schedule_id   UUID REFERENCES class_schedules(id),
    trainer_id          UUID REFERENCES trainers(id),
    booking_type        booking_type NOT NULL,
    status              booking_status NOT NULL DEFAULT 'PENDING',
    booking_date        DATE NOT NULL,
    start_time          TIME,
    end_time            TIME,
    amount_paid         DECIMAL(10,2) DEFAULT 0,
    credits_used        INT DEFAULT 0,
    qr_token            VARCHAR(255) UNIQUE,
    qr_expires_at       TIMESTAMPTZ,
    checked_in_at       TIMESTAMPTZ,
    checked_out_at      TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    cancellation_reason TEXT,
    reschedule_count    INT DEFAULT 0,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_bookings_user ON bookings(user_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_bookings_gym ON bookings(gym_id, booking_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_bookings_date ON bookings(booking_date, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_bookings_qr_token ON bookings(qr_token);
CREATE INDEX idx_bookings_schedule ON bookings(class_schedule_id) WHERE is_deleted = FALSE;

-- ── PAYMENTS ─────────────────────────────────────────────────

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id),
    booking_id          UUID REFERENCES bookings(id),
    membership_id       UUID REFERENCES user_memberships(id),
    amount              DECIMAL(12,2) NOT NULL,
    gst_amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount     DECIMAL(10,2) DEFAULT 0,
    wallet_amount       DECIMAL(10,2) DEFAULT 0,
    net_amount          DECIMAL(12,2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'INR',
    status              payment_status NOT NULL DEFAULT 'PENDING',
    payment_method      payment_method,
    payment_gateway     payment_gateway,
    gateway_order_id    VARCHAR(255),
    gateway_payment_id  VARCHAR(255),
    gateway_signature   VARCHAR(512),
    coupon_id           UUID,
    coupon_discount     DECIMAL(10,2) DEFAULT 0,
    description         TEXT,
    failure_reason      TEXT,
    refunded_amount     DECIMAL(10,2) DEFAULT 0,
    refunded_at         TIMESTAMPTZ,
    metadata            JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id, status);
CREATE INDEX idx_payments_gateway_order ON payments(gateway_order_id);
CREATE INDEX idx_payments_gateway_payment ON payments(gateway_payment_id);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);

-- ── INVOICES ─────────────────────────────────────────────────

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id      UUID NOT NULL REFERENCES payments(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    invoice_number  VARCHAR(50) NOT NULL UNIQUE,
    subtotal        DECIMAL(12,2) NOT NULL,
    gst_rate        DECIMAL(4,2) NOT NULL DEFAULT 18.0,
    gst_amount      DECIMAL(10,2) NOT NULL,
    discount        DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(12,2) NOT NULL,
    pdf_url         TEXT,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_payment ON invoices(payment_id);

-- ── WALLETS ──────────────────────────────────────────────────

CREATE TABLE wallets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
    balance         DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'INR',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

CREATE TABLE wallet_transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id       UUID NOT NULL REFERENCES wallets(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            transaction_type NOT NULL,
    txn_type        wallet_txn_type NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    balance_before  DECIMAL(12,2) NOT NULL,
    balance_after   DECIMAL(12,2) NOT NULL,
    description     TEXT,
    reference_id    UUID,
    reference_type  VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_txn_user ON wallet_transactions(user_id, created_at DESC);
CREATE INDEX idx_wallet_txn_wallet ON wallet_transactions(wallet_id);

-- ── REWARD POINTS ─────────────────────────────────────────────

CREATE TABLE reward_points (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
    total_earned    INT NOT NULL DEFAULT 0,
    total_redeemed  INT NOT NULL DEFAULT 0,
    balance         INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    tier            VARCHAR(50) DEFAULT 'BRONZE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reward_transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    points          INT NOT NULL,
    type            transaction_type NOT NULL,
    description     VARCHAR(500),
    reference_id    UUID,
    reference_type  VARCHAR(50),
    expires_at      TIMESTAMPTZ,
    is_expired      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reward_points_user ON reward_points(user_id);
CREATE INDEX idx_reward_txn_user ON reward_transactions(user_id, created_at DESC);

-- ── COUPONS ───────────────────────────────────────────────────

CREATE TABLE coupons (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                VARCHAR(50) NOT NULL UNIQUE,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    type                coupon_type NOT NULL,
    value               DECIMAL(10,2) NOT NULL,
    min_purchase        DECIMAL(10,2) DEFAULT 0,
    max_discount        DECIMAL(10,2),
    usage_limit         INT,
    used_count          INT DEFAULT 0,
    max_uses_per_user   INT DEFAULT 1,
    start_date          DATE,
    end_date            DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    applicable_gym_ids  UUID[],
    applicable_plan_ids UUID[],
    created_by_id       UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    is_deleted          BOOLEAN NOT NULL DEFAULT FALSE,
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255)
);

CREATE INDEX idx_coupons_code ON coupons(code) WHERE is_active = TRUE;
CREATE INDEX idx_coupons_validity ON coupons(start_date, end_date) WHERE is_active = TRUE;

CREATE TABLE coupon_usages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id   UUID NOT NULL REFERENCES coupons(id),
    user_id     UUID NOT NULL REFERENCES users(id),
    payment_id  UUID REFERENCES payments(id),
    discount    DECIMAL(10,2) NOT NULL,
    used_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(coupon_id, user_id, payment_id)
);

CREATE INDEX idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user ON coupon_usages(user_id);

-- ── NOTIFICATIONS ─────────────────────────────────────────────

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            notification_type NOT NULL,
    channel         notification_channel NOT NULL,
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    data            JSONB,
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    failure_reason  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);

-- ── REVIEWS ──────────────────────────────────────────────────

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    gym_id          UUID REFERENCES gyms(id),
    trainer_id      UUID REFERENCES trainers(id),
    booking_id      UUID REFERENCES bookings(id),
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           VARCHAR(255),
    body            TEXT,
    photos          TEXT[],
    status          review_status NOT NULL DEFAULT 'PENDING',
    is_verified     BOOLEAN DEFAULT FALSE,
    helpful_count   INT DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_reviews_gym ON reviews(gym_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_reviews_trainer ON reviews(trainer_id, status) WHERE is_deleted = FALSE;
CREATE INDEX idx_reviews_user ON reviews(user_id) WHERE is_deleted = FALSE;

CREATE TABLE review_responses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id   UUID NOT NULL UNIQUE REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES users(id),
    body        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── REFERRALS ─────────────────────────────────────────────────

CREATE TABLE referrals (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id         UUID NOT NULL REFERENCES users(id),
    referee_id          UUID REFERENCES users(id),
    referral_code       VARCHAR(20) NOT NULL,
    status              VARCHAR(50) DEFAULT 'PENDING',
    referrer_rewarded   BOOLEAN DEFAULT FALSE,
    referee_rewarded    BOOLEAN DEFAULT FALSE,
    referrer_points     INT DEFAULT 0,
    referee_points      INT DEFAULT 0,
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON referrals(referee_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);

-- ── SUPPORT TICKETS ───────────────────────────────────────────

CREATE TABLE support_tickets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    ticket_number   VARCHAR(20) NOT NULL UNIQUE,
    subject         VARCHAR(500) NOT NULL,
    category        VARCHAR(100),
    status          ticket_status NOT NULL DEFAULT 'OPEN',
    priority        ticket_priority NOT NULL DEFAULT 'MEDIUM',
    assigned_to_id  UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    closed_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status, priority);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to_id, status);

CREATE TABLE support_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id   UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES users(id),
    message     TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_messages_ticket ON support_messages(ticket_id, created_at);

-- ── CMS PAGES ─────────────────────────────────────────────────

CREATE TABLE cms_pages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug        VARCHAR(255) NOT NULL UNIQUE,
    title       VARCHAR(500) NOT NULL,
    content     TEXT,
    meta_title  VARCHAR(500),
    meta_desc   TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_by  UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug) WHERE is_active = TRUE;

-- ── ANALYTICS EVENTS ──────────────────────────────────────────

CREATE TABLE analytics_events (
    id              UUID DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    event_name      VARCHAR(255) NOT NULL,
    entity_type     VARCHAR(100),
    entity_id       UUID,
    properties      JSONB,
    ip_address      VARCHAR(50),
    user_agent      TEXT,
    session_id      VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_events_2024 PARTITION OF analytics_events
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE analytics_events_2025 PARTITION OF analytics_events
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE analytics_events_2026 PARTITION OF analytics_events
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_event ON analytics_events(event_name, created_at DESC);

-- ── AUDIT LOGS ────────────────────────────────────────────────

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id        UUID REFERENCES users(id),
    actor_email     VARCHAR(255),
    action          audit_action NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      VARCHAR(50),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);

-- ── FAVORITE GYMS ─────────────────────────────────────────────

CREATE TABLE favorite_gyms (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id      UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, gym_id)
);

CREATE INDEX idx_favorite_gyms_user ON favorite_gyms(user_id);

-- ── AI RECOMMENDATIONS ────────────────────────────────────────

CREATE TABLE ai_recommendations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(50) NOT NULL,
    content         JSONB NOT NULL,
    model_version   VARCHAR(50),
    feedback        VARCHAR(50),
    is_dismissed    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_recommendations_user ON ai_recommendations(user_id, type, created_at DESC);

-- ── TRIGGERS ─────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'user_profiles', 'gyms', 'gym_branches', 'trainers',
        'fitness_classes', 'membership_plans', 'user_memberships',
        'bookings', 'reviews', 'coupons', 'support_tickets', 'wallets',
        'reward_points', 'cms_pages', 'trainer_schedules', 'class_schedules'
    ] LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s
             FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
            tbl, tbl
        );
    END LOOP;
END;
$$;

-- Auto-create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    INSERT INTO reward_points (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_wallet_on_user
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Update gym avg_rating on review approval
CREATE OR REPLACE FUNCTION update_gym_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.gym_id IS NOT NULL AND NEW.status = 'APPROVED' THEN
        UPDATE gyms SET
            avg_rating = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews
                          WHERE gym_id = NEW.gym_id AND status = 'APPROVED' AND is_deleted = FALSE),
            total_reviews = (SELECT COUNT(*) FROM reviews
                             WHERE gym_id = NEW.gym_id AND status = 'APPROVED' AND is_deleted = FALSE)
        WHERE id = NEW.gym_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_gym_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_gym_rating();

-- Increment booked_count on booking confirmation
CREATE OR REPLACE FUNCTION update_class_booked_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.class_schedule_id IS NOT NULL THEN
        IF NEW.status = 'CONFIRMED' AND (OLD.status IS NULL OR OLD.status != 'CONFIRMED') THEN
            UPDATE class_schedules SET booked_count = booked_count + 1
            WHERE id = NEW.class_schedule_id;
        ELSIF OLD.status = 'CONFIRMED' AND NEW.status = 'CANCELLED' THEN
            UPDATE class_schedules SET booked_count = GREATEST(0, booked_count - 1)
            WHERE id = NEW.class_schedule_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_class_count
AFTER INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_class_booked_count();
