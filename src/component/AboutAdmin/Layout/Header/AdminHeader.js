import styles from './AdminHeader.module.css'
import logo from '../../../../image/logo.jpeg';
import { AdminHeaderSearchBar } from './AdminHeaderSearchBar'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function AdminHeader(){
  const [filterModal, setFilterModal] = useState(false);
  const navigate = useNavigate();
  return(
    <div>
      <div className={styles.background}>
        <img style={{cursor: 'pointer'}} src={logo} alt='로고' height='70px' onClick={()=> navigate("/adminMain")}/>
        <AdminHeaderSearchBar/>
        <div style={{display: 'flex', gap: '2em', alignItems: 'center'}}>
          <i 
          className="fal fa-bell"
          style={{fontSize: '1.5em', cursor: 'pointer'}}/>
          <div 
          onClick={()=>setFilterModal(!filterModal)}
          className={styles.searchFilter}>
            Admin 
            <i 
            style={{color:'gray'}} 
            className={filterModal 
            ? 'fas fa-angle-up' 
            : 'fas fa-angle-down'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}