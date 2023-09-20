import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import MainLogo from '../../image/sungdonglogo.svg';
import { useContext, useState } from 'react';
import FindModal from './FindModal';
import CodeInputModal from './CodeInputModal';
import axios from 'axios';
import UserContext from '../../context/UserContext';
export function Login(props) {
  const { isLogin, login, logout } = useContext(UserContext);

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');


  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null); //modal type이 id? pw?

  const openModal = (type) => {
    setModalType(type) //onClick에서 type을 넣어 id면 idModal이 pw면 pwModal이 나타나도록.
  }

  const closeModal = () => {
    setModalType(null); //초기화 시켜서 모달창을 닫음
  }

  // 로그인 함수
  const goLogin = async () => {
    try {
      const response = await loginRequest();
      if (response.data && response.data.message === "success") {
        alert("성동물산에 오신 걸 환영합니다.")
        login()
        window.location.href = "/"
      } else {
        alert("아이디 혹은 비밀번호를 확인주세요.")
      }
    } catch { // 서버가 없는경우 기존 태훈, 지석 코드
      developLogin();
    }
    
  }
  async function loginRequest() {
    const response = await axios.post(
      "/user",
      JSON.stringify({
        id : id,
        password : pw
      }),
      {
        headers : {
          "Content-Type" : "application/json"
        }
      }
    )
    return response;
  }

  function developLogin() { //서버 없이 테스트용 로그인 함수
    const confirmUser = props.userData.find(userData => userData.id === id && userData.password === pw); //UserData의 id,password와 input받은 id,pw값이 일치하는 것을 꺼내옴
    if (confirmUser && confirmUser.id === id && confirmUser.password === pw) { //꺼내 온 id,pw가 일치한다면 
      setId(''); //입력된 id를 지움
      setPw(''); //입력된 pw를 지움
      console.log(props.userData); //확인된 유저데이터에 뭐가 들었는지 console로 확인
      //session에 담을 data 객체
      const LoginDataObj = {
        id: id,
        pw: pw,
      }
      sessionStorage.setItem('saveLoginData', JSON.stringify(LoginDataObj)); //로그인 정보를 sessionStorage로 저장
      navigate('/'); //메인페이지로 이동하면서
      alert('성동물산에 오신 걸 환영합니다!'); //환영문구 출력
      window.location.reload();
      console.log(props.userData);
    } else { //일치하지 않다면
      alert('아이디 혹은 비밀번호를 확인주세요.'); //경고문구 출력
      console.log(props.userData.address);
    }
  }

  // 자동로그인 - 로그인정보 로컬스토리지 저장
  function autoLogin() {
    localStorage.setItem('autoLogin', )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { //누른 키가 Enter라면
      goLogin(); //goLogin함수 실행
    }
  }
  return (
    // 화면 정렬을 위해 전체div에 style부여
    <div className={styles.body}>
      {/* loginPageContainer */}
      <div className={styles.loginPageContainer}>
        {/* Logo */}
        <div className="hello">
          <img
            src={MainLogo}
            alt="로고"
            height={250}
            className={styles.logo}
            onClick={() => { navigate("/") }}
          />
        </div>
        {/* LoginContentsContainer */}
        <div className={styles.loginContentsContainer}>
          {/* loginContainer */}
          <div className={styles.loginContainer}>
            <div className={styles.inputContainer}>
              {/* ID 입력란 */}
              <div>
                <input type='text' className={styles.inputId} placeholder={"아이디를 입력하세요"} value={id} onChange={e => setId(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
              {/* PW 입력란*/}
              <div>
                <input type='password' className={styles.inputPW} placeholder={"패스워드를 입력하세요"} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
              <div className={styles.autoLoginCheckBox}>
                <input type='checkbox' id='autoCheckbox' />
                <label htmlFor="autoCheckbox">로그인 상태 유지</label>
              </div>
              {/* Login Button */}
              <div className={styles.goLogin}
                onClick={goLogin}
              >
                로그인
              </div>
            </div>
          </div>

          {/* Find Id&PW Button | join Button */}
          <div className={styles.findDiv}>
            <div className={styles.findId} onClick={() => { openModal('id') }}>아이디 찾기</div>
            <div>|</div>
            <div className={styles.findPW} onClick={() => { openModal('pw') }}>비밀번호 찾기</div>
            <div>|</div>
            <div className={styles.join} onClick={() => { openModal('code') }}>회원가입</div>
          </div>
        </div>

        {/* 아이디or비밀번호 둘 중 하나를 누르기만 하면 찾기창 오픈 
         ->오픈했을 때 나타나는 화면은 openModal의 state에 따라 FindModal.js에서 결정 */}
        {modalType &&
          <FindModal userData={props.userData} setUserData={props.setUserData} modalType={modalType} closeModal={closeModal} openModal={openModal} />}

        {/* 회원가입을 눌러야만 코드입력창 오픈 */}
        {modalType === 'code' &&
          <CodeInputModal userData={props.userData} setUserData={props.setUserData} closeModal={closeModal} codeState={props.codeState} setCode={props.setCodeState} />}
      </div>

    </div>
  )
}