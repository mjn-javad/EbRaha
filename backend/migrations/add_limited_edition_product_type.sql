ALTER TABLE products
MODIFY COLUMN type ENUM(
  'shoe',
  'bag',
  'luggage',
  'glasses',
  'watch',
  'clothes',
  'accessories',
  'limited_edition'
)
NOT NULL DEFAULT 'shoe'
COMMENT 'نوع محصول: کفش، کمربند، کیف، صندوق مسافرتی یا عینک';
