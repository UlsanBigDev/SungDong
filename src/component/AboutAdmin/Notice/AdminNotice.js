import { useState } from "react";
import styles from "./AdminNotice.module.css";
import { AdminHeader } from "../AdminHeader";
import { AdminMenuData } from "../AdminMenuData";
import WrtieModal from "./WriteModal";
import EditModal from "./EditModal";

export default function (props) {
  // State
  const [modal, setModal] = useState(false); // modal on / off
  const [modalName, setModalName] = useState(''); // what is modal?
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // 해당 인덱스의 모달을 찾기 위함
  /* 추후
  const [selectedFile, setSelectedFile] = useState(null); // 파일 업로드 state

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
  };

  const handleUpload = () => {
      if (selectedFile) {
          // 파일 업로드 로직을 구현합니다.
          // 여기에서 서버로 파일을 업로드하거나 다른 작업을 수행할 수 있습니다.
          // 선택한 파일은 selectedFile 변수에 있습니다.
          // 예를 들어, axios를 사용하여 서버로 파일을 업로드하는 방법:
          // const formData = new FormData();
          // formData.append('file', selectedFile);
          // axios.post('/upload', formData)
          //   .then(response => {
          //     // 파일 업로드 성공 시 처리
          //   })
          //   .catch(error => {
          //     // 업로드 실패 시 처리
          //   });
      }
  };
  */

  // 현재 시간을 얻기 위해 Date 객체 생성
  const currentDate = new Date();

  // 현재 날짜 및 시간 정보 얻기
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();


  // Enter key를 누를 시, 모달 창 오픈
  const onOpen = (event, index) => {
    if (event.key === 'Enter') {
      setModal(true);
      setSelectedItemIndex(index);
    }
  }

  const openWriteModal = () => {
    setModal(true);
    setModalName('write');
  }

  const closeWriteModal = () => {
    setTempList({
      id: '',
      title: '',
      contents: '',
      writer: '',
      date: '',
      file: '',
    });
    setModal(false);
    setModalName('');
  }

  // 글 담기
  const [tempList, setTempList] = useState({
    id: '', // length + 1로 지정할 것.
    title: '',
    contents: '',
    writer: '', // 관리자 로그인 계정의 이름으로 자동 들어가도록
    date: '', // 추후에 자동으로 날짜를 받아오는 api 구현
    file: '',
  })

  const addPost = () => {
    const { title, writer, contents } = tempList; // 입력 값들을 자체 할당
    const isInputValid = title.length > 2 && writer.length > 2 && contents.length > 10; // 입력 조건 부여
    // 조건에 부합한다면
    if (isInputValid) {
      const newPost = {
        id: props.list.length + 1,
        title,
        contents,
        writer,
        date: `${currentYear}/${currentMonth}/${currentDay} ${currentHour}시 ${currentMinute}분`,
      };
      // 입력받은 정보를 추가
      props.setList((prevListData) => [...prevListData, newPost]);
      alert("등록되었습니다.");
      // 입력란 초기화
      setTempList({
        id: '',
        title: '',
        contents: '',
        writer: '',
        date: '',
        file: '',
      });

      setModal(false);
      setModalName('');
    } else {
      alert("제목, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }

  };


  // 글 클릭 시 해당 글 수정할 수 있는 모달 창 생성

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContents}>
          {/* 코드발급 | 최신코드 묶음 */}
          <div className={styles.writeContainer}>
            {/* 코드 발급 블록 */}
            <div className={styles.writeContainer_inner}>
              <div className={styles.writeNotice_icon}>Click <i class="fa-solid fa-arrow-down"></i></div>
              <div className={styles.write} onClick={() => { openWriteModal() }}>글 작성</div>
            </div>
            {/* 뭐 넣을지 미정 */}
            <div className={styles.none_block}>
              <div className={styles.none_title}>
                custom title
              </div>
              <div className={styles.none_code}>
                custom contents
              </div>
            </div>
          </div>
          {/* 글 목록 */}
          <div className={styles.noticeList_block}>
            {/* Title */}
            <div className={styles.noticeList_title}>글 목록</div>
            {/* List */}
            {props.list.map((item, index) => (
              <div className={styles.noticeList_list} onClick={() => { onOpen(item, index) }}> {/* 선택 모달의 key를 글 수정으로 지정*/}
                {/* No */}
                <div className={styles.noticeList_no}
                  key={index}>
                  {index + 1}
                </div>
                {/* Code */}
                <div className={styles.noticeList_code}
                  key={index}>
                  {item.title}
                </div>
                {/* Del */}
                <div>
                  <div className={styles.notice_del}
                    onClick={() => {
                        const data = [...props.list];
                        data.splice(index, 1);
                        props.setList(data);
                      }
                     }>
                    삭제
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        modal && modalName == 'write' ?
          <WrtieModal modalName={modalName} setModalName={setModalName} modal={modal} setModal={setModal} tempList={tempList} setTempList={setTempList} addPost={addPost} closeWriteModal={closeWriteModal} />
          :
          modal && modalName == 'edit' ?
            <EditModal tempList={tempList} setTempList={setTempList} selectedItemIndex={setSelectedItemIndex} setSelectedItemIndex={setSelectedItemIndex} />
            :
            ''
      }

    </div>
  )
}