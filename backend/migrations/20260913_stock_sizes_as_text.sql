-- Run this once on an existing database before deploying the matching backend.
-- INT(10) only accepts numbers; clothing sizes such as S, M, L and XL need text.

ALTER TABLE products_stock
    MODIFY COLUMN stock VARCHAR(32) NOT NULL;

ALTER TABLE cart_items
    MODIFY COLUMN stock VARCHAR(32) NOT NULL;

ALTER TABLE order_items
    MODIFY COLUMN stock VARCHAR(32) NOT NULL;
