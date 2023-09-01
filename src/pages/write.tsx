"use client";

import { Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select } from 'antd';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function HomePage() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <Layout>
     <Header style={{ 
        display: 'flex',
        justifyContent: 'space-between', // Separates left and right components
        alignItems: 'center', // Align items vertically in the center
      }}>
        <Title level={5} style={{color: "white"}}>TransWeb3</Title>
        <Popover placement="bottomLeft" trigger="click" content={
          <Space direction="vertical">
            <Text>User</Text>
            <Button onClick={() => { window.location.href = "/";}}>DISCONNECT</Button>
          </Space>
            }>
              <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        </Popover>
      </Header>
      <Content >
        <MDEditor value={value} onChange={setValue} />
      </Content>
      <Row align="middle" justify="end">
        <Button onClick={() => { window.location.href = "/";}}>등록하기</Button>
      </Row>
    </Layout>
  );
}
  