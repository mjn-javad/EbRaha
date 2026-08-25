-- جدول کامل products_images با فیلد sort_order
CREATE TABLE products_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    products_id INT NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (products_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_sort_order (sort_order),
    INDEX idx_products_id (products_id)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;