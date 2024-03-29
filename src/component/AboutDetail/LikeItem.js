import { useListActions, useListStore, useWishList } from '../../store/DataStore';
import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner'
import styles from './LikeItem.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function LikeItem(){
  const wishList = useWishList();
  const {setWishList} = useListActions();
  const navigate = useNavigate();

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = wishList.map((item) => item.product_id);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(productId) {
    if (selectedItems.includes(productId)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((id) => id !== productId)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
    } else {
      setSelectedItems([...selectedItems, productId]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
    }
  };

  // 선택된 항목들을 삭제하는 함수
  const deletedList = () => {
    if(selectedItems !== null && selectedItems.length > 0){
      //wishList 배열에서 selectedItems에 포함된(체크박스 선택된) 항목들이 아닌 것들로 새로운 배열을 생성
      const updatedWishlist = wishList.filter((item) => !selectedItems.includes(item.product_id)); 
      setWishList(updatedWishlist);

      // LocalStorage에 업데이트된 찜 목록 저장
      localStorage.setItem('likelist', JSON.stringify(updatedWishlist));

      // 선택된 항목들 초기화
      setSelectedItems([]);
      
      //알림
      alert("찜 리스트에서 해당 품목이 성공적으로 삭제되었습니다.")
    } else {
      alert("1개 이상의 목록을 선택해주세요")
    }
  };
  return(
    <div>
      <div className={styles.body}>
        {/* 헤드라인 */}
        <div className={styles.head}>
          <h1><i className="fa-solid fa-heart"/> 찜 리스트</h1>
        </div>
        {/* 찜 목록 테이블 */}
        <div className={styles.tablebody}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input 
                  type='checkbox'
                  checked={selectAll}
                  onChange={()=>handleSelectAllChange()}/>
                </th>
                <th>상품 이미지</th>
                <th className={styles.name}>상품명</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
            {wishList.map((item, key)=>(
              <tr key={key}>
                <td>
                  <input 
                  checked={selectedItems.includes(item.product_id)}
                  onChange={() => checkedBox(item.product_id)}
                  type='checkbox'
                  />
                </td>
                <td><img style={{width: '8em', height: '8em'}} src={item.product_image_original} alt='이미지'/></td>
                <td><span className={styles.link} onClick={()=>navigate(`/detail/${item.product_id}`)}>{item.product_title}</span></td>
                <td>\{item.product_price.toLocaleString()}</td>
              </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.buttonDiv}>
            <button 
            onClick={()=>deletedList()}
            className={styles.deletebutton}
            >선택 제거</button>
          </div>
        </div>
      </div>
    </div>
  )
}