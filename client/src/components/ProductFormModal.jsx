// components/ProductFormModal.jsx
import { useState } from "react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import SelectField from "./SelectField";
import ImageUploader from "./ImageUploader";

const ProductFormModal = ({
  type = "add", // "add" | "edit"
  initialData = {},
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    type: initialData.type || "",
    stock: initialData.stock || "",
    mrp: initialData.mrp || "",
    price: initialData.price || "",
    brand: initialData.brand || "",
    exchange: initialData.exchange || "Yes",
  });

  const [images, setImages] = useState(
    (initialData.images || []).map((url) => ({
      url,
      preview: url,
      isNew: false,
    }))
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (key, value) => {
    setSubmitError("");
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    const err = {};
    const stock = Number(form.stock);
    const mrp = Number(form.mrp);
    const price = Number(form.price);

    if (!form.name?.trim()) {
      err.name = "Please enter product name";
    }

    if (!form.type) {
      err.type = "Please select product type";
    }

    if (!form.stock && form.stock !== 0) {
      err.stock = "Please enter quantity stock";
    } else if (Number.isNaN(stock) || stock < 0) {
      err.stock = "Stock must be a valid number";
    }

    if (!form.mrp && form.mrp !== 0) {
      err.mrp = "Please enter MRP";
    } else if (Number.isNaN(mrp) || mrp <= 0) {
      err.mrp = "MRP must be greater than 0";
    }

    if (!form.price && form.price !== 0) {
      err.price = "Please enter selling price";
    } else if (Number.isNaN(price) || price <= 0) {
      err.price = "Selling price must be greater than 0";
    } else if (!Number.isNaN(mrp) && price > mrp) {
      err.price = "Selling price must be less than or equal to MRP";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;

    const result = await onSubmit({ ...form, images });
    if (!result?.success) {
      const detailErrors = result?.details || {};
      if (Object.keys(detailErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...detailErrors }));
      }
      setSubmitError(result?.error || "Unable to save product");
    }
  };

  return (
    <Modal
      title={type === "add" ? "Add Product" : "Edit Product"}
      onClose={onClose}
      bodyScrollable={false}
      panelClassName="w-[500px] max-w-[92vw]"
    >
      {submitError && (
        <p className="mb-3 text-sm text-red-600">{submitError}</p>
      )}

      <FormInput
        label="Product Name"
        value={form.name}
        onChange={(e) =>
          handleChange("name", e.target.value)
        }
        error={errors.name}
      />

      <SelectField
        label="Product Type"
        options={[
          "Foods",
          "Electronics",
          "Clothes",
          "Beauty Products",
          "Others",
        ]}
        value={form.type}
        onChange={(val) => handleChange("type", val)}
        error={errors.type}
      />

      <FormInput
        label="Quantity Stock"
        value={form.stock}
        onChange={(e) =>
          handleChange("stock", e.target.value)
        }
        error={errors.stock}
      />

      <FormInput
        label="MRP"
        value={form.mrp}
        onChange={(e) =>
          handleChange("mrp", e.target.value)
        }
        error={errors.mrp}
      />

      <FormInput
        label="Selling Price"
        value={form.price}
        onChange={(e) =>
          handleChange("price", e.target.value)
        }
        error={errors.price}
      />

      <FormInput
        label="Brand Name"
        value={form.brand}
        onChange={(e) =>
          handleChange("brand", e.target.value)
        }
      />

      <ImageUploader
        images={images}
        setImages={setImages}
      />

      <SelectField
        label="Exchange or return eligibility"
        options={["Yes", "No"]}
        value={form.exchange}
        onChange={(val) =>
          handleChange("exchange", val)
        }
      />

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {type === "add" ? "Create" : "Update"}
        </button>
      </div>
    </Modal>
  );
};

export default ProductFormModal;