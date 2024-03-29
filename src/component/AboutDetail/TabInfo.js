import styles from './TabInfo.module.css'
import React from 'react';
import { RelatedData } from './RelatedData'
export function TabInfo({detailData}){

  // 상품정보 데이터
  const productInfo = [
    {label: '상품번호', value: detailData.product_id},
    {label: '브랜드', value: detailData.product_brand},
    {label: '원산지', value: detailData.product_madeIn},
    {label: '상품상태', value: detailData.product_state},
  ]

  const returnInfo = [
    {label: '택배사', value: 'CJ대한통운'},
    {label: '반품 배송비', value: '편도 3,000원(최초 배송비 무료인 경우 6,000원 부과)'},
    {label: '보내실 곳', value: '울산광역시 남구 산업로440번길 8 (주)성동물산  (우 : 44781)'},
    {label: '반품/교환 요청 가능 기간', value: '구매자 단순 변심은 상품 구매 후 7일 이내(구매자 반품 배송비 부담)'},
    {label: '반품/교환 불가능 사유', value: '1. 반품요청기간이 지난 경우'},
  ]
  return(
    <div className={styles.tabInnerHeader}>

    {/* 탭 상품 정보 */}
    <h5 style={{fontWeight: '650'}}>상품 정보</h5>
    <div className={styles.productDetail}>
      {productInfo.map((item, index) =>
      <div key={index} className={styles.productDetailInner}>
        <div className={styles.productDetail_label}>
          <p>{item.label}</p>
        </div>
        <div className={styles.productDetail_content}>
          {item.value}
        </div>
      </div>
      )}
    </div>


    {/* 탭 상품 설명 */}
    <div id='1' className="tab-content">
      <div className={styles.reviewHeader}>
      <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>상품 설명</h3>
      {/* HTML 구문 표기 */}
        <div dangerouslySetInnerHTML={{ __html: detailData.product_content }}/>
      </div>
    </div>

        {/* 반품 / 교환 정보 */}
    <div id='2' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>반품 / 교환정보</h3>
        <p>반품 시 반품사유, 택배사, 배송비, 반품지 주소를 협의 후 반품상품 발송 바랍니다.</p>
      </div>
      <div className={styles.form}>
        {returnInfo.map((item, key) => 
        <div key={key} className={styles.formInner}>
          <div className={styles.label}>
            <p>{item.label}</p>
          </div>
          <div className={styles.content}>
            <p>{item.value}</p>
          </div>
        </div>
        )}
      </div>
    </div>


    {/* 탭 관련상품 */}
    <div id='3' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>관련 상품</h3>
        <div className={styles.qnATop}>
          <p>해당 상품과 관련된 상품입니다.</p>
        </div>
      </div>
      <RelatedData detailData={detailData}/>
    </div>
  </div>
  )
}