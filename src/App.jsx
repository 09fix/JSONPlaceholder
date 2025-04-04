// HTTP 요청을 보내고, 응답을 처리하는 axios 라이브러리를 삽입합니다.
import axios from "axios";
// --------------------------------------------------
// 컴포넌트의 상태 관리를 위해 useState를 삽입합니다.
// API 요청(컴포넌트가 처음 렌더링될 때만 실행)을 위해 useEffect를 삽입합니다.
import { useEffect, useState } from "react";
// --------------------------------------------------
import "./App.css";
// --------------------------------------------------
function App() {
  const [posts, setPosts] = useState([]); // API에서 받아온 게시글 데이터를 저장합니다.
  const [loading, setLoading] = useState(true); // 데이터를 불러오는 중인지 아닌지를 저장합니다.
  const [error, setError] = useState(""); // 오류 메시지를 저장합니다.
  // --------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태. (기본값: 1)
  const [postsPerPage] = useState(5); // 한 페이지에 보여줄 게시글의 수 (기본값: 5)
  // --------------------------------------------------
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 열림/닫힘 (기본값: 닫힘)
  // --------------------------------------------------
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchField, setSearchField] = useState("title"); // 검색필드 (기본값: title)
  // --------------------------------------------------
  // 검색조건에 따라 필터링된 게시글 배열입니다.
  // searchFiled를 이용해서, title, body, userId를 구분합니다.
  // toString()을 이용해서, 숫자 값과 문자 값을 구분하지 않습니다.
  // toLowerCase()를 이용해서, 대소문자 구분을 하지 않습니다.
  const filteredPosts = posts.filter((post) => {
    const filedValue = post[searchField]?.toString().toLowerCase();
    return filedValue.includes(searchKeyword.toLowerCase());
  });
  // --------------------------------------------------
  // 현재 페이지의 마지막 게시글 인덱스입니다.
  // 예시) 2페이지, 마지막 인덱스 -> 2 * 5 = 10
  const indexOfLastPost = currentPage * postsPerPage;
  // 현재 페이지에서 첫 번째 게시글의 인덱스입니다.
  // 예시) 2페이지, 첫번째 인덱스 -> 10 - 5 = 5
  // slice() 인덱스는 마지막인덱스를 가져오지 않기 때문에, +1을 해줄 필요가 없습니다.
  // 예시) slice(1,4) -> [1, 2, 3]
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // filteredPosts 배열에서 indexOfFirstPost부터 indexOfLastPost 전 까지의 범위를
  // 잘라서 현재 페이지에 해당하는 게시글을 가져옵니다.
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  // --------------------------------------------------
  // 페이지네이션 페이지 번호를 계산하는 함수입니다.
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // --------------------------------------------------
  // 모달창 열기
  const openModal = (post) => {
    setSelectedPost(post); // 선택된 게시글 데이터
    setIsModalOpen(true); // 모달창 열기
  };
  // 모달창 닫기
  const closeModal = () => {
    setSelectedPost(null); // 선택된 게시글 초기화
    setIsModalOpen(false); // 모달창 닫기
  };
  // --------------------------------------------------
  // 검색어를 입력할 때마다, 자동으로 1페이지로 돌아가게 합니다.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, searchField]);

  useEffect(
    () => {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
          // 요청 성공 시, 실행되는 코드입니다.
          setPosts(response.data); // 응답 데이터를 posts 상태에 저장합니다.
          setLoading(false); // 로딩 상태를 false로 변경하여 로딩 메시지를 제거합니다.
        })
        .catch((error) => {
          // 요청 실패 시, 실행되는 코드입니다.
          setError("게시글을 불러오는 데 실패했습니다."); // 에러 메시지
          setLoading(false);
        });
    },
    // 빈 배열을 입력하여, 컴포넌트가 처음 렌더링될 때만 실행하도록 설정합니다.
    []
  );

  // 페이지 번호를 동적으로 생성하는 함수입니다.
  // 페이지가 정확히 5로 떨어지지 않기 때문에 Math.ceil(올림)을 추가합니다.
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <div className="container">
        <h1>블로그</h1>
        {/* 로딩중일 때는 "로딩 중..."을 표시합니다. */}
        {/* 에러가 있을 때는 에러 메시지를 표시합니다. */}
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {/* 게시글 제목만 출력합니다. */}
            {currentPosts.map((post) => (
              <div key={post.id} className="post">
                <h2 onClick={() => openModal(post)}>{post.title}</h2>
              </div>
            ))}

            <div>
              <ul>
                {pageNumbers.map((number) => (
                  <li key={number} className="pagination-item">
                    <button onClick={() => paginate(number)}>{number}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 검색창 */}
        <div className="search-container">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="body">내용</option>
            <option value="userId">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 모달창 */}
      {/* onClick={(e) => e.stopPropagation()으로 닫기를 눌렀을 때만 닫히도록 설정 */}
      {isModalOpen && (
        <div className="modal-background" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPost?.title}</h2>
            <p>{selectedPost?.body}</p>
            <p>{selectedPost?.userId}</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
