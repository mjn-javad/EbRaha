import React, { useState } from "react";
import apiClientBrand from "../../services/api-client_brand";
import { createBrandSlug } from "../../utils/createBrandSlug";
import MessageAlert from "../Shared/MessageAlert";
import InputField from "../Shared/InputField";

const BrandUploader = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("name", name.trim());

      const response = await apiClientBrand.post("/", formData);

      setMessage(response.data?.message || "Brand created successfully");
      setName("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Error creating brand",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-xl flex-col gap-y-5 bg-white p-6 shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Brand
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the brand name. Its slug is generated automatically.
          </p>
        </div>

        <InputField
          name="name"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required={true}
          placeholder="Example: Louis Vuitton"
        />

        {name.trim() && (
          <div className="border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            Generated slug: <strong>{createBrandSlug(name)}</strong>
          </div>
        )}

        <p className="text-xs text-gray-500">
          You can add an image later from Brand Management.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Creating Brand..." : "Create Brand"}
        </button>

        {message && <MessageAlert message={message} type="success" />}
        {error && <MessageAlert message={error} type="error" />}
      </form>
    </div>
  );
};

export default BrandUploader;
