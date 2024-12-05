import axios from 'axios';
import styles from "../../../../styles/ListSearch.module.css";
import Pagination from "../../../../utils/Pagination";
import React, { useState, useEffect } from 'react';
import ListSearch from './ListSearch';

function ProductList({ handleDetail, setShowModal }) {
    const [products, setProducts] = useState([]); // 상품 목록 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태 관리
    const [productBList, setProductBList] = useState([]); // 대분류 코드 목록 상태
    const [productBCode, setProductBCode] = useState(''); // 선택된 대분류 코드 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [itemsPerPage, setItemsPerPage] = useState(5); // 페이지당 항목 수 (기본값 5)


    // 대분류 코드 목록을 서버에서 받아오는 함수
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/product'); // 상품 API 경로
                setProducts(response.data); // 상품 데이터 상태 업데이트
            } catch (error) {
                console.error('대분류 데이터를 가져오는 데 실패했습니다:', error);
            }
        };
    
        fetchProducts();
    }, []);

    // products 상태가 업데이트되면 filteredData도 갱신
    useEffect(() => {
        setFilteredData(products || []);
    }, [products]);

    // 검색어 상태를 업데이트 해주는 함수
    const onChange = (term) => {
        setSearchTerm(term);
    };

    // 버튼 클릭 시 필터링 처리(상품명과 대분류명으로 상품 찾기)
    const handleSearchClick = () => {
        const filtered = products.filter((item) => {
            const isProductNameMatch = item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const isProductBNameMatch = item.product_b && item.product_b.productBName && item.product_b.productBName.toLowerCase().includes(searchTerm.toLowerCase());
    
            // 상품명이나 대분류명이 일치하면 필터링
            return isProductNameMatch || isProductBNameMatch;
        });
        setFilteredData(filtered);
        setCurrentPage(1); //검색 후 첫 페이지로 이동
    };

    const fetchProductBList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/productBList');  // 대분류 목록 API 경로로 수정
            setProductBList(response.data);  // 대분류 목록 상태 업데이트
        } catch (err) {
            console.log('대분류 목록을 불러오는 데 실패했습니다 : ', err);
        }
    };

    // 대분류 코드 변경 시 처리하는 함수
    const handleSelectChange = (event) => {
        setProductBCode(event.target.value);
    };

    // 페이지별 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage; // itemsPerPage : 한 페이지에 표시할 서비스의 수를 정의
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    //currentItems : filteredData를 기준으로 현재 페이지에 해당하는 데이터를 계산
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <>
            <h2 style={{ textAlign: "center" }}>소분류 목록</h2>

            <div style={{ width: "80%", margin: "0 auto", display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "20px" }}>
                <ListSearch 
                    searchTerm={searchTerm}
                    onChange={onChange}
                    handleSearchClick={handleSearchClick}
                    handleSelectChange={handleSelectChange}  // 선택값 변경 처리 함수 전달
                />
                <div>
                    <button className="btn btn-info" style={{ marginRight: "10px" }}>상품 발주</button>
                    <button onClick={() => setShowModal(true)} className="btn btn-success">상품 등록</button>
                </div>
            </div>

            <table className="table table-bordered" style={{ margin: "0 auto", width: "80%", position: "relative" }}>
                <thead>
                    <tr>
                        <th>대분류</th>
                        <th>상품 코드</th>
                        <th>상품명</th>
                        <th>상품 금액</th>
                        <th>상품 수량</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((product) => (
                        <tr key={product.productCode}>
                            <td>{product.productCode}</td>
                            <td>{product.productCode}</td>
                            <td>
                                <span
                                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                    onClick={() => handleDetail(product)}>
                                    {product.productName}
                                </span>
                            </td>
                            <td>{product.productPrice.toLocaleString()} 원</td>
                            <td>{product.productEa}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">등록된 상품이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage} // 현재 상태 값 전달
                setItemsPerPage={setItemsPerPage} // setItemsPerPage 함수 전달
            />
        </>
    );
}

export default ProductList;