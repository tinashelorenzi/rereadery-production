-- Ratings table for storing user ratings and reviews
CREATE TABLE ratings (
    rating_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    rater_id VARCHAR(36) NOT NULL,
    ratee_id VARCHAR(36) NOT NULL,
    rating_score TINYINT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    rating_type ENUM('buyer_to_seller', 'seller_to_buyer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (rater_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ratee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_order_rating (order_id, rating_type),
    INDEX idx_order (order_id),
    INDEX idx_rater (rater_id),
    INDEX idx_ratee (ratee_id),
    INDEX idx_rating_type (rating_type)
);

-- UserTrustScores table for maintaining aggregated user trustworthiness
CREATE TABLE user_trust_scores (
    user_id VARCHAR(36) PRIMARY KEY,
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_ratings INT DEFAULT 0,
    positive_ratings INT DEFAULT 0,
    negative_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_average_rating (average_rating)
);

-- Trigger to update user trust scores after new rating
DELIMITER //
CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE user_trust_scores
    SET 
        total_ratings = total_ratings + 1,
        positive_ratings = positive_ratings + IF(NEW.rating_score >= 4, 1, 0),
        negative_ratings = negative_ratings + IF(NEW.rating_score <= 2, 1, 0),
        average_rating = (
            SELECT AVG(rating_score)
            FROM ratings
            WHERE ratee_id = NEW.ratee_id
        )
    WHERE user_id = NEW.ratee_id;
    
    -- Insert new trust score record if it doesn't exist
    INSERT IGNORE INTO user_trust_scores (user_id, total_ratings, positive_ratings, negative_ratings)
    VALUES (NEW.ratee_id, 1, IF(NEW.rating_score >= 4, 1, 0), IF(NEW.rating_score <= 2, 1, 0));
END //
DELIMITER ;
