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

    const handleReservation = () => {
        const url = 'localhost:3001/';
        const data = {start: startDate, end: endDate};

        axios.post(url, data)
            .then(res => {
                setAvailableCars(res.data);

                if (res.data.length == 0) {
                    alert("대여 가능한 차가 없습니다.");
                }
            })
            .catch(error => {
                console.error("Error" + error);
                alert("ERROR!");
            });

        // const dummyData = [
        //     { id: 1, carNum: '44주4444', model: 'Sonata', type: 'SUV', fuel: 'LPG', seats: '4', price: '40000', option: '옵션' },
        //     { id: 2, carNum: '44주4444', model: 'Sorento', type: '대형', fuel: 'LPG', seats: '4', price: '40000', option: '옵션' },
        //     { id: 3, carNum: '44주4444', model: 'Camry', type: '소형', fuel: 'LPG', seats: '4', price: '40000', option: '옵션' },
        // ];
        // setAvailableCars(dummyData);
    };
    const carTypes = [
        { value: 0, name: '전체' },
        { value: 1, name: '대형' },
        { value: 2, name: '중형' },
        { value: 3, name: '소형' },
        { value: 4, name: '승합' },
        { value: 5, name: 'SUV' },
        { value: 6, name: '고급' },
    ];

    const SelectBox = (props) => {
        const handleSelectChange = (e) => {
            const selectedValue = e.target.value;
            setCarSelect(selectedValue);
        };
        return (
            <select value={carSelect} onChange={handleSelectChange}>
                {props.options.map((option) => (
                    <option key={option.value} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
        );
    };

    const [selectCarTypes, setSelectCarTypes] = useState(['차종을 선택']);

    const handleCarSelect = (selectedName) => {
        setCarSelect(selectedName);
    };
    const filteredCars = availableCars.filter(car => {
        if (carSelect === '전체') {
            return true;
        } else {
            return car.type === carSelect;
        }
    });
    const reservate = (props) => {
        Swal.fire({
            icon: 'warning',
            title: '예약',
            text: `[${props.model}] ㄹㅇ 예약합??`,
            showCancelButton: true,
            confirmButtonText: '예약',
            cancelButtonText: '취소',
        }).then((res) => {
            if (res.isConfirmed) {
                const url = 'localhost:3001/'
                const data = {
                    start: startDate,
                    end: endDate,
                    cno: cno,
                    plateno: `${props.carNum}`
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
                <button onClick={handleReservation}>검색하기</button>
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
                                <td style={{ padding: '0 10px' }}>{car.carNum}</td>
                                <td style={{ padding: '0 10px' }}>{car.model}</td>
                                <td style={{ padding: '0 10px' }}>{car.type}</td>
                                <td style={{ padding: '0 10px' }}>{car.fuel}</td>
                                <td style={{ padding: '0 10px' }}>{car.seats}</td>
                                <td style={{ padding: '0 10px' }}>{car.price}</td>
                                <td style={{ padding: '0 10px' }}>{car.option}</td>
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