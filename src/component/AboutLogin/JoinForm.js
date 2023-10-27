import { useState } from "react";
import styles from './RelativeJoin.module.css';
import axios from 'axios';

export default function JoinForm(props) {

    // 주소입력 API
    const [address, setAddress] = useState("");
    const openPopup = (setAddress) => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    setAddress(data); //표시용
                    props.setInputData((prevData) => ({
                        ...prevData,
                        address: data
                    }))
                }
            }).open();
        }
        document.body.appendChild(script);
    }
    // 무작위 사업자 등록번호 생성 함수 (테스트용)
    function generateRandomBusinessNumber() {
        const num1 = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        const num2 = String(Math.floor(Math.random() * 100)).padStart(2, '0');
        const num3 = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
        return num1 + '-' + num2 + '-' + num3;
    }

    // 테스트용 가짜 사업자 등록번호 생성
    const randomBusinessNumber = generateRandomBusinessNumber();

    // 사업자등록번호 인증 API
    const [apiResponse, setApiResponse] = useState(null);// API 호출 결과를 저장할 상태 변수
    // API 호출 함수
    const callApi = () => {
        const API_KEY = '%2FRM319x1LSNsYv3Zs4dbkeZ4iIGKMDc54ysPEQBiGmcIqj3%2Badug9JP2VKliI7op92oe7EeDVFnx3bKiYGdnVg%3D%3D';
        // API 호출
        axios.post('https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=' + API_KEY + '&returnType=JSON', {
            businesses: [
                {
                    b_no: randomBusinessNumber,
                    start_dt: "20000101",
                    p_nm: "홍길동",
                    p_nm2: "홍길동",
                    b_nm: "(주)테스트",
                    corp_no: "231-86-23454",
                    b_sector: "",
                    b_type: "",
                    b_adr: "",
                }
            ]
        })
            .then((response) => {
                // API 호출 성공 시 데이터를 상태 변수에 저장
                const responseData = response.data;
                setApiResponse(responseData);
                console.log(randomBusinessNumber);
                // if (responseData.status === "OK") {
                //     // 유효한 사업자 등록번호인 경우 데이터를 받아온다.
                //     setApiResponse(responseData);
                // } else {
                //     // 유효하지 않은 사업자 등록번호인 경우 알림창을 띄운다.
                //     alert("유효하지 않은 사업자 등록번호입니다.");
                // }
            })
            .catch((error) => {
                // API 호출 실패 시 에러 처리
                console.log(randomBusinessNumber);
                console.error('API 호출 중 에러:', error);
            });
    };
    // API 호출 버튼을 클릭하면 API를 호출하도록 설정
    const handleApiCall = () => {
        callApi();
    };


    //data 일치유무 체크
    let confirmPassword = props.inputData.password === props.inputData.confirmPassword;

    // 기업 정보
    const CorData = () => {
        return (
            <>
                {/* 기업명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>기업명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'ex) OO전자'}
                            value={props.inputData.corporationData.companyName}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({
                                        ...prevData,
                                        corporationData: {
                                            ...prevData.corporationData,
                                            companyName: e.target.value
                                        }
                                    })
                                )
                            }}
                        />
                        <button onClick={handleApiCall}>기업명 호출(미완성)</button>
                        {/* 해당 기업명을 호출 */}
                        {apiResponse && apiResponse.businesses && apiResponse.businesses[0] && (
                            // 기업명 출력
                            <div>
                                <h2>b_nm 값:</h2>
                                <p>{apiResponse.businesses[0].b_nm}</p>
                            </div>
                        )}
                    </div>
                </li>

                {/* 개인 OR 기업 체크박스 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>회원구분</div>
                    <div className={styles.right}>
                        <div className={styles.isInput}>
                            <div className={styles.typeMember}>
                                <input
                                    type="radio"
                                    id="indivisualMember"
                                    name="userType"
                                    value={props.inputData.userType}
                                    checked={props.inputData.userType === "indivisual"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType: 'indivisual' })
                                        )
                                    }}
                                />
                                <label htmlFor="indivisualMember">개인사업자</label>
                            </div>
                            <div className={styles.typeMember}>
                                <input
                                    type="radio"
                                    id="corporateMember"
                                    name="userType"
                                    value={props.inputData.userType}
                                    checked={props.inputData.userType === "corporation"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType: 'corporation' })
                                        )
                                    }}
                                />
                                <label htmlFor="corporateMember">법인사업자</label>
                            </div>
                        </div>
                    </div>
                </li>


                {/* 대표자명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표자명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'홍길동'}
                            value={props.inputData.corporationData.ceoName}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        ceoName: e.target.value
                                    }
                                }))
                            }}
                        />
                    </div>
                </li>

                {/* 대표번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type="text"
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                            value={props.inputData.corporationData.companyNum.num1}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        companyNum: {
                                            ...prevData.corporationData.companyNum,
                                            num1: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1234'}
                            maxLength="4"
                            size="8"
                            value={props.inputData.corporationData.companyNum.num2}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        companyNum: {
                                            ...prevData.corporationData.companyNum,
                                            num2: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 5678'}
                            maxLength="4"
                            size="8"
                            value={props.inputData.corporationData.companyNum.num3}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        companyNum: {
                                            ...prevData.corporationData.companyNum,
                                            num3: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        <div className={styles.notification}>
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="CEO_SMS"
                                    id="CEO_SMS_Y"
                                />
                                <label for="CEO_SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="CEO_SMS"
                                    id="CEO_SMS_N"
                                />
                                <label for="CEO_SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 사업자등록번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>사업자등록번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            id="coNum"
                            type='text'
                            placeholder={'숫자로만 이루어진 10자리 값으로만 조회 가능'}
                            value={props.inputData.corporationData.businessNum}
                            onChange={(e) => {
                                props.setInputData((prevData) => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        businessNum: e.target.value
                                    }
                                }))
                            }}
                        />
                        <button onClick={callApi}>사업자등록번호 인증</button>
                    </div>
                    {/* { apiResponse.status_code === "OK" ? <strong>정상적으로 인증되었습니다.</strong> : <strong>해당 번호로 인증할 수 없습니다.</strong> } */}
                </li>
                <li className={styles.inputContainer}>
                    {/* API 호출 결과 표시 */}
                    {apiResponse && (
                        <div>
                            <h2>인증 결과:</h2>
                            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                        </div>
                    )}
                </li>
            </>
        )
    }

    return (
        <div>
            {/* 회원정보를 입력해주세요! */}
            <strong className={styles.noti}>회원정보를 입력해주세요!</strong>

            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>
                <div className={styles.indivisualMembers}>기본정보</div>

                {/* 아이디 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>아이디</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'아이디'}
                            name="id"
                            value={props.inputData.id}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, id: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}> ?~??자리의 영문,숫자를 입력해주십시오.</div>
                    </div>
                </li>
                <div className={styles.warnningMessage}>
                </div>

                {/* 비밀번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='password'
                            placeholder={'비밀번호'}
                            name="password"
                            value={props.inputData.password}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, password: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>영문 및 특수문자, 숫자 조합의 8자리 이상 입력해주시기 바랍니다.</div>
                    </div>
                </li>

                {/* 비밀번호 확인 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호 확인</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='password'
                            placeholder={'비밀번호 재입력(일치 확인)'}
                            name="confirmPassword"
                            value={props.inputData.confirmPassword}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, confirmPassword: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>비밀번호 확인을 위해 다시 한 번 입력해주십시오.</div>
                    </div>
                </li>
                {confirmPassword ? null : <div className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다!
                </div>}

                {/* 이메일 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>이메일</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='email'
                            placeholder={'이메일'}
                            name="email"
                            value={props.inputData.email}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, email: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>
                            <strong>이메일 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    id="email_Y"
                                    name="emailService"
                                    value="yes"
                                    checked={props.inputData.emailService === "yes"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 'yes' })
                                        )
                                    }}
                                />
                                <label htmlFor="email_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    id="email_N"
                                    name="emailService"
                                    value="no"
                                    checked={props.inputData.emailService === "no"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 'no' })
                                        )
                                    }}
                                />
                                <label htmlFor="email_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>

                {/* 이름 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>이름</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'이름'}
                            name="name"
                            value={props.inputData.name}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, name: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>실명을 입력해주세요</div>
                    </div>
                </li>

                {/* 휴대폰 번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>휴대폰 번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                            name="num1"
                            value={props.inputData.num1}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, num1: e.target.value })
                                )
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 0101'}
                            maxLength="4"
                            size="8"
                            name="num2"
                            value={props.inputData.num2}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, num2: e.target.value })
                                )
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1010'}
                            maxLength="4"
                            size="8"
                            name="num3"
                            value={props.inputData.num3}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, num3: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>
                            {/* 추후  */}
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="smsService"
                                    id="SMS_Y"
                                    value="yes"
                                    checked={props.inputData.smsService === "yes"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 'yes' })
                                        )
                                    }}
                                />
                                <label htmlFor="SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="smsService"
                                    id="SMS_N"
                                    value="no"
                                    checked={props.inputData.smsService === "no"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 'no' })
                                        )
                                    }}
                                />
                                <label htmlFor="SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 우편번호 찾기 */}
                <li>
                    <div className={styles.inputContainer}>
                        <div className={styles.left}>배송주소</div>
                        <div className={styles.right}>
                            <div className={styles.rightInnerContainer}>
                                <div className={styles.searchAddress}>
                                    <input
                                        className={styles.isInput}
                                        type="text"
                                        placeholder="우편번호"
                                        readOnly
                                        name="address"
                                        value={address && address.zonecode}
                                        onChange={(e) => {
                                            props.setInputData(
                                                (prevData) => ({ ...prevData, address: e.target.value })
                                            )
                                        }}
                                    />
                                    <input
                                        className={styles.searchButton}
                                        type="button"
                                        onClick={() => {
                                            openPopup(setAddress);
                                        }}
                                        value="우편번호 찾기"
                                    />
                                </div>
                                <div className={styles.inputAddress}>
                                    <input
                                        className={styles.loadname}
                                        type="text"
                                        value={address && address.roadAddress}
                                        placeholder="도로명 주소"
                                        readOnly
                                    />
                                    <input
                                        className={styles.buildingname}
                                        type="text"
                                        value={
                                            address && address.buildingName
                                                ?
                                                `(${address.bname}, ${address.buildingName})`
                                                :
                                                address && `(${address.bname}, ${address.jibunAddress})`
                                        }
                                        placeholder="건물 이름 또는 지번 주소"
                                        readOnly
                                    />
                                    <input
                                        className={styles.detailAddress}
                                        type="text"
                                        placeholder="상세주소를 입력해주세요."
                                        name="detailAddress"
                                        value={props.inputData.detailAddress}
                                        onChange={(e) => {
                                            props.setInputData(
                                                (prevData) => ({ ...prevData, detailAddress: e.target.value })
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 기업 정보 */}
                <CorData /> 

            </ul>
        </div>
    )
}