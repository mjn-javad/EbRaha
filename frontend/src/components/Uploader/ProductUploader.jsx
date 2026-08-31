import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiClientProducts from "../../services/api-client_products";
import apiClientBrand from "../../services/api-client_brand";

import MessageAlert from "../Shared/MessageAlert";
import InputField from "../Shared/InputField";
import LoadingSpinner from "../Shared/LoadingSpinner";

const initialForm = {
  type: "",
  brand: "",
  model: "",
  category: "",
  gender: "",
  price: "",
  discount_price: "",
  description: "",
  colors: "",
};

const ProductUploader = () => {
  /*
   * این productId آیدی محصول قبلی است که کاربر
   * از صفحه آن روی Add color کلیک کرده است.
   */
  const { productId } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [files, setFiles] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  /*
   * دریافت لیست برندها
   */
  useEffect(() => {
    let active = true;

    const fetchBrands = async () => {
      try {
        const res = await apiClientBrand.get("");

        if (active) {
          setBrands(res.data?.data || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "There was a problem retrieving brands",
          );
        }
      }
    };

    fetchBrands();

    return () => {
      active = false;
    };
  }, []);

  /*
   * اگر productId داخل URL وجود داشته باشد،
   * اطلاعات محصول قبلی دریافت و داخل فرم قرار می‌گیرد.
   */
  useEffect(() => {
    if (!productId) {
      setForm(initialForm);
      setFiles([]);
      return;
    }

    let active = true;

    const fetchProduct = async () => {
      try {
        setIsProductLoading(true);
        setError("");
        setMessage("");

        const res = await apiClientProducts.get(`/${productId}`);

        const product = res.data?.data || res.data;

        if (!active || !product) return;

        setForm({
          type: product.type || "",

          brand: product.brand,

          model: product.model || "",
          category: product.category || "",
          gender: product.gender || "",
          price: product.price ?? "",
          discount_price: product.discount_price ?? "",
          description: product.description || "",

          // رنگ محصول جدید باید توسط ادمین وارد شود
          colors: "",
        });

        // تصاویر محصول قبلی منتقل نمی‌شوند
        setFiles([]);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "There was a problem retrieving product information",
          );
        }
      } finally {
        if (active) {
          setIsProductLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  const handleChange = (nameKey, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [nameKey]: value,
    }));
  };

  const handleFileChange = (event) => {
    if (!event.target.files) return;

    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await apiClientProducts.post("/", formData);

      // دریافت آیدی محصول جدید از پاسخ بک‌اند
      const newProductId = res.data?.data?.productId;

      // نمایش پیام موفقیت
      setMessage(
        res.data?.message ||
          (productId
            ? "New color created successfully. Redirecting..."
            : "Product created successfully. Redirecting..."),
      );

      setFiles([]);

      // دو ثانیه صبر برای نمایش پیام
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      // انتقال به صفحه ویرایش محصول جدید
      navigate(`/admin/dashboard/editProduct/${newProductId}`, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (productId
            ? "Error creating new product color"
            : "Error creating product"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container my-5 text-center">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md flex-col gap-y-4"
      >
        <h2 className="mb-2 text-xl font-semibold">
          {productId ? "Add New Color" : "Create Product"}
        </h2>

        <div>
          <label htmlFor="type">Type</label>

          <select
            id="type"
            name="type"
            value={form.type}
            onChange={(event) =>
              handleChange(event.target.name, event.target.value)
            }
            className="mx-2 rounded-sm bg-gray-200 text-sm"
            required
          >
            <option value="">Select Type</option>
            <option value="shoe">Shoe</option>
            <option value="belt">Belt</option>
            <option value="bag">Bag</option>
            <option value="luggage">Luggage</option>
            <option value="glasses">Glasses</option>
            <option value="watch">Watch</option>
            <option value="clothes">Clothes</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label htmlFor="brand">Brand</label>

          <select
            id="brand"
            name="brand"
            value={form.brand}
            onChange={(event) =>
              handleChange(event.target.name, event.target.value)
            }
            className="mx-2 rounded-sm bg-gray-200 text-sm"
            required
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option
                key={brand.id || brand._id || brand.slug}
                value={brand.slug}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {form.type === "product" && (
          <div>
            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={(event) =>
                handleChange(event.target.name, event.target.value)
              }
              className="mx-2 rounded-sm bg-gray-200 text-sm"
              required
            >
              <option value="">Select Category</option>
              <option value="sneaker">Sneaker</option>
              <option value="loafer">Loafer</option>
              <option value="formal">Formal</option>
              <option value="boot">Boot</option>
              <option value="sandal">Sandal</option>
              <option value="sport">Sport</option>
              <option value="classic">Classic</option>
              <option value="heels">Heels</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="gender">Gender</label>

          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={(event) =>
              handleChange(event.target.name, event.target.value)
            }
            className="mx-2 rounded-sm bg-gray-200"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="genderless">Genderless</option>
          </select>
        </div>

        <InputField
          name="model"
          label="Model"
          value={form.model}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
          required={true}
          placeholder="e.g., Air Max 97, Superstar, etc."
        />

        <InputField
          name="price"
          label="Price"
          type="number"
          value={form.price}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
          required={true}
        />

        <InputField
          name="discount_price"
          label="Discount Price"
          type="number"
          value={form.discount_price}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
        />

        <InputField
          name="colors"
          label={productId ? "New Color" : "Colors (comma separated)"}
          value={form.colors}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
          placeholder={productId ? "e.g., black" : "e.g., red, blue, black"}
          required={Boolean(productId)}
        />

        <InputField
          name="description"
          label="Description"
          value={form.description}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
        />

        <div>
          <label htmlFor="product-images" className="mb-2 block">
            Images
          </label>

          <input
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-2xl bg-gray-500 px-5 py-2 duration-200 hover:bg-gray-400"
          />

          {files.length > 0 && (
            <p className="mt-2 text-sm">{files.length} file(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`rounded px-4 py-2 text-white ${
            isLoading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading
            ? message
              ? "Redirecting..."
              : "Creating..."
            : productId
              ? "Add New Color"
              : "Create Product"}
        </button>

        {message && <MessageAlert message={message} type="success" />}

        {error && <MessageAlert message={error} type="error" />}
      </form>
    </div>
  );
};

export default ProductUploader;
