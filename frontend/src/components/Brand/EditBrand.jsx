import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import apiClientBrand from "../../services/api-client_brand";
import { createBrandSlug } from "../../utils/createBrandSlug";
import InputField from "../Shared/InputField";
import MessageAlert from "../Shared/MessageAlert";

const getBrandImageUrl = (image) => {
  if (!image) return "";
  return image.startsWith("http") ? image : `/api/images/barnds/${image}`;
};

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiClientBrand
      .get(`/${id}`)
      .then((response) => {
        if (isMounted) {
          const brand = response.data?.data;
          setName(brand?.name || "");
          setCurrentImage(brand?.image || "");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError.response?.data?.message || "Brand not found",
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      event.target.value = "";
      return;
    }

    setError("");
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("name", name.trim());

      if (file) {
        formData.append("image", file);
      }

      const response = await apiClientBrand.put(`/${id}`, formData);
      const updatedBrand = response.data?.data;

      setName(updatedBrand?.name || name.trim());
      setCurrentImage(updatedBrand?.image || currentImage);
      setFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage(response.data?.message || "Brand updated successfully");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not update brand",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto h-[520px] max-w-xl animate-pulse bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard/brands")}
        className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={17} />
        Back to brands
      </button>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-xl flex-col gap-y-5 bg-white p-6 shadow-lg"
      >
        <div className="text-center">
          <h1>Edit Brand</h1>
          <p className="mt-2 text-sm text-gray-500">
            Changing the name also updates the slug automatically.
          </p>
        </div>

        <InputField
          name="name"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required={true}
        />

        {name.trim() && (
          <div className="border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            Generated slug: <strong>{createBrandSlug(name)}</strong>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm text-gray-600">
            {imagePreview ? "New image preview" : "Current image"}
          </p>
          <div className="flex h-60 items-center justify-center border border-gray-200 bg-gray-50 p-4">
            {imagePreview || currentImage ? (
              <img
                src={imagePreview || getBrandImageUrl(currentImage)}
                alt={name || "Brand"}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <ImageIcon size={42} strokeWidth={1.3} />
                <span className="text-sm">This brand has no image</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="brand-edit-image">
            {currentImage ? "Replace Image" : "Add Image"}
          </label>
          <input
            ref={fileInputRef}
            id="brand-edit-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
            onChange={handleFileChange}
            className="w-full cursor-pointer border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700"
          />
          <p className="text-xs text-gray-500">
            Leave this empty to keep the current image.
          </p>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {updating ? "Updating Brand..." : "Update Brand"}
        </button>

        {message && <MessageAlert message={message} type="success" />}
        {error && <MessageAlert message={error} type="error" />}
      </form>
    </div>
  );
};

export default EditBrand;
