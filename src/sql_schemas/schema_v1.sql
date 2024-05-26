CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_no VARCHAR(20) UNIQUE,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    props JSONB,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL
);


CREATE TABLE user_passwords (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    website_name VARCHAR(255) NOT NULL,
    website_link VARCHAR(255) NOT NULL,
    website_user_name VARCHAR(255) NOT NULL,
    website_user_password VARCHAR(255) NOT NULL,
    website_logo_link TEXT,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    category_id BIGINT,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
    CONSTRAINT UNQ_website_user_password UNIQUE (user_id, website_link, website_user_name)
);

CREATE TABLE access_tokens (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_on TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_name ON users(user_name);
CREATE INDEX idx_user_passwords_user_id ON user_passwords(user_id);
CREATE INDEX idx_user_passwords_category_id ON user_passwords(category_id);
CREATE INDEX idx_user_passwords_unique ON user_passwords(user_id, website_link, website_user_name);


