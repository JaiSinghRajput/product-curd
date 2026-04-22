// components/ImageUploader.jsx
const ImageUploader = ({ images, setImages }) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));
    setImages([...images, ...newImgs]);
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
        <span className="text-blue-600 text-sm cursor-pointer">
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

        <label className="cursor-pointer text-sm text-gray-500">
          Browse
          <input
            type="file"
            multiple
            hidden
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;