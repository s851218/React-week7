import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // ES6

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
  // 更新帳密狀態
  const [account, setAccount] = useState({
    "username": "",
    "password": "",
  });

  // 跳過登入流程直接取得 token 驗證登入
  useEffect(() => {
    const checkIsLogin = async () => {
      try {
        const token = document.cookie.replace(
          // 從 cookie 取得 token
          /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
        axios.defaults.headers.common["Authorization"] = token;

        await axios.post(`${BASE_URL}/v2/api/user/check`);

        setIsAuth(true);
      } catch (error) {
        console.log("確認登入失敗：", error);
      }
    };
    checkIsLogin();
  }, []);

  // 登入帳密輸入onChange監聽
  const handleAccountInputChange = (e) => {
    const { value, name } = e.target; // e.target 的物件解構，分別為 e.target.value 是輸入欄位的當前值；e.target.name 是該輸入欄位的 name 屬性，表示這是 username 還是 password。

    // setAccount 用於更新狀態。
    setAccount({
      ...account, // 展開運算符 ...account 產生新的 account 物件，用來保留現有的 account 狀態，不會直接改變原本的物件
      [name]: value, // [name]: value 動態地更新對應的欄位：如果 name 是 "username"，就更新 username 的值為 value；如果 name 是 "password"，就更新 password 的值為 value。
    });
  };

  // 登入
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);

      const { token, expired } = res.data; // 成功登入後，將 token 和 expired 取出來，要存到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // 將 token 和 expired 存到 cookie

      axios.defaults.headers.common["Authorization"] = token; // 每次發送 HTTP 請求時，預設都會將這個 token 附加在 Authorization 標頭中

      setIsAuth(true); // 成功登入後，透過 setIsAuth 將 isAuth 狀態改成 true將 isAuth 狀態改成 true，就會渲染產品列表
    } catch (error) {
      alert("登入失敗");
      console.log("登入失敗：", error);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            name="username"
            value={account.username}
            onChange={handleAccountInputChange}
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            required
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            value={account.password}
            onChange={handleAccountInputChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-dark">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

export default LoginPage;

LoginPage.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};
