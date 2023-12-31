import { useEffect, useRef, useState } from 'react';
import styles from './AdminHeaderSearchBar.module.css';
import { useNavigate } from 'react-router-dom';

export function AdminHeaderSearchBar(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  // 연관 검색어 방향키 이동, 설정을 위한 State
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정
  const [searchFilter, setSearchFilter] = useState("업체명");

  // input 엘리먼트에 대한 ref
  const inputRef = useRef(null);


  // 검색 로직
  const handleSearch = (event) => {
    // 입력 값을 저장하는 로직
    const query = event.target.value;
    setSearchTerm(query);
    // 입력창이 공백이 아닐 때 (==검색 중이면?)
    if (query !== '') {
      if(searchFilter === '업체명'){
        // 데이터 중 타이틀로들만 구성된 변수 생성 후 
        // 그 변수들 중 첫 글자와 입력값이 일치하는 것을 연관 검색어 목록에 띄워줌
          const filteredtitle = props.data && props.data.map((item) => item.title);
          const filteredResults = filteredtitle.filter((word) =>
            word.includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '상품코드'){
          const filteredtitle = props.data && props.data.map((item) => item.id);
          const filteredResults = filteredtitle.filter((word) =>
            word.toString().includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '사업자번호'){
          const filteredtitle = props.data && props.data.map((item) => item.brand);
          const filteredResults = filteredtitle.filter((word) =>
            word.includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '송장번호'){
          const filteredResults = props.data && props.data.flatMap((item) =>
          item.option && item.option.map((option) => option.value).filter((word) =>
            word.includes(query)
          )
        ).filter(Boolean);
          setResults(filteredResults);
        } 
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
        switch (searchFilter) {
          case '업체명':
            sessionStorage.setItem('filterSearch_CName', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '상품코드':
            sessionStorage.setItem('filterSearch_PCode', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '사업자번호':
            sessionStorage.setItem('filterSearch_CNum', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '송장번호':
            sessionStorage.setItem('filterSearch_PNum', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            break;
          default:
            sessionStorage.setItem('filterSearch_CName', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
        }
        navigate("/adminMain/searchOrder")
        setResults([]); // 결과 항목 숨기기
        setSearchTerm("");
      } else {
        switch (searchFilter) {
          case '업체명':
            sessionStorage.setItem('filterSearch_CName', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '상품코드':
            sessionStorage.setItem('filterSearch_PCode', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '사업자번호':
            sessionStorage.setItem('filterSearch_CNum', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
          case '송장번호':
            sessionStorage.setItem('filterSearch_PNum', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearch_CName');
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            break;
          default:
            sessionStorage.setItem('filterSearch_CName', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch_PCode');
            sessionStorage.removeItem('filterSearch_CNum');
            sessionStorage.removeItem('filterSearch_PNum');
            break;
        }
        navigate("/adminMain/searchOrder")
        setResults([]); // 결과 항목 숨기기
        setSearchTerm("");
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

  return (
    <div>
      <div className={styles.searchInputContainer}>
        <select 
        className={styles.select}
        name="searchFilter"
        value={searchFilter}              
        onChange={(e)=>setSearchFilter(e.target.value)}
        >
          <option value='업체명'>
            업체명
          </option>
          <option value='상품코드'>
            상품코드
          </option>
          <option value='사업자번호'>
            사업자번호
          </option>
          <option value='송장번호'>
            송장번호
          </option>
        </select>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="조회할 주문 정보를 입력하세요"
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
        {/* 돋보기 아이콘 */}
        <i 
        onClick={() => {
          sessionStorage.setItem('filterSearch_CName', JSON.stringify(searchTerm))
          navigate("/adminMain/searchOrder")
          setResults([]); // 결과 항목 숨기기
          setSearchTerm("");
        }}
        className="fas fa-search" />
      </div>
    </div>
  );
}