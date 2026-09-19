# انتقال محصولات MahShop

این فرایند هر دو ساختار قدیمی `shoes*` و ساختار جدیدتر
`products / product_images / product_stocks` را خودکار تشخیص می‌دهد و داده‌ها را
به `products`، `products_images` و `products_stock` منتقل می‌کند.

واردکننده بر اساس `slug` محصول را پیدا می‌کند، بنابراین اجرای دوبارهٔ آن محصول
تکراری ایجاد نمی‌کند. پسوند تصاویر به `.webp` تبدیل می‌شود، `belt` به
`accessories` نگاشت می‌شود و کل عملیات دیتابیس داخل یک transaction انجام می‌شود.

## ترتیب اجرای سرور

1. از دیتابیس مقصد بکاپ کامل بگیرید.
2. نسخهٔ جدید پروژه و پوشه `backend/public/images/posts` را deploy کنید.
3. schema را با فرمان زیر اصلاح کنید:

   ```bash
   mysql -h YOUR_DB_HOST -P YOUR_DB_PORT -u YOUR_DB_USER -p YOUR_DB_NAME < backend/migrations/20260919_align_product_catalog_schema.sql
   ```

4. فایل `MahShop_2026-09-19.sql` را موقتاً روی سرور بگذارید؛ بهتر است بیرون از
   پوشه عمومی سایت باشد.
5. ابتدا Dry-run را از پوشه `backend` اجرا کنید:

   ```bash
   node scripts/importLegacyProducts.js \
     --source /secure/path/MahShop_2026-09-19.sql \
     --images-dir public/images/posts
   ```

6. اگر تعدادها `1080 / 3444 / 3373` و تعداد تصاویر مفقود `0` بود، واردسازی واقعی
   را اجرا کنید:

   ```bash
   node scripts/importLegacyProducts.js \
     --source /secure/path/MahShop_2026-09-19.sql \
     --images-dir public/images/posts \
     --apply
   ```

7. بعد از پیام `Import committed successfully` چند محصول، ترتیب تصاویر و موجودی
   سایزها را در پنل مدیریت بررسی کنید و سپس فایل SQL موقت را از سرور حذف کنید.

اگر تصاویر مفقود باشند، حالت `--apply` به‌صورت پیش‌فرض متوقف می‌شود. گزینه
`--allow-missing-images` فقط برای مواقعی است که آگاهانه می‌خواهید محصولی بدون
فایل تصویر وارد شود.
