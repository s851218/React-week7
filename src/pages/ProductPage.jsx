import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";
import Toast from "../components/Toast";
import { useDispatch } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// Modal 狀態資料欄位
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage({ setIsAuth }) {
  // 更新產品列表狀態
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();

  // 獲取產品列表函式
  const fetchProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      const productsArray = Object.values(res.data.products).map((product) => ({
        ...product,
        imagesUrl: Array.isArray(product.imagesUrl) ? product.imagesUrl : [],
      })); // 如果取得的產品列表，有產品裡面沒有 imagesUrl 屬性，就要增加 imagesUrl 屬性
      setProducts(productsArray); // 更新產品狀態
      setPageInfo(res.data.pagination); // 更新分頁資料
    } catch (error) {
      alert("無法獲取產品列表，請稍後再試");
      console.error("獲取產品列表錯誤：", error);
    }
  };
  // 初始化渲染取得產品列表
  useEffect(() => {
    fetchProducts();
  }, []);

  // Modal
  // 更改新增或編輯產品狀態
  const [modalMode, setModalMode] = useState(null);

  // 更新 isProductModalOpen 是開還是關的狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // 更新 isDelProductModalOpen 是開還是關的狀態
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState); // 如果 mode 是 create，將狀態更改為 defaultModalState
        break;

      case "edit":
        setTempProduct(product); // 如果 mode 是 edit，將狀態更改為顯示已有的產品資料
        break;

      default:
        break;
    }

    setIsProductModalOpen(true);
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);

    setIsDelProductModalOpen(true);
  };

  // 更新編輯的產品資料
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // 分頁功能
  const [pageInfo, setPageInfo] = useState({});
  // 換頁功能(取得產品調整)
  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  // 登出
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/logout`);
      setIsAuth(false);
    } catch (error) {
      console.log("登出失敗！", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-3">
          <div className="col">
            <div className="row mb-3">
              <div className="justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLogout}
                >
                  登出
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <h2 className="fw-bold">產品列表</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpenProductModal("create");
                }}
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            handleOpenProductModal("edit", product);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => {
                            handleOpenDelProductModal(product);
                          }}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </div>

      <ProductModal
        modalMode={modalMode}
        fetchProducts={fetchProducts}
        tempProduct={tempProduct}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
      />

      <DelProductModal
        fetchProducts={fetchProducts}
        tempProduct={tempProduct}
        isDelProductModalOpen={isDelProductModalOpen}
        setIsDelProductModalOpen={setIsDelProductModalOpen}
      />

      <Toast />
    </>
  );
}

export default ProductPage;
