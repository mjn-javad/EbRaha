CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    brand VARCHAR(255) NOT NULL,

    model VARCHAR(255) NOT NULL
        COMMENT 'مدل یا نام سری محصول از برند مربوطه',

    category ENUM(
        'sneaker',
        'loafer',
        'formal',
        'boot',
        'sandal',
        'sport',
        'classic',
        'heels',
        'flat',
        'other'
    ) NOT NULL DEFAULT 'other'
        COMMENT 'دسته‌بندی محصول',

    gender ENUM(
        'male',
        'female',
        'genderless'
    ) NOT NULL
        COMMENT 'جنسیت هدف محصول',

    type ENUM(
        'shoe',
        'bag',
        'luggage',
        'glasses',
        'watch',
        'clothes',
        'accessories',
        'limited_edition'
    ) NOT NULL DEFAULT 'shoe'
        COMMENT 'نوع محصول',

    price DECIMAL(10,2) NOT NULL,

    discount_price DECIMAL(10,2) DEFAULT NULL,

    description TEXT DEFAULT NULL,

    colors VARCHAR(500) DEFAULT NULL
        COMMENT 'رنگ محصول به صورت رشته (مثلاً قرمز, صورتی, نود)',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_brand (brand),
    INDEX idx_model (model),
    INDEX idx_category (category),
    INDEX idx_gender (gender),
    INDEX idx_type (type),
    INDEX idx_price (price),
    INDEX idx_slug (slug),
    INDEX idx_brand_model (brand, model),
    INDEX idx_category_gender (category, gender),
    INDEX idx_type_category (type, category),
    INDEX idx_type_gender (type, gender)

) ENGINE=InnoDB
AUTO_INCREMENT=10
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
