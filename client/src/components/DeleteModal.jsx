// components/DeleteModal.jsx
import Modal from "./Modal";

const DeleteModal = ({ product, onClose, onDelete }) => {
  return (
    <Modal
      title="Delete Product"
      onClose={onClose}
      footer={
        <button
          onClick={onDelete}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Delete
        </button>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you really want to delete this Product{" "}
        <span className="font-semibold">
          "{product.name}"
        </span>{" "}
        ?
      </p>
    </Modal>
  );
};

export default DeleteModal;