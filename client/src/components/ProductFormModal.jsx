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

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Please enter product name";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, images });
  };

  return (
    <Modal
      title={type === "add" ? "Add Product" : "Edit Product"}
      onClose={onClose}
      footer={
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {type === "add" ? "Create" : "Update"}
        </button>
      }
    >
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
      />

      <FormInput
        label="Quantity Stock"
        value={form.stock}
        onChange={(e) =>
          handleChange("stock", e.target.value)
        }
      />

      <FormInput
        label="MRP"
        value={form.mrp}
        onChange={(e) =>
          handleChange("mrp", e.target.value)
        }
      />

      <FormInput
        label="Selling Price"
        value={form.price}
        onChange={(e) =>
          handleChange("price", e.target.value)
        }
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
    </Modal>
  );
};

export default ProductFormModal;