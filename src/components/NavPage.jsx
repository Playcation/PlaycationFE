import { Link, useNavigate } from 'react-router-dom';

/**
 * 상단 탭 목록들
 *
 * @returns 탭 목록, 장바구니/알림에는 개수 포함
 */
export const NavItems = () => {
    const [cartCount, setCartCount] = useState(null);
    const itemList = [
        { url: "/profile", class: "fas fa-user", name: "프로필" },
    ];

    const list = [];
    for (let i = 0; i < itemList.length; i++) {
        list.push(
            <Link key={i} to={itemList[i].url} className="nav-item">
                <i className={itemList[i].class}></i>
                <span>{itemList[i].name}</span>
            </Link>
        );
    }
    useEffect(() => {
      const fetchCartCount = async () => {
        try {
          const response = await axiosInstance.get("/carts/count"); // API 필요
          setCartCount(response.data || 0);
        } catch (error) {
          console.error("장바구니 개수 불러오기 실패", error);
        }
      };
      fetchCartCount();
    }, []);
    return (
        <>
            {list}
            <Link to="/carts" className="nav-item">
                <i className="fas fa-shopping-cart"></i>
                <span>장바구니</span>
                <span className="cart-count">{cartCount}</span>
            </Link>
            <a href="" className="nav-item">
                <i className="fas fa-bell"></i>
                <span>알림</span>
                {/* <span className="notification-count">0</span> */}
            </a>
        </>
    )
}

export const NavPage = () => {

    return (
        <nav className="top-nav">
            <div className="nav-container">
                <Link to="/main">
                    <div className="logo">
                        <h1>Playcation</h1>
                    </div>
                </Link>
                <div className="nav-items"><NavItems />
                </div>
            </div>
        </nav>
    )
}

export default NavPage;