import { useState } from 'react';
import styles from './AdminCategory.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../Store/DataStore';
import AdminCategoryAddedModal from './AdminCategoryAddedModal';
import AdminCategoryEditedModal from './AdminCategoryEditedModal';
export function AdminCategory(props){
  
    const navigate = useNavigate();

    const [middleCategory, setMiddleCategory] = useState([]);
    const [lowCategory, setLowCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ big: null, medium: null, low: null });
    const { isModal, modalName } = useModalState();
    const {selectedModalOpen, setModalName, closeModal} = useModalActions();

    const { isLoading, isError, error, data:categoryData } = useQuery({queryKey:['category']});

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);

    const handleCategoryClick = (categoryType, category) => {
      if(categoryType === "big"){
        setSelectedCategory(prevState => ({
          ...prevState,
          medium: null,
        }));
        setSelectedCategory(prevState => ({
          ...prevState,
          low: null,
        }));
      } else if(categoryType === "medium") {
        setSelectedCategory(prevState => ({
          ...prevState,
          low: null,
        }));
      }
      setSelectedCategory(prevState => ({
        ...prevState,
        [categoryType]: category,
      }));
    };

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
      const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return props.data.slice(startIndex, startIndex + 5);
    }; 

    //대 카테고리 필터링
    function FilteredHighCategoryData() {
      return categoryData.filter(element => /^[A-Z]$/.test(element.id));
    }

    //중 카테고리 필터링
    function FilteredMiddleCategoryData(itemId) {
      const newData = categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.id));
      setMiddleCategory(newData);
    }

    //소 카테고리 필터링
    function FilteredLowCategoryData(itemId) {
      const newData = categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.id));
      setLowCategory(newData);
    }

    //카테고리 추가에 필요한 함수
    function handleOpenMediumModal(){
      if(selectedCategory.big !== null && selectedCategory.big !== ""){
        selectedModalOpen("중");
      } else {
        alert("대 카테고리를 선택 후 추가해주세요!");
      }
    }
    function handleOpenLowModal(){
      if(selectedCategory.medium !== null && selectedCategory.medium !== ""){
        selectedModalOpen("소");
      } else {
        alert("중 카테고리를 선택 후 추가해주세요!");
      }
    }

    // 카테고리 수정에 필요한 함수
    function handleEditMediumModal(){
      if(selectedCategory.big !== null && selectedCategory.big !== ""){
        selectedModalOpen("수정 : 중");
      } else {
        alert("대 카테고리를 선택 후 추가해주세요!");
      }
    }
    function handleEditLowModal(){
      if(selectedCategory.medium !== null && selectedCategory.medium !== ""){
        selectedModalOpen("수정 : 소");
      } else {
        alert("중 카테고리를 선택 후 추가해주세요!");
      }
    }

    if (isLoading) {
      return <p>Loading..</p>;
    }
    if (isError) {
      return <p>에러 : {error.message}</p>;
    }
  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <div className={styles.container}>
          <div className={styles.bodyHeader}>
            <h1>카테고리 관리</h1>
          </div>
          {/* 카테고리 목록 추가, 변경, 삭제 (대분류) -> (중분류) -> (소분류) */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
            <h4 style={{fontSize: '1.1em', fontWeight: '750', marginTop: '1em'}}>
                선택된 카테고리 : 
                <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>
                {[categoryData.find((item) => item.id === selectedCategory.big)?.name, categoryData.find((item) => item.id === selectedCategory.medium)?.name, categoryData.find((item) => item.id === selectedCategory.low)?.name].filter(Boolean).join(' - ')}
                </span>
            </h4>
            <div style={{display: 'flex', gap: '2em'}}>
              <div className={styles.categoryContainer}>
                <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
                  {categoryData
                  && FilteredHighCategoryData().map((item, index)=> (
                  <div onClick={()=> {
                    setLowCategory([]);
                    handleCategoryClick('big', item.id);
                    FilteredMiddleCategoryData(item.id)
                  }} 
                  key={index} 
                  className={styles.categoryInner}
                  style={{backgroundColor: selectedCategory.big === item.id && 'lightgray'}}
                  >
                    {item.name}
                    <i className="far fa-chevron-right" style={{color: 'gray'}}/>
                  </div>
                  ))}
                </div>
                <div className={styles.buttonBox}>
                  <button onClick={()=> selectedModalOpen("수정 : 대")} className={styles.button}>수정</button>
                  <button onClick={()=> selectedModalOpen("대")} className={styles.button}>추가</button>
                </div>
              </div>
              <div className={styles.categoryContainer}>
                <div style={{overflowY: 'auto'}}>
                  {middleCategory != null && middleCategory.map((item, index) => (
                    <div 
                      onClick={()=> {
                      FilteredLowCategoryData(item.id)
                      handleCategoryClick('medium', item.id);
                      }} 
                      key={index} 
                      className={styles.categoryInner}
                      style={{backgroundColor: selectedCategory.medium === item.id && 'lightgray'}}
                    >
                    {item.name}
                    <i className="far fa-chevron-right" style={{color: 'gray'}}/>
                  </div>
                  ))}
                </div>
                <div className={styles.buttonBox}>
                  <button className={styles.button} onClick={()=> {
                    handleEditMediumModal();
                  }}>수정</button>
                  <button className={styles.button} onClick={()=> {
                    handleOpenMediumModal();
                  }}>추가</button>
                </div>
              </div>
              <div className={styles.categoryContainer}>
                <div style={{overflowY: 'auto'}}>
                  {lowCategory != null && lowCategory.map((item, index) => (
                    <div 
                    key={index}
                    className={styles.categoryInner}
                    style={{backgroundColor: selectedCategory.low === item.id && 'lightgray'}}
                    onClick={()=> {
                      handleCategoryClick('low', item.id);
                    }}
                    >
                    {item.name}
                  </div>
                  ))}
                </div>
                <div className={styles.buttonBox}>
                  <button className={styles.button} onClick={()=> handleEditLowModal()}>수정</button>
                  <button className={styles.button} onClick={()=> handleOpenLowModal()}>추가</button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.tableLocation}>
            <table className={styles.table}>
              <thead 
              style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
              >
                <tr>
                  <th>이미지</th>
                  <th>상품코드</th>
                  <th>카테고리</th>
                  <th>상품명</th>
                  <th>표준가</th>
                  <th style={{fontWeight: '650'}}>공급가</th>
                  <th>카테고리 수정</th>
                </tr>
              </thead>
              <tbody>
                {props.data 
                ? getCurrentPagePosts().map((item, index)=> (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><img src={item.image.mini} alt='이미지'></img></td>
                    <td>{item.id}</td>
                    <td>{item.category.main} - {item.category.sub} </td>
                    <td className={styles.detailView} onClick={()=>navigate(`/detail/${item.id}`)}>
                      <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.title}</h5>
                    </td>
                    <td>\{item.price.toLocaleString()}</td>
                    <td style={{fontWeight: '750'}}>
                      {item.finprice
                      ? item.discount
                      ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                      : `\\${item.finprice.toLocaleString()}`
                      : `\\${item.price.toLocaleString()}`}
                    </td>
                    <td 
                      className={styles.detailView}
                      >
                      <button onClick={()=> navigate(`/adminMain/categoryEdit/${item.id}`)} className={styles.button}>변경</button>
                    </td>
                  </tr>
                  </React.Fragment>
                  ))
                : <tr><td>로딩중</td></tr>
                }
              </tbody>
            </table>
          </div>
          <div className={styles.buttonContainer}>
            {/* 이전 페이지 */}
            <button
            className={styles.button} 
            onClick={()=> {
              if(currentPage !== 1){
                setCurrentPage(currentPage - 1)
              } else {
                alert("해당 페이지가 가장 첫 페이지 입니다.")
              }}}>
                <i className="far fa-angle-left"/>
            </button>
            <div className={styles.button}>
              {currentPage}
            </div>
            {/* 다음 페이지 */}
            <button
            className={styles.button}
            onClick={()=> {
              if(props.data.length > (currentPage * 5)){
                setCurrentPage(currentPage + 1)
              } else {
                alert("다음 페이지가 없습니다.")
              }}}>
                <i className="far fa-angle-right"/>
            </button>
          </div>
        </div>
        {(modalName === "대" || modalName === "중" || modalName === "소") 
        ? isModal &&
        <AdminCategoryAddedModal selectedCategory={selectedCategory} categoryData={categoryData}/>
        : (modalName === "수정 : 대" || modalName === "수정 : 중" || modalName === "수정 : 소") 
        && isModal &&
        <AdminCategoryEditedModal selectedCategory={selectedCategory} categoryData={categoryData}/>
        }
      </div>
    </div>
  )
}