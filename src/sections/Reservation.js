import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { cnoNumber } from '../state/state';

const Reservation = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [carSelect, setCarSelect] = useState(null);
    const [availableCars, setAvailableCars] = useState([]);
    const cno = useRecoilValue(cnoNumber);

    // 예약하는 코드
    const handleReservation = async (e) => {
        // 새로고침 방지
        e.preventDefault();
        const url = 'http://localhost:3001/car';
        const data = {start: startDate, end: endDate};

        // 시작날짜, 반납날짜를 백엔드에 전송
        await axios.post(url, data)
            .then(res => {
                // 해당 날짜에 대여가 가능한 차량에 대해 받고 변수에 값 넘겨줌.
                setAvailableCars(res.data.data);

                // 만약 돌려받은 차량이 없는 경우 알림.
                if (res.data.length == 0) {
                    alert("대여 가능한 차가 없습니다.");
                }
            })
            .catch(error => {
                console.error("Error" + error);
                alert("ERROR!");
            });

    };

    // Select box에 사용할 차량 타입 
    const carTypes = [
        { value: 0, name: '전체' },
        { value: 1, name: '대형' },
        { value: 2, name: '중형' },
        { value: 3, name: '소형' },
        { value: 4, name: '승합' },
        { value: 5, name: 'SUV' },
        { value: 6, name: '고급' },
    ];

    // select box 구현부분
    const SelectBox = (props) => {
        const handleSelectChange = (e) => {
            // select box 누르면 예약 가능한 차량이 보여짐
            const selectedValue = e.target.value;
            setCarSelect(selectedValue);
        };
        return (
            // 예약 가능한 차량 목록 순회하면서 보여주기
            <select value={carSelect} onChange={handleSelectChange}>
                {props.options.map((option) => (
                    <option key={option.value} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
        );
    };

    const handleCarSelect = (selectedName) => {
        setCarSelect(selectedName);
    };

    // select box에서 선택한 차량종류들만 보이도록 필터링
    const filteredCars = availableCars.filter(car => {
        if (carSelect === '전체') {
            return true;
        } else {
            return car[2] === carSelect;
        }
    });
    // 예약버튼 실행시 차량번호, 시작날짜, 끝날짜, 번호를 보내 예약하기
    const reservate = (props) => {
        Swal.fire({
            icon: 'warning',
            title: '예약',
            text: `[${props[1]}] 예약하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '예약',
            cancelButtonText: '취소',
        }).then((res) => {
            if (res.isConfirmed) {
                const url = 'http://localhost:3001/reserve'
                const data = {
                    plateno: `${props[0]}`,
                    start: startDate,
                    end: endDate,
                    cno: cno
                }
                axios.post(url, data)
                    .then((res) => {
                        if (res.data.result === 'success') {
                            alert("예약에 성공하였습니다.");
                        } else {
                            alert("예약하지 못했습니다.");
                        }
                    })
                    .catch(err => {
                        console.error("Error", err);
                        alert("ERROR!");
                    });
            }
        });
    };

    return (
        <div>
            <h2>예약하기</h2>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <SelectBox options={carTypes} defaultValue="0" onChange={handleCarSelect} />

            {startDate > endDate ? (
                <button disabled={true}> 날짜 부적합</button>
            ) : (
                <button onClick={handleReservation}>차량 목록 불러오기</button>
            )}
            {filteredCars.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center',marginTop: '20px'}}>
                    <table>
                        <thead>
                        <tr>
                            <th style={{ padding: '0 10px' }}>차량 번호</th>
                            <th style={{ padding: '0 10px' }}>모델</th>
                            <th style={{ padding: '0 10px' }}>차종</th>
                            <th style={{ padding: '0 10px' }}>연료</th>
                            <th style={{ padding: '0 10px' }}>좌석</th>
                            <th style={{ padding: '0 10px' }}>가격</th>
                            <th style={{ padding: '0 10px' }}>옵션</th>
                            <th style={{ padding: '0 10px' }}>예약하기</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCars.map((car) => (
                            <tr key={car.id}>
                                <td style={{ padding: '0 10px' }}>{car[0]}</td>
                                <td style={{ padding: '0 10px' }}>{car[1]}</td>
                                <td style={{ padding: '0 10px' }}>{car[2]}</td>
                                <td style={{ padding: '0 10px' }}>{car[3]}</td>
                                <td style={{ padding: '0 10px' }}>{car[4]}</td>
                                <td style={{ padding: '0 10px' }}>{car[5]}</td>
                                <td style={{ padding: '0 10px' }}>{car[6]}</td>
                                <td style={{ padding: '0 10px' }}>
                                    <button onClick={() => reservate(car)}>예약하기</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reservation;