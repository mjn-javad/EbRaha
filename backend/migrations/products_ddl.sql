CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    brand VARCHAR(255) NOT NULL,

    model VARCHAR(255) NOT NULL
        COMMENT 'مدل یا نام سری محصول از برند مربوطه',

    category ENUM(
        'makeup',
        'skincare',
        'haircare',
        'bodycare',
        'fragrance',
        'personal_care',
        'beauty_tools',
        'other'
    ) NOT NULL DEFAULT 'other'
        COMMENT 'دسته‌بندی اصلی محصول',

    gender ENUM(
        'female',
        'unisex'
    ) NOT NULL
        COMMENT 'مناسب برای خانم‌ها یا استفاده عمومی',

    type ENUM(
        'foundation',
        'concealer',
        'powder',
        'blush',
        'bronzer',
        'highlighter',
        'eyeshadow',
        'eyeliner',
        'mascara',
        'lipstick',
        'lip_gloss',
        'lip_liner',
        'makeup_remover',
        'cleanser',
        'toner',
        'serum',
        'moisturizer',
        'face_cream',
        'face_mask',
        'sunscreen',
        'shampoo',
        'conditioner',
        'hair_mask',
        'hair_oil',
        'body_lotion',
        'body_cream',
        'body_wash',
        'hand_cream',
        'scrub',
        'perfume',
        'body_mist',
        'deodorant',
        'feminine_care',
        'makeup_brush',
        'makeup_sponge',
        'beauty_tool',
        'other'
    ) NOT NULL DEFAULT 'other'
        COMMENT 'نوع محصول آرایشی یا بهداشتی',

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
