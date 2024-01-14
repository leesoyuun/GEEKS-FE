import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as c from "../../components/Common/CommonStyle";
import HeaderMenu from "../../components/Common/HeaderMenu";
import Br from "../../components/Common/Br";
import AddPhoto from "../../assets/img/Community/addPhoto.svg";

const DoneBtn = styled.div`
  border-radius: 8px;
  background: #ffc700;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  line-height: 24px; /* 150% */
  display: inline-flex;
  padding: 8px 3.07vw;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const InputTitle = styled.input`
  width: 100%;
  height: 32px;
  margin: 16px 0 20px 0;
  outline: none;
  border: none;
  font-weight: 700;
  font-size: 1.5rem;
  color: #525252;
  &::-webkit-input-placeholder {
    color: #d0d0d0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 32px; /* 133.333% */
  }
`;
const Line = styled.div`
  background-color: #efefef;
  height: 1px;
  width: 100%;
  margin-bottom: 20px;
`;
const InputContent = styled.input`
  outline: none;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  width: 100%;
  height: 216px;
  vertical-align: top;
  margin-bottom: ${(props) =>
    props.contentHeight > 216 ? "clac(60px + contentHeight - 168px)" : "60px"};
  color: #525252;
  &::-webkit-input-placeholder {
    color: #d0d0d0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 32px; /* 133.333% */
  }
`;
const Community = () => {
  const [contentHeight, setContentHeight] = useState("168px");
  const handleInput = () => {
    let inputElement = document.getElementById("test");
    setContentHeight(`${inputElement.scrollHeight}px`);
  };
  return (
    <c.Totalframe>
      <c.ScreenComponent>
        <c.SubScreen>
          <HeaderMenu>
            <DoneBtn>완료</DoneBtn>
          </HeaderMenu>
          <InputTitle placeholder={`글 제목을 입력하세요`}></InputTitle>
          <Line />
          <InputContent
            onChange={() => handleInput()}
            id="test"
            contentHeight={contentHeight}
            placeholder={`내용을 입력하세요`}
          ></InputContent>
          <img src={AddPhoto} />
        </c.SubScreen>
      </c.ScreenComponent>
    </c.Totalframe>
  );
};

export default Community;