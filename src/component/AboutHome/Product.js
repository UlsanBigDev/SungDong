import styles from './Product.module.css'; 
import { useNavigate } from 'react-router-dom';
export function Product(props){
  const navigate = useNavigate();
  return(
  <div className={styles.main}>
    <div className={styles.container}>
      <div className={styles.row}>
        {props.data ? props.data.map((item,index)=>(
          <div onClick={()=>{navigate(`/detail/${item.id}`)}} key={index} className={styles.col}>            
            <div className={styles.frame}>
              <img className={styles.thumnail} src={item.image.original} alt="상품 이미지"/>
            </div>
            <div className={styles.product}>
              {item.supply <= 0 
              ? 
              <div style={{display: 'flex'}}>
                <p style={{color: 'gray', textDecoration: "line-through"}}>
                  {item.title}
                </p>
                &nbsp;
                <p style={{color: '#CC0000', fontWeight: '650'}}>
                  품절
                </p>
              </div>
              : <p>{item.title}</p>}
              <div className={styles.price}>
              {item.discount
                ? <div style={{display: 'flex', alignItems: 'center', gap: '0.5em', justifyContent: 'flex-end'}}>
                  <p style={{textDecoration: "line-through", color: "gray", margin: '0'}}>
                    \{item.price}
                  </p>
                  <p>{item.discount 
                    ? <>
                      <span style={{color: 'red', fontWeight: '750'}}>
                        ({item.discount}%)
                      </span>
                      &nbsp; <i className="fal fa-long-arrow-right"/>
                      </>
                    : `${item.title}`}
                  </p>
                  <h3>
                    \{item.price-((item.price/100)*item.discount)}
                  </h3>
                </div>
                : <h3>\{item.price}</h3>
                }
                <br/><hr/><br/>
                <span>{item.category && `${item.category.main}`}</span>
              </div>
            </div>
          </div>
        ))
        : <>
          {/* 스켈레톤 레이아웃 */}
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
              &nbsp;
            </div>
          </div>
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
              &nbsp;
            </div>
          </div>
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
              &nbsp;
            </div>
          </div>
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
              &nbsp;
            </div>
          </div>
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
              &nbsp;
            </div>
          </div>
        </>
        }
      </div>
    </div>
  </div>
  )
}