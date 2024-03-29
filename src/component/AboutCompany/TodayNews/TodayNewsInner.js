import styles from './TodayNewsInner.module.css'
import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner'
import { useNavigate, useParams } from 'react-router-dom'
import { useTopicData } from '../../store/DataStore';
export function TodayNewsInner(props){
  const {todayTopicData} = useTopicData();
  const navigate = useNavigate();
  let {id} = useParams();
  const loadData = ()=> {
    if(todayTopicData){
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const listData = todayTopicData.find((item)=>item.id==id);
      return listData;
    } else {
      return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
    }
  }

  //로딩된 데이터 불러오기
  const postData = loadData();

  return(
    <div>
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>오늘의 뉴스</h1>
        </div>
        <div className={styles.contentsHead}>
          {/* 본문 제목 */}
          <div>
            <h1>{todayTopicData && postData ? postData.title
            : '로딩중'}
            </h1>
          </div>
          <div>
            <h4>관리자 | {todayTopicData && postData ? postData.date
            : '로딩중'}</h4>
          </div>
        </div>
        <div className={styles.contentsBody}>
          {/* 본문 내용 */}
          <p>{todayTopicData && postData ? postData.content
          : '로딩중'}</p>
        </div>
        <div className={styles.contentsFoot}>
          <div>
            <button
            className={styles.button} 
            onClick={()=> {
              if((postData.id-1) >= 1) {
                navigate(`/todayTopicPost/${postData.id - 1}`)
              } else {
                alert("현재 게시글이 목록의 첫 게시글입니다.")
              }
              }}>
              <i className="far fa-angle-left"/>
            </button>
            <button
            className={styles.button}
            onClick={()=> {
              if(todayTopicData.includes(postData.id + 1)) {
                navigate(`/todayTopicPost/${postData.id + 1}`);
              } else {
              alert("현재 게시글이 목록의 마지막 게시글입니다.")
              }
              }}>
              <i className="far fa-angle-right"/>
            </button>
          </div>
          <div onClick={()=>navigate("/todayTopic/1")} className={styles.listButton}>
            목록보기
          </div>
        </div>
      </main>
    </div>
  )
}