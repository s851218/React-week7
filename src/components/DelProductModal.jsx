import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import PropTypes from "prop-types"; // ES6

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({
  fetchProducts,
  tempProduct,
  isDelProductModalOpen,
  setIsDelProductModalOpen,
}) {
  const delProductModalRef = useRef(null);

  // 建立 Modal 實例
  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isDelProductModalOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  }, [isDelProductModalOpen]);

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsDelProductModalOpen(false);
  };

  // 刪除產品 API
  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
    } catch (error) {
      alert("刪除產品失敗：", error);
    }
  };

  const handleDelProduct = async () => {
    try {
      await deleteProduct();
      fetchProducts();
      handleCloseDelProductModal();
    } catch (error) {
      alert("刪除產品失敗：", error);
    }
  };

  return (
    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleDelProduct}
              type="button"
              className="btn btn-danger"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;

DelProductModal.propTypes = {
  modalMode: PropTypes.string.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  tempProduct: PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    origin_price: PropTypes.string,
    price: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    is_enabled: PropTypes.number,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }),
  isDelProductModalOpen: PropTypes.bool.isRequired,
  setIsDelProductModalOpen: PropTypes.func.isRequired,
};
