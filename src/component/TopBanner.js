import { useState } from 'react';
import logo from '../image/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import SearchBar from './SearchBar';
//상단 메뉴 리스트 
export function TopBanner () {
  const menuData = [
    {
      title: '회사 소개',
      subMenuItems: ['오시는 길', '오늘의 소식', '서브메뉴3'],
    },
    {
      title: '문의하기',
      subMenuItems: ['질문 게시판', '1:1 상담', '실시간 채팅 게시판'],
    },
    {
      title: '마이페이지',
      subMenuItems: ['장바구니 목록', '내가 찜한 목록', '주문 / 배송 현황'],
    }, 
  ];
  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(menuData.map(() => false));

  const handleMouseEnter = (index) => {
    // 해당 인덱스의 메뉴를 열기 위해 true로 설정
    const newSubMenuStates = [...subMenuStates];
    newSubMenuStates[index] = true;
    setSubMenuStates(newSubMenuStates);
  };

  const handleMouseLeave = (index) => {
    // 해당 인덱스의 메뉴를 닫기 위해 false로 설정
    const newSubMenuStates = [...subMenuStates];
    newSubMenuStates[index] = false;
    setSubMenuStates(newSubMenuStates);
  };

  return (
    <div className={styles.top_container}>
      <div className={styles.top_nav}>
        {/* 로고 */}
        <img className={styles.image} onClick={()=>navigate("/")} src={logo} height='80px'/>
        {/* 서치바 */}
        <SearchBar/>
        {/* 메뉴 loop */}
        {menuData.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={`menu-item ${subMenuStates[index] && 'open'}`}
          >
            <a className={styles.link} href="#">{item.title}</a>
            {subMenuStates[index] && (
              <ul onMouseLeave={() => handleMouseLeave(index)} className="sub-menu">
                {item.subMenuItems.map((item, index) => (
                  <li className={styles.sub_item} key={index}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <button className={styles.link_signIn} onClick={()=>{navigate("/login")}}>로그인</button>
      </div>
    </div>
  );
}