import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import styles from './AdminUserList.module.css';
import axios from '../../../axios';
import { useUserFilter, useUserSort } from '../../../Store/DataStore';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';

export default function AdminUserList() {
    const userFilter = useUserFilter();
    const queryClient = useQueryClient();
    const userSort = useUserSort();

    const [sortBy, setSortBy] = useState([]);


    // ------------------------------서버 통신------------------------------ //
    //유저 데이터 fetch
    const fetchAllUserData = async () => {
        try {
            const response = await axios.get(
                "/auth/userAll",
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            // 성공 시 추가된 상품 정보를 반환합니다.
            return response.data.data;
        } catch (error) {
            // 실패 시 예외를 throw합니다.
            throw new Error('확인 중 오류가 발생했습니다.');
        }
    };
    //유저 필터링 Fetch
    const fetchFilteredUserData = async (userFilterData) => {
        try {
            const response = await axios.post("/auth/userFilter",
                JSON.stringify(
                    userFilterData
                ),
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            // 성공 시 추가된 상품 정보를 반환합니다.
            return response.data;
        } catch (error) {
            // 실패 시 예외를 throw합니다.
            throw new Error('조건에 일치하는 유저가 없습니다.');
        }
    }
    // 유저 필터링 Mutation
    const onFiltering = () => {
        filterMutation(userFilter, {
            onSuccess: (data) => {
                console.log('user Filtered successfully:', data);
                alert(data.message);
                // 다른 로직 수행 또는 상태 업데이트
                queryClient.setQueryData(['users'], () => {
                    return data.data
                })
            },
            onError: (error) => {
                console.error('user Filtered failed:', error);
                // 에러 처리 또는 메시지 표시
                alert(error.message);
            },
        });
    };
    //유저 정렬 Fetch
    const fetchSortedUserData = async (userFilterData) => {
        try {
            const response = await axios.post(
                "/auth/userSort",
                JSON.stringify(
                    userFilterData
                ),
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            // 성공 시 추가된 상품 정보를 반환합니다.
            return response.data;
        } catch (error) {
            // 실패 시 예외를 throw합니다.
            throw new Error('정렬할 순위가 없습니다.');
        }
    };
    // 유저 정렬 Mutation
    const handleSort = () => {
        sortMutation(userSort, {
            onSuccess: (data) => {
                console.log('user Sorted successfully:', data);
                alert(data.message);
                // 다른 로직 수행 또는 상태 업데이트
                queryClient.setQueryData(['users'], () => {
                    return data.data
                })
            },
            onError: (error) => {
                console.error('user Sorted failed:', error);
                // 에러 처리 또는 메시지 표시
                alert(error.message);
            },
        });
    };
    // 유저 삭제 fetch
    const fetchDeleteUserData = async (id) => {
        try {
            const response = await axios.post(
                "auth/userDel",
                JSON.stringify(
                    id
                ),
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )

            return response.data;
        } catch (error) {
            throw new Error('거래처 삭제 요청이 정상적으로 처리되지 않았습니다.');
        }
    }
    // 유저 삭제 mutation
    const handleDelete = () => {
        if (window.confirm('선택된 거래처를 정말 삭제하시겠습니까?')) {
            deleteMutation(checkedItems, {
                onSuccess: (data) => {
                    console.log('user Delete successfully:', data);
                    alert(data.message);
                    queryClient.setQueryData(['users'], () => {
                        return data.data
                    })
                },
                onError: (error) => {
                    console.error('user Delete failed:', error);
                    alert(error.message);
                }
            })
        } else {
            alert('취소되었습니다');
        }
    }

    const { data: users, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUserData
    })

    // mutate 정의
    const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredUserData });
    const { mutate: sortMutation } = useMutation({ mutationFn: fetchSortedUserData });
    const { mutate: deleteMutation } = useMutation({ mutationFn: fetchDeleteUserData });
    // ------------------------------서버 통신------------------------------ //



    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        if (!users) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return users.slice(startIndex, startIndex + itemsPerPage);
    };

    // 업데이트된 데이터의 체크 상태를 관리하는 state
    const [checkedItems, setCheckedItems] = useState([]);

    // 전체 체크박스 업데이트
    function handleAllCheckbox(isChecked) {
        const checked = isChecked;

        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            let idArray = getCurrentPagePosts()?.map((item) => item.users_id);
            setCheckedItems(idArray);
            console.log(checkedItems);
        } else {
            // 모두 체킹 해제
            setCheckedItems([]);
            console.log(checkedItems);
        }
    }

    // 체크박스 개별 업데이트
    function handlePerCheckbox(checked, users_id) {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckedItems(prev => [...prev, users_id]);
            console.log(checkedItems);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckedItems(checkedItems.filter((el) => el !== users_id));
            console.log(checkedItems);
        }
    }

    useMemo(() => {
        // data나 sortBy가 변경될 때마다 정렬
        // handleSort();
    }, [users, sortBy]);



    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (isError) {
        return <div>오류가 발생했습니다.</div>;
    }

    return (
        <div>
            <AdminHeader />
            <div className={styles.body}>
                <AdminMenuData />
                <div className={styles.mainContainer}>
                    <div className={styles.filtSortContainer}>
                        <AdminUserFilter onFiltering={onFiltering} />
                        <AdminUserSort sortBy={sortBy} onSort={handleSort} />
                    </div>
                    {/* Header */}
                    <div className='MediumHeader'>
                        <div className='HeaderTxt'>
                            목록
                        </div>
                        <select
                            className='select'
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                    {/* 선택항목일괄처리 */}
                    <div className={styles.selectedHandler}>
                        {[
                            { item: '선택항목 상태 수정', function: () => { } },
                            { item: '선택항목 송장 입력/수정', function: () => { } },
                            { item: '선택항목 배송 취소(삭제)', function: () => { } },
                        ].map((item, index) => {
                            return (
                                <button
                                    className='white_button'
                                    onClick={item.function}
                                    key={index}>
                                    {item.item}
                                </button>
                            );
                        })}

                    </div>

                    <table style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th><input
                                    type='checkbox'
                                    checked={checkedItems.length === getCurrentPagePosts().length ? true : false}
                                    onChange={(e) => handleAllCheckbox(e.target.checked)} /></th>
                                <th>구분</th>
                                <th>업체명(상호명)</th>
                                <th>등급</th>
                                <th>주소</th>
                                <th>연락처</th>
                                <th>CMS 여부</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCurrentPagePosts().map((user, index) => (
                                <tr key={index}>
                                    {/* 체크박스 */}
                                    <td><input
                                        type='checkbox'
                                        checked={checkedItems.includes(user.users_id) ? true : false}
                                        onChange={(e) => handlePerCheckbox(e.target.checked, user.users_id)} /></td>
                                    {/* 회원구분 */}
                                    <td>{user.userType_id === 1 ? "실 사용자" : "납품업자"}</td>
                                    {/* 거래처명 */}
                                    <td>{user.cor_corName}</td>
                                    {/* 등급 */}
                                    <td>{user.grade && user.grade}</td>
                                    {/* 주소 */}
                                    <td>{user.bname} {user.roadAddress}({user.zonecode})</td>
                                    {/* 연락처 */}
                                    <td>{user.cor_tel}</td>
                                    {/* CMS동의 여부 */}
                                    <td>{user.hasCMS === 1 ? "동의" : "비동의"}</td>
                                    {/* 삭제 */}
                                    <td>
                                        <button className='original_round_button'
                                            onClick={() => handleDelete()}>
                                            회원 삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}