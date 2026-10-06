-- ========================================================
-- SAEIS - Automated Credit Scoring & Risk Engine Schema
-- ========================================================

CREATE TABLE saeis_clients (
    client_id INT PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    total_receivables DECIMAL(18,2) DEFAULT 0.00,
    credit_limit DECIMAL(18,2) DEFAULT 0.00,
    allowed_credit_days INT DEFAULT 30,
    dso_days INT DEFAULT 0,
    cpr_rate DECIMAL(5,2) DEFAULT 0.00,
    overdue_90_days_count INT DEFAULT 0,
    risk_category CHAR(1) CHECK (risk_category IN ('A', 'B', 'C', 'D')),
    action_status VARCHAR(255),
    recommended_credit_limit DECIMAL(18,2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- فهرس لتحسين أداء الاستعلام والربط مع نظام الـ ERP
CREATE INDEX idx_risk_category ON saeis_clients(risk_category);