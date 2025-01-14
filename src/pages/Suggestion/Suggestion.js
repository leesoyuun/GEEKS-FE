import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import API from "../../axios/BaseUrl";
import * as c from "../../components/Common/CommonStyle";
import NavigationBar from "../../components/Main/NavigationBar";
import SuggestionPost from "../../components/Suggestion/SuggestionPost";
import FetchMore from "../../components/Community/FetchMore";
import moment from "moment";
import "moment/locale/ko";
import Loading from "../Loading";
import GeeksLogo from "../../assets/img/Common/geeksLogo.svg";
import Search from "../../assets/img/Home/search.svg";
import MyPageIcon from "../../assets/img/Community/myPage.svg";
import WritePost from "../../assets/img/Community/edit.svg";

const TotalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0;
`;
const Icon = styled.div`
  display: flex;
  gap: 16px;
  cursor: pointer;
`;
const SuggestionTxt = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 32px;
  text-align: left;
  color: #333;
  white-space: pre-wrap;
  margin-top: 27px;
  margin-bottom: 32px;
`;
const ProcessBox = styled.div`
  width: 72px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid #e2e2e2;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => (props.isSelect ? "#fff" : "#707070")};
  background-color: ${(props) => (props.isSelect ? "#333" : "#fff")};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
`;
const WritePostBox = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #e2e2e2;
  background: #fff;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.04);
  position: fixed;
  bottom: 14.69vh;
  right: 16px;
  padding: 14px 20px;
`;
const WritePostIcon = styled.img`
  height: 24px;
  width: 24px;
`;
const WriteTxt = styled.div`
  color: #333;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 24px;
  margin-left: 8px;
`;
const Suggestion = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);
  const [filterPost, setFilterPost] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [filterState, setFilterState] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isadmin');

  async function fetchFilter() {
    try {
      const res = await API.get(`/suggestion/filter/${filterState}/${cursor}`);
      setHasNext(res.data.hasNextPage);
      setFilterPost((prev) => [...prev, ...res.data.suggestions]);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchSuggestion() {
    try {
      const res = await API.get(`/suggestion/main/${cursor}`);
      setLoading(false);
      setHasNext(res.data.hasNextPage);
      setPost((prev) => [...prev, ...res.data.suggestions]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!hasNext) {
      return;
    }
    if(filterState !== false) {
      fetchFilter();
    }
    else {
      fetchSuggestion();
    }
    
  }, [cursor]);

  const caclTime = (uploadTime) => {
    moment.locale("ko"); // 언어를 한국어로 설정
    return moment(uploadTime).fromNow(`A`) + "전"; // 지금으로부터 계산
  };

  const changeFilterState = (state) => {
    setCursor(0);
    setHasNext(true);
    setPost([]);
    setFilterPost([]);
    setFilterState(prevState => prevState === state ? false : state);
  }

  return loading ? (
    <Loading />
  ) : (
    <c.Totalframe>
      <c.ScreenComponent navigation={true}>
        <TotalHeader>
          <img src={GeeksLogo} />
          <Icon>
            <img src={Search} onClick={() => navigate("/search")} />
            <img src={MyPageIcon} />
          </Icon>
        </TotalHeader>
        <SuggestionTxt>{`기숙사에게 원하는 것을\n건의해 보세요`}</SuggestionTxt>
        <c.Flex>
          <ProcessBox
            isSelect={filterState === "NONE"}
            onClick={() => changeFilterState("NONE")}
          >{`처리 전`}</ProcessBox>
          <ProcessBox
            isSelect={filterState === "ONGOING"}
            onClick={() => changeFilterState("ONGOING")}
          >{`처리 중`}</ProcessBox>
          <ProcessBox
            isSelect={filterState === "COMPLETE"}
            onClick={() => changeFilterState("COMPLETE")}
          >{`처리 완료`}</ProcessBox>
          <ProcessBox
            isSelect={filterState === "DEFER"}
            onClick={() => changeFilterState("DEFER")}
          >{`처리 보류`}</ProcessBox>
        </c.Flex>
        {filterState === false
          ? post.map((data) => (
              <SuggestionPost
                process={ data.suggestionState !== "NONE" ? data.suggestionState === "ONGOING" ? "처리 중" : data.suggestionState === "COMPLETE" ? "처리 완료": "처리 보류" : null}
                title={data.title}
                gender={data.gender === 'MALE' ? '남자' : '여자'}
                dormitory={data.type === 'NEW' ? '신관' : data.type === 'OLD' ? '구관' : '행복 기숙사'}
                content={data.content}
                time={caclTime(data.createDate)}
                cnt={data.agreeCount === 0 ? false : data.agreeCount}
                postImg={data.photoName}
                onClick={() =>
                  navigate(`/suggestion/show/${data.postId}`, {state: { isAdmin: isAdmin },})
                }
              />
            ))
          : filterPost.map((data) => (
              <SuggestionPost
                process={ data.suggestionState !== "NONE" ? data.suggestionState === "ONGOING" ? "처리 중" : data.suggestionState === "COMPLETE" ? "처리 완료" : "처리 보류" : null}
                title={data.title}
                content={data.content}
                time={caclTime(data.createDate)}
                gender={data.gender === 'MALE' ? '남자' : '여자'}
                dormitory={data.type === 'NEW' ? '신관' : data.type === 'OLD' ? '구관' : '행복 기숙사'}
                cnt={data.agreeCount === 0 ? false : data.agreeCount}
                postImg={data.photoName}
                onClick={() =>
                  navigate(`/suggestion/show/${data.postId}`, {
                    state: { isAdmin: isAdmin },
                  })
                }
              />
            ))}
        <FetchMore items={filterState !== false ? filterPost : post} setCursor={setCursor} />
      </c.ScreenComponent>
      {isAdmin == 'false' && (
        <WritePostBox onClick={() => navigate("/writesuggestion")}>
          <WritePostIcon src={WritePost} />
          <WriteTxt>{`건의하기`}</WriteTxt>
        </WritePostBox>
      )}
      <NavigationBar type={`suggestion`} isAdmin={isAdmin}/>
    </c.Totalframe>
  );
};
export default Suggestion;