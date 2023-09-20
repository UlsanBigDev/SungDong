import './App.css';
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// Data 객체들 불러오기
import { OrderObj } from './component/Data/OrderObj';
import { DataObj } from './component/Data/DataObj'
import { TodayTopicPostObj } from './component/Data/TodayTopicPostObj';
import { UserData } from './component/Data/UserData';
import { CategoryDataObj } from './component/Data/CategoryDataObj';
import { Category } from './component/AboutHeader/Category';

// 메인페이지
import MainPage from './MainPage';
import { Product } from './component/AboutHome/Product';

// 로그인
import Join from './component/AboutLogin/Join';
import { Login } from './component/AboutLogin/Login';

// 고객서비스 관련
import { UserService } from './component/AboutUserService/UserService';
import { Notice } from './component/AboutUserService/Notice';
import { Ask } from './component/AboutUserService/Ask';

// 상세보기, 장바구니, 찜하기
import { Detail } from './component/AboutDetail/Detail';
import { Basket } from './component/AboutDetail/Basket';
import { LikeItem } from './component/AboutDetail/LikeItem';

// 주문, 결제, 주문서 작성
import { Pay } from './component/AboutPay/Pay';
import { Order } from './component/AboutPay/Order';
import { Receipt } from './component/AboutPay/Receipt';
import { DeliveryMain } from './component/AboutPay/DeliveryMain';
import { OrderDetail } from './component/AboutPay/OrderDetail';

// 회사 이벤트 관련
import { Comeway } from './component/AboutCompany/Comeway';
import { TodayNews } from './component/AboutCompany/TodayNews';
import { TodayNewsInner } from './component/AboutCompany/TodayNewsInner';
import { Event } from './component/AboutCompany/Event'
import { AdminMain } from './component/AboutAdmin/AdminMain';
import MyPage from './component/AboutMyPage/MyPage';
import Managecode from './component/AboutAdmin/ManageCode';
import UserContext, { UserProvider } from './context/UserContext';

function App() {
  const navigate = useNavigate();
  // 주문 스탭 부분 State
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 스탭을 추적하는 State 

  // 데이터 State
  const [data, setData] = useState();
  const [orderData, setOrderData] = useState();
  const [userData, setUserData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [basketList, setBasketList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [todayTopicData, setTodayTopicData] = useState();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    // 로그인 상태 유지
    const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
    if (inLogin) { //저장된 로그인Data가 존재
      setLogin(true); //로그인상태유지
      // 유저 아이디에 해당하는 데이터 찾기
      if (data) {
        const findUser = userData.find((item) => item.id === inLogin.id);
        if (findUser) {
          // 등급별 할인율 적용
          let newData = data.map((item) => ({ ...item }));
          switch (findUser.grade) {
            case 'D':
              newData = newData.map((item) => ({
                ...item,
                discount: 0,
              }));
              break;
            case 'C':
              newData = newData.map((item) => ({
                ...item,
                discount: 5,
              }));
              break;
            case 'B':
              newData = newData.map((item) => ({
                ...item,
                discount: 10,
              }));
              break;
            case 'A':
              newData = newData.map((item) => ({
                ...item,
                discount: 15,
              }));
              break;
            default:
          }
          // 상태 업데이트
          setData(newData);
        } else {
          console.log("사용자를 찾을 수 없습니다.");
        }
      }
    }
  }, [setData, userData, setLogin]);

  // 찜 데이터(캐쉬) 불러오기
  useEffect(() => {
    //localStorage에서 likelist를 파싱 
    const savedWishlist = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishlist(savedWishlist); //setWishlist라는 State에 저장
  }, []);

  // 데이터 불러오기
  useEffect(() => {
    const dataload = setTimeout(() => {
      setData(DataObj);
      setOrderData(OrderObj);
      setUserData(UserData);
      setTodayTopicData(TodayTopicPostObj);
      setCategoryData(CategoryDataObj);
      JSON.parse(sessionStorage.getItem('saveLoginData'));
    }, 1000)

    return () => clearTimeout(dataload)
  }, [])


  useEffect(() => {
    // 페이지 이동시 항상 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [navigate]); // navigate가 변경될 때마다 실행

  // (START) 아이콘 클릭 관련 객체, 함수, state //
  const [iconHovered, setIconHovered] = useState(false);
  const [iconClicked, setIconClicked] = useState(true);
  const [menuClicked, setMenuClicked] = useState(true);
  const iconMouseEnter = () => {
    setIconHovered(true);
  };
  const iconMouseLeave = () => {
    setIconHovered(false);
  };
  const iconOnClick = () => {
    setIconClicked(!iconClicked);
  }
  const menuOnClick = () => {
    setMenuClicked(!menuClicked);
  }
  // 카테고리 변하는 스타일 지정
  const transitionDurate = 350; // 애니메이션 지속 시간(ms)
  const icon_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms`,
    color: menuClicked ? '#cc0000' : '#000',
    fontSize: menuClicked ? '2.5em' : '2em',
  };
  const text_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms, font-weight ${transitionDurate}ms`,
    color: iconClicked ? '#6d3535 ' : '#000',
    fontSize: '1.2em',
    fontWeight: iconClicked ? '800' : '600',
  }
  const category_dynamicStyle = {
    transition: `opacity ${transitionDurate}ms, transform ${transitionDurate}ms, height ${transitionDurate}ms`,
    opacity: iconClicked ? 1 : 0,
    height: iconClicked ? '100%' : '0px',
    visibility: iconClicked ? 'visible' : 'hidden',
  }
  const menu_dynamicStyle = {
    transition: `opacity ${transitionDurate}ms, transform ${transitionDurate}ms, height ${transitionDurate}ms`,
    opacity: menuClicked ? 1 : 0,
    width: menuClicked ? '180px' : '0px',
    height: menuClicked ? '100%' : '0px',
    visibility: menuClicked ? 'visible' : 'hidden',
  }
  // (END) 아이콘 클릭 관련 객체, 함수, state //

  return (
    <div className="App">
      <UserProvider>
        <Routes>
          {/* 메인페이지 */}
          <Route path='/' element={
            <>
              <MainPage categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin}
                iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle}
                category_dynamicStyle={category_dynamicStyle} menuOnClick={menuOnClick} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle}
                data={data} todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} menu_dynamicStyle={menu_dynamicStyle} />
              <div
                className='topButton'
                onClick={() =>
                  window.scrollTo({ top: '0', behavior: 'smooth' })}
              >
                <i style={{ color: 'black', fontSize: '1.4em' }} className="fas fa-arrow-up"
                />
              </div>
            </>
          } />

          {/* 상품 */}
          <Route path='/product' element={<Product data={data} />} />
          <Route path='/category' element={<Category menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} setData={setData} data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} basketList={basketList} setBasketList={setBasketList} setActiveTab={setActiveTab} activeTab={activeTab}
            orderList={orderList} setOrderList={setOrderList} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />

          {/* 상세 페이지 */}
          <Route path="/detail/:id" element={
            <Detail menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} setData={setData} data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} basketList={basketList} setBasketList={setBasketList} setActiveTab={setActiveTab} activeTab={activeTab}
              orderList={orderList} setOrderList={setOrderList} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
          } />

          {/* 찜 목록 */}
          <Route path='/likeitem' element={
            <LikeItem menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} basketList={basketList} setBasketList={setBasketList} setWishlist={setWishlist} wishlist={wishlist} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
          } />

          {/* 장바구니 ~ 주문 */}
          <Route path='/basket' element={
            <Basket menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} activeTab={activeTab} setActiveTab={setActiveTab} basketList={basketList} setBasketList={setBasketList} orderList={orderList} setOrderList={setOrderList} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
          }>
            <Route path='receipt' element={<Receipt userData={userData} basketList={basketList} setBasketList={setBasketList} data={data} setData={setData} orderList={orderList} setOrderList={setOrderList} activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData} />} />
            <Route path='pay' element={<Pay activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData} />} />
            <Route path='order' element={<Order activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData} />} />
          </Route>

          {/* 주문 조회 */}
          <Route path='/delivery' element={<DeliveryMain menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} orderData={orderData} setOrderData={setOrderData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />

          {/* 배송 조회 */}
          <Route path='/orderDetail' element={<OrderDetail menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />

          {/* 로그인 */}
          <Route path='/login' element={<Login userData={userData} setUserData={setUserData} />} />
          <Route path='/join' element={<Join userData={userData} setUserData={setUserData} />} >
          </Route>

          {/* 문의하기 */}
          <Route path='/userservice' element={<UserService menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} userData={userData} setUserData={setUserData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />}>
            <Route path='notice' element={<Notice />} />
            <Route path='ask' element={<Ask />} />
          </Route>

          {/* 마이페이지 */}
          <Route path='/mypages' element={<MyPage menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} userData={userData} setUserData={setUserData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />}>

          </Route>
          {/* 회사 관련 */}
          <Route path='/comeway' element={<Comeway menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />
          <Route path='/todayTopic/:page' element={
            <TodayNews menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />
          <Route path='/todayTopicPost/:id'
            element={<TodayNewsInner menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />
          <Route path='/event' element={<Event menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />} />

          {/* 관리자페이지 */}
          <Route path='/adminMain' element={<AdminMain />} />
          <Route path='/adminMain/managecode' element={<Managecode />}/>
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
