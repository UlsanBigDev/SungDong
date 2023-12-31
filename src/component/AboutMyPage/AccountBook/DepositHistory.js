import styles from '../Table.module.css';
import { DepositHistoryFilter } from './DepositHistoryFilter';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from 'axios';
export function DepositHistory(){
  const fetchData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/deposit", 
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      return response.data;
    } catch(error) {
      throw new Error('원장 내역을 불러오던 중 오류가 발생했습니다.');
    }
  }
  //const { isLoading, isError, error, data:depositData } = useQuery({queryKey:['deposit'], queryFn: ()=> fetchData();});
  return(
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 입금내역 조회</h1>
      </div>
      {/* 필터 */}
      <DepositHistoryFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>구분</th>
              <th>입금유형</th>
              <th>입금일자</th>
              <th>실제입금일</th>
              <th>입금액</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>구분</td>
              <td>입금유형</td>
              <td>date</td>
              <td>date</td>
              <td>입금액</td>
              <td>비고내역</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}