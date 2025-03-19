
-- Tables pour le système de traduction

CREATE TABLE IF NOT EXISTS languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lang_code VARCHAR(10) NOT NULL UNIQUE,
  lang_name VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lang_code VARCHAR(10) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_translation (lang_code, `key`),
  FOREIGN KEY (lang_code) REFERENCES languages(lang_code) ON DELETE CASCADE
);

-- Tables pour les analyses prédictives

CREATE TABLE IF NOT EXISTS call_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_id INT,
  client_id INT,
  status ENUM('missed', 'completed', 'transferred') NOT NULL,
  duration INT DEFAULT 0, -- en secondes
  call_type ENUM('incoming', 'outgoing') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS customer_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  call_id INT,
  client_id INT,
  agent_id INT,
  satisfaction_score DECIMAL(2,1) NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (call_id) REFERENCES call_logs(id) ON DELETE SET NULL,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  source VARCHAR(50),
  status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
  agent_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tables pour l'intégration CRM

CREATE TABLE IF NOT EXISTS crm_systems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('zoho', 'salesforce', 'hubspot', 'custom') NOT NULL,
  api_url VARCHAR(255),
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  sync_frequency ENUM('hourly', 'daily', 'weekly') DEFAULT 'daily',
  sync_enabled BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_sync_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crm_system_id INT NOT NULL,
  direction ENUM('to_crm', 'from_crm', 'bidirectional') NOT NULL,
  status ENUM('success', 'partial', 'failed') NOT NULL,
  statistics JSON,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crm_system_id) REFERENCES crm_systems(id) ON DELETE CASCADE
);

-- Tables pour le système de rendez-vous

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INT DEFAULT 60, -- en minutes
  price DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  agent_id INT,
  service_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INT DEFAULT 60, -- en minutes
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS business_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week INT NOT NULL, -- 0 = Dimanche, 1 = Lundi, etc.
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_day (day_of_week)
);

-- Tables pour le dashboard administrateur

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS generated_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  report_title VARCHAR(255) NOT NULL,
  parameters JSON,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  value_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Données initiales pour les tables

-- Langues par défaut
INSERT INTO languages (lang_code, lang_name, active) VALUES
('fr', 'Français', TRUE),
('en', 'English', TRUE),
('ln', 'Lingala', TRUE),
('kg', 'Kituba', TRUE);

-- Heures d'ouverture par défaut
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES
(0, NULL, NULL, TRUE), -- Dimanche fermé
(1, '08:00', '17:00', FALSE), -- Lundi
(2, '08:00', '17:00', FALSE), -- Mardi
(3, '08:00', '17:00', FALSE), -- Mercredi
(4, '08:00', '17:00', FALSE), -- Jeudi
(5, '08:00', '17:00', FALSE), -- Vendredi
(6, '09:00', '13:00', FALSE); -- Samedi

-- Services par défaut
INSERT INTO services (name, description, duration, price, active) VALUES
('Consultation Initiale', 'Première prise de contact pour évaluer vos besoins', 30, 0.00, TRUE),
('Présentation des Services', 'Présentation détaillée de nos offres adaptées à votre entreprise', 60, 0.00, TRUE),
('Audit de Communication', 'Analyse complète de votre stratégie de communication client', 90, 50000.00, TRUE),
('Formation Agent', 'Formation pour vos équipes internes', 120, 75000.00, TRUE);

-- Paramètres système par défaut
INSERT INTO system_settings (setting_key, setting_value, value_type, description) VALUES
('company_name', 'TopCenter SARL', 'string', 'Nom de l\'entreprise'),
('contact_email', 'contact@topcenter.cg', 'string', 'Email de contact principal'),
('contact_phone', '+242 06 449 5353', 'string', 'Téléphone de contact principal'),
('session_timeout', '30', 'number', 'Délai d\'expiration de session en minutes'),
('enable_email_notifications', 'true', 'boolean', 'Activer les notifications par email'),
('appointment_reminder_time', '24', 'number', 'Heures avant le rendez-vous pour envoyer un rappel'),
('max_failed_login_attempts', '5', 'number', 'Nombre maximal de tentatives de connexion échouées avant blocage');
