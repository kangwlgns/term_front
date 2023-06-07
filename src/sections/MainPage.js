import { React, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { cnoNumber } from '../state/state.js';
import Reservation from './Reservation.js';
import axios from 'axios';
import logo from './logo.jpg';

function MainPage() {
    const cno = useRecoilValue(cnoNumber);
    const [recvdata, setRecvdata] = useState({});
    const [prev, setPrev] = useState([]);
    const [rent, setRent] = useState([]);
    const [reser, setReser] = useState([]);

    const [showjaryo, setShowJaryo] = useState(true);
    const [showreserve, setShowReserve] = useState(false);

    const firstCome = async () => {
        try {
            const res = await axios.get('/localhost:3001');
            setRecvdata(res.data);
        } catch (error) {
            console.error('ERROR!', error);
        }
    };

    useEffect(() => {
        firstCome();
    }, []);

    useEffect(() => {
        setPrev(recvdata.previous);
        setRent(recvdata.current);
        setReser(recvdata.reserve);
    }, [recvdata]);

    const cancelReservation = (plate) => {
        const url = 'localhost"3001/';
        const data = { plateno: plate, cno: cno }

        axios.post(url, data)
            .then(res => {
                if (res.data.result === 'success') {
                    alert('예약을 취소하였습니다.');
                    firstCome();
                } else {
                    alert('예약을 취소하지 못했습니다.')
                }
            })
            .catch(err => {
                console.error('Error', err);
                alert("ERROR!");
            });
    }

    // 더미 데이터 예시
    // const reservationData = [
    //     { id: 1, car: 'Hyundai Sonata', date: '2023-06-10' },
    //     { id: 2, car: 'Kia Sorento', date: '2023-06-12' },
    //     // 예약 내역 데이터 추가
    // ];

    // const currentRentalData = [
    //     { id: 1, car: 'Hyundai Sonata', startDate: '2023-06-05', endDate: '2023-06-09' },
    //     { id: 2, car: 'Kia Sorento', startDate: '2023-06-02', endDate: '2023-06-08' },
    //     // 현재 대여 내역 데이터 추가
    // ];

    // const previousRentalData = [
    //     { id: 1, car: 'Hyundai Sonata', startDate: '2023-05-28', endDate: '2023-06-03' },
    //     { id: 2, car: 'Kia Sorento', startDate: '2023-05-25', endDate: '2023-06-01' },
    //     // 이전 대여 내역 데이터 추가
    // ];
    

    return (
        <div style={{width: "100%", height:"100%", display: "flex",  flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "1em"}}>
            <div> 
                { rent.length == 0 ? <img src={logo} style={{height:'250px'}}/> : 
                    <h3> 고객님의 현재 대여 내역 </h3>
                }
            </div>

            <div style={{width: "100%", paddingTop: '15px', display: "flex", justifyContent: "center", alignItems: "center"}}>
                <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginRight: "10px", cursor: "pointer"}}
                onClick={() => {setShowJaryo(true); setShowReserve(false)}}>
                    자료실
                </button>

                <button style={{width: "40%", height: "30px", borderRadius: "5px", border: "none", marginLeft: "10px", cursor: "pointer"}}
                onClick={() => {setShowJaryo(false); setShowReserve(true)}}>
                    예약하기
                </button>
            </div>

            <div style={{paddingBottom: "40px"}}>
                {showjaryo ? (
                    <div>
                    <h2>자료실</h2>
              
                    <h3>예약 내역</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>차량</th>
                          <th>예약일자</th>
                          <th>액션</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reser.map((row) => (
                          <tr key={row[0]}>
                            {row.map((col, colIndex) => (
                                <td key={colIndex}>{col}</td>
                            ))}
                            <td>
                              <button onClick={cancelReservation(row[0])}>예약취소</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              
                    <h3>현재 대여 내역</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>차량</th>
                          <th>대여 시작일</th>
                          <th>대여 종료일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rent.map((row) => (
                          <tr key={row[0]}>
                            {row.map((col, colIndex) => (
                                <td key={colIndex}>{col}</td>
                            ))}
                            <td>
                              <button onClick={cancelReservation(row[0])}>예약취소</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              
                    <h3>이전 대여 내역</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>차량</th>
                          <th>대여 시작일</th>
                          <th>대여 종료일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prev.map((row) => (
                          <tr key={row[0]}>
                            {row.map((col, colIndex) => (
                                <td key={colIndex}>{col}</td>
                            ))}
                            <td>
                              <button onClick={cancelReservation(row[0])}>예약취소</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {showreserve ? (
                    <Reservation></Reservation>
                ) : null}
            </div>  
        </div>
    )
}

export default MainPage;