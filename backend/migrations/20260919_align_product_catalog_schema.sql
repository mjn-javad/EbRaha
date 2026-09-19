-- Run once on an existing database before importing the legacy MahShop catalog.
-- The first ALTER temporarily accepts both the incorrect cosmetics values and
-- the fashion values, so this migration is safe for populated databases too.

ALTER TABLE products
    MODIFY COLUMN category ENUM(
        'makeup', 'skincare', 'haircare', 'bodycare', 'fragrance',
        'personal_care', 'beauty_tools',
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
    ) NULL DEFAULT NULL COMMENT 'دسته‌بندی محصول',
    MODIFY COLUMN gender ENUM(
        'male',
        'female',
        'genderless',
        'unisex'
    ) NOT NULL COMMENT 'جنسیت هدف محصول',
    MODIFY COLUMN type ENUM(
        'foundation', 'concealer', 'powder', 'blush', 'bronzer',
        'highlighter', 'eyeshadow', 'eyeliner', 'mascara', 'lipstick',
        'lip_gloss', 'lip_liner', 'makeup_remover', 'cleanser', 'toner',
        'serum', 'moisturizer', 'face_cream', 'face_mask', 'sunscreen',
        'shampoo', 'conditioner', 'hair_mask', 'hair_oil', 'body_lotion',
        'body_cream', 'body_wash', 'hand_cream', 'scrub', 'perfume',
        'body_mist', 'deodorant', 'feminine_care', 'makeup_brush',
        'makeup_sponge', 'beauty_tool', 'other',
        'shoe',
        'belt',
        'bag',
        'luggage',
        'glasses',
        'watch',
        'clothes',
        'accessories',
        'limited_edition'
    ) NOT NULL DEFAULT 'shoe' COMMENT 'نوع محصول';

UPDATE products
SET category = 'other'
WHERE category IS NULL
   OR category NOT IN (
       'sneaker', 'loafer', 'formal', 'boot', 'sandal',
       'sport', 'classic', 'heels', 'flat', 'other'
   );

UPDATE products SET gender = 'genderless' WHERE gender = 'unisex';
UPDATE products SET type = 'accessories' WHERE type = 'belt';
UPDATE products
SET type = 'shoe'
WHERE type NOT IN (
    'shoe', 'bag', 'luggage', 'glasses', 'watch',
    'clothes', 'accessories', 'limited_edition'
);

ALTER TABLE products
    MODIFY COLUMN category ENUM(
        'sneaker', 'loafer', 'formal', 'boot', 'sandal',
        'sport', 'classic', 'heels', 'flat', 'other'
    ) NOT NULL DEFAULT 'other' COMMENT 'دسته‌بندی محصول',
    MODIFY COLUMN gender ENUM(
        'male', 'female', 'genderless'
    ) NOT NULL COMMENT 'جنسیت هدف محصول',
    MODIFY COLUMN type ENUM(
        'shoe', 'bag', 'luggage', 'glasses', 'watch',
        'clothes', 'accessories', 'limited_edition'
    ) NOT NULL DEFAULT 'shoe' COMMENT 'نوع محصول';

ALTER TABLE products_stock
    MODIFY COLUMN stock VARCHAR(32) NOT NULL;
