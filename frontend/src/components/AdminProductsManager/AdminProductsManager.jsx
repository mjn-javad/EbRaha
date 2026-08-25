// AdminSingleProductManagement.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClientProducts from "../../services/api-client_products";
import apiClientBrandPopular from "../../services/api-client";

import LoadingSpinner from "../Shared/LoadingSpinner";
import MessageAlert from "../Shared/MessageAlert";
import ProductInfoForm from "./ProductInfoForm";
import SizesStockManager from "./SizesStockManager";
import ImagesManager from "./ImagesManager";

const AdminSingleProductManagement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [productInfo, setProductInfo] = useState({
    name: "",
    slug: "",
    brand: "",
    model: "",
    category: "",
    gender: "",
    type: "",
    price: "",
    discountPrice: "",
    description: "",
    colors: "",
  });

  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);

      const response = await apiClientProducts.get(`/${productId}`);
      const product = response.data.data;

      setProductInfo({
        name: product.name ?? "",
        slug: product.slug ?? "",
        brand: product.brand ?? "",
        model: product.model ?? "",
        category: product.category ?? "",
        gender: product.gender ?? "genderless",
        type: product.type ?? "product",
        price: product.price ?? "",
        discountPrice: product.discount_price ?? "",
        description: product.description ?? "",
        colors: product.colors ?? "",
      });

      const sizesArray =
        product.sizes && Array.isArray(product.sizes)
          ? product.sizes.map((item) => ({
              size: item.size,
              quantity: item.quantity,
            }))
          : [];

      setSizes(sizesArray);
      setImages(product.images || []);
      setNewImages([]);
      setDeletedImages([]);
      setError("");
    } catch (err) {
      console.error("Error fetching product data:", err);
      showError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;

    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToNewArrivals = async () => {
    try {
      setUpdating(true);

      await apiClientBrandPopular.post(`/newArrivels/${productId}`);

      showSuccess(`"${productInfo.name}" added to new arrivals`);
    } catch (err) {
      console.error("Error adding to new arrivals:", err);
      showError(err.response?.data?.message || "Error adding to new arrivals");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateInfo = async () => {
    if (!productInfo.name.trim()) {
      showError("Product name is required");
      return;
    }

    if (!productInfo.slug.trim()) {
      showError("Product slug is required");
      return;
    }

    if (!productInfo.brand.trim()) {
      showError("Product brand is required");
      return;
    }

    if (!productInfo.model.trim()) {
      showError("Product model is required");
      return;
    }

    if (!productInfo.price || Number(productInfo.price) <= 0) {
      showError("Please enter a valid price");
      return;
    }

    if (
      productInfo.discountPrice !== "" &&
      productInfo.discountPrice !== null &&
      Number(productInfo.discountPrice) < 0
    ) {
      showError("Discount price cannot be negative");
      return;
    }

    try {
      setUpdating(true);

      const payload = {
        name: productInfo.name.trim(),
        slug: productInfo.slug.trim(),
        brand: productInfo.brand.trim(),
        model: productInfo.model.trim(),
        category: productInfo.category,
        gender: productInfo.gender,
        type: productInfo.type,
        price: Number(productInfo.price),
        discountPrice:
          productInfo.discountPrice === "" ||
          productInfo.discountPrice === null ||
          productInfo.discountPrice === undefined
            ? Number(productInfo.price)
            : Number(productInfo.discountPrice),
        description: productInfo.description?.trim() || null,
        colors: productInfo.colors?.trim() || null,
      };

      await apiClientProducts.put(`/${productId}/info`, payload);

      showSuccess("Product information updated successfully");
    } catch (err) {
      console.error("Error updating product info:", err);
      showError(err.response?.data?.message || "Failed to update product info");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddStock = async (size, currentQuantity) => {
    const addedStock = prompt(
      `Current stock for size ${size}: ${currentQuantity}\nEnter the stock amount you want to add:`,
      1,
    );

    if (!addedStock || isNaN(addedStock) || parseInt(addedStock) <= 0) {
      showError("Please enter a valid quantity");
      return;
    }

    try {
      setUpdating(true);

      await apiClientProducts.patch(`/${productId}/stock/${size}`, {
        size,
        quantity: parseInt(addedStock),
      });

      const updatedQuantity = parseInt(currentQuantity) + parseInt(addedStock);

      setSizes((prev) =>
        prev.map((item) =>
          item.size === size
            ? {
                ...item,
                quantity: updatedQuantity,
              }
            : item,
        ),
      );

      showSuccess(`Stock for size ${size} updated to ${updatedQuantity}`);
    } catch (err) {
      console.error("Error updating stock:", err);
      showError(err.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNewSize = async (newSizeData) => {
    if (!newSizeData.size) {
      showError("Please enter a size");
      return;
    }

    if (
      newSizeData.quantity === "" ||
      newSizeData.quantity === null ||
      isNaN(newSizeData.quantity) ||
      parseInt(newSizeData.quantity) < 0
    ) {
      showError("Please enter a valid quantity");
      return;
    }

    const exists = sizes.some(
      (item) => String(item.size) === String(newSizeData.size),
    );

    if (exists) {
      showError(`Size ${newSizeData.size} already exists`);
      return;
    }

    try {
      setUpdating(true);

      await apiClientProducts.patch(`/${productId}/stock/${newSizeData.size}`, {
        size: newSizeData.size,
        quantity: parseInt(newSizeData.quantity),
      });

      setSizes((prev) => [
        ...prev,
        {
          size: newSizeData.size,
          quantity: parseInt(newSizeData.quantity),
        },
      ]);

      showSuccess(`New size ${newSizeData.size} added successfully`);
    } catch (err) {
      console.error("Error adding new size:", err);
      showError(err.response?.data?.message || "Failed to add new size");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleDeleteImage = (image) => {
    setDeletedImages((prev) => [...prev, image]);

    setImages((prev) =>
      prev.filter((img) => {
        const currentImageKey = img.id || img.image_name || img;
        const deletedImageKey = image.id || image.image_name || image;

        return currentImageKey !== deletedImageKey;
      }),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSortOrder = (image, newSortOrder) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        const currentImageKey = img.id || img.image_name;
        const targetImageKey = image.id || image.image_name;

        if (currentImageKey === targetImageKey) {
          return {
            ...img,
            sort_order: newSortOrder,
          };
        }

        return img;
      }),
    );
  };

  const handleSaveSortOrder = async (imageName, newSortOrder) => {
    if (!imageName) {
      showError("Image name is required");
      return;
    }

    if (
      newSortOrder === "" ||
      newSortOrder === null ||
      isNaN(newSortOrder) ||
      parseInt(newSortOrder) < 0
    ) {
      showError("Please enter a valid sort order");
      return;
    }

    try {
      setUpdating(true);

      await apiClientProducts.put(`/${productId}/images/sort-order`, {
        imageName,
        sortOrder: parseInt(newSortOrder),
      });

      showSuccess(`Sort order updated successfully for image ${imageName}`);
    } catch (err) {
      console.error("Error saving sort order:", err);
      showError(err.response?.data?.message || "Failed to update sort order");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateImages = async () => {
    if (newImages.length === 0 && deletedImages.length === 0) {
      showError("No changes to images");
      return;
    }

    const formData = new FormData();

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      setUpdating(true);

      await apiClientProducts.put(`/${productId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProductData();

      setNewImages([]);
      setDeletedImages([]);

      showSuccess("Images updated successfully");
    } catch (err) {
      console.error("Error updating images:", err);
      showError(err.response?.data?.message || "Failed to update images");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAddToNewArrivals}
            disabled={updating}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add to New Arrivals
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <MessageAlert message={error} type="error" />
      <MessageAlert message={successMessage} type="success" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductInfoForm
          productInfo={productInfo}
          onChange={handleInfoChange}
          onUpdate={handleUpdateInfo}
          updating={updating}
        />

        <SizesStockManager
          sizes={sizes}
          onAddStock={handleAddStock}
          onAddNewSize={handleAddNewSize}
          updating={updating}
        />

        <ImagesManager
          images={images}
          newImages={newImages}
          deletedImages={deletedImages}
          onImageUpload={handleImageUpload}
          onDeleteImage={handleDeleteImage}
          onRemoveNewImage={handleRemoveNewImage}
          onUpdateImages={handleUpdateImages}
          onUpdateSortOrder={handleUpdateSortOrder}
          onSaveSortOrder={handleSaveSortOrder}
          updating={updating}
        />
      </div>
    </div>
  );
};

export default AdminSingleProductManagement;
