
-- Migration pour créer la table des déploiements
CREATE TABLE IF NOT EXISTS deployments (
  id VARCHAR(36) PRIMARY KEY,
  user_id INT NOT NULL,
  repository VARCHAR(255) NOT NULL,
  branch VARCHAR(100) DEFAULT 'main',
  commit_hash VARCHAR(40) NULL,
  status ENUM('pending', 'running', 'success', 'failed', 'cancelled') DEFAULT 'pending',
  logs TEXT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  duration INT NULL, -- en secondes
  error_message TEXT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_started_at (started_at)
);
