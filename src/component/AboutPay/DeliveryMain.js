import { useEffect, useRef, useState } from 'react'
import { Delivery } from './Delivery'
import styles from './DeliveryMain.module.css'
import { useOrderData } from '../../Store/DataStore'
export function DeliveryMain(props){
  //로그인 정보 불러오기
  const orderData = useOrderData();
  const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
  const filterOrderData = orderData && orderData.filter((item)=>item.userId === inLogin.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  const [results, setResults] = useState([]);
  // 연관 검색어 방향키 이동, 설정을 위한 State
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정

  // input 엘리먼트에 대한 ref
  const inputRef = useRef(null);


  // 검색 로직
  const handleSearch = (event) => {
    // 입력 값을 저장하는 로직
    const query = event.target.value;
    setSearchTerm(query);
    // 입력창이 공백이 아닐 때 (==검색 중이면?)
    if (query !== '') {
      // 데이터 중 타이틀로들만 구성된 변수 생성 후 
      // 그 변수들 중 첫 글자와 입력값이 일치하는 것을 연관 검색어 목록에 띄워줌
      const filteredtitle = filterOrderData.map((item) => item.productName);
      const filteredResults = filteredtitle.filter((word) =>
        word.includes(query)
      );
      setResults(filteredResults);
    // 입력창이 공백이면 연관 검색어를 띄우지 않는다.
    } else {
      setResults([]);
    }
    setSelectedResultIndex(-1); // 검색어 변경 시 선택된 결과 초기화
  };

  const handleKeyDown = (event) => {
    // 방향키로 선택한 결과 항목 인덱스 업데이트
    if (event.key === 'ArrowDown') { // 아래 방향키
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === 'ArrowUp') { // 위 방향키
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : -1
      );
    } else if (event.key === 'Enter') {
      // Enter 키를 누르면 선택한 결과 항목을 검색어로 설정
      if(selectedResultIndex !== -1) {
        setSearchTerm(results[selectedResultIndex]);
        setResults([]); // 결과 항목 숨기기
        setResultSearch(results[selectedResultIndex]);
        setSearchTerm("");
      } else {
        setResultSearch(searchTerm);
        setResults([]); // 결과 항목 숨기기
      }
    } else if (event.key === 'Tab' && selectedResultIndex !== -1) {
      // 탭 키 누르면 자동완성
      event.preventDefault();
      setSearchTerm(results[selectedResultIndex]);
    }
  };

  // 선택된 결과 항목이 변경될 때 input 엘리먼트에 포커스 설정
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedResultIndex]);

  return(
    <div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>주문/배송</h1>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <input 
            className={styles.searchInput} 
            type='text' 
            placeholder='주문한 상품 검색하기'
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
            />
            <ul 
            className={searchTerm !== "" 
            && results.length > 0 
            ? styles.result
            : null}>
            {results && results.map((result, index) => (
              <li
                key={index}
                className={index === selectedResultIndex 
                  ? styles.selected 
                  : styles.resultInner}
              >
                {result}
              </li>
            ))}
            </ul>
            <i 
            className="fas fa-search"
            onClick={()=> {
              setResultSearch(searchTerm);
              setResults([]); // 결과 항목 숨기기
            }}/>
          </div>
        </div>
      </div>
      <Delivery decryptData={props.decryptData} resultSearch={resultSearch} setResultSearch={setResultSearch}/>
    </div>
  )
}