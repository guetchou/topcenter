
-- Insertion des utilisateurs par défaut avec mots de passe hashés
-- Note: Ces mots de passe sont 'password123' hashés avec bcrypt
INSERT INTO users (email, password, full_name, role, created_at) 
VALUES 
('master@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Master Admin', 'master_admin', NOW()),
('super@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Super Admin', 'super_admin', NOW()),
('admin@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Admin', 'admin', NOW()),
('commercial@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Agent Commercial', 'commercial_agent', NOW()),
('support@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Agent Support', 'support_agent', NOW()),
('client@topcenter.app', '$2b$10$zDZDNl6F3XBDnDYVpRHqe.I3lhbDkGbYoKCsj4GnDkj1jGEZfbXdK', 'Client', 'client', NOW());

-- Mise à jour du schéma de la table users pour inclure tous les rôles possibles
ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'super_admin', 'master_admin', 'commercial_agent', 'support_agent', 'client') DEFAULT 'client';
