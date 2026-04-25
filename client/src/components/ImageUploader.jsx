// components/ImageUploader.jsx
import { useRef } from "react";

const ImageUploader = ({ images, setImages }) => {
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    setImages([...images, ...newImgs]);

    // Allow re-selecting the same file again if needed.
    e.target.value = "";
  };

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getImageSrc = (img) => {
    if (typeof img === "string") return img;
    return img.preview || img.url || "";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-sm text-gray-700">
          Upload Product Images
        </label>
        <span
          className="text-blue-600 text-sm cursor-pointer"
          onClick={openPicker}
        >
          Add More Photos
        </span>
      </div>

      <div className="border border-dashed rounded-xl p-4 flex gap-3 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={getImageSrc(img)}
              className="w-14 h-14 object-cover rounded"
            />
            <button
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 bg-white border rounded-full text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}

        {images.length === 0 && (
          <label className="cursor-pointer text-sm text-gray-500" onClick={openPicker}>
            Browse
          </label>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleUpload}
        />
      </div>
    </div>
  );
};

export default ImageUploader;