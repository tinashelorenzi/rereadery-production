-- Cart table to track items in users' carts and their timer status
CREATE TABLE cart_items (
    cart_item_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timer_status ENUM('active', 'warning', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    INDEX idx_timer_status (timer_status),
    INDEX idx_last_activity (last_activity)
);

-- Wishlist table to track saved books
CREATE TABLE wishlist_items (
    wishlist_item_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    added_from_cart BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_user (user_id),
    INDEX idx_book (book_id)
);

-- Book recommendations table for suggesting similar books
CREATE TABLE book_recommendations (
    recommendation_id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(36) NOT NULL,
    recommended_book_id VARCHAR(36) NOT NULL,
    similarity_score DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    UNIQUE KEY unique_book_recommendation (book_id, recommended_book_id),
    INDEX idx_book (book_id),
    INDEX idx_recommended_book (recommended_book_id),
    INDEX idx_similarity (similarity_score)
);
