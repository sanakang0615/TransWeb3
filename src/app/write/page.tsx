"use client";

import { message, Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Form, Input } from 'antd';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;


const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function Write() {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const createSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '글이 성공적으로 등록되었습니다.',
    });
  }; 

  const onFinish = async (values: any) => {
    var res;

    res = await fetch("https://kuhpahtz7v7cxegmduq6ddyqbi0oltzp.lambda-url.ap-northeast-2.on.aws/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...values, uid: "test uid"}),
      }
    )
    if (res.statusText == "OK") {
      createSuccess();
    } else {console.log(res);}
  };

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
      <Content>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600, marginTop: 24 }}
      >
        <Form.Item name="title" label="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="reference" label="reference" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="image" label="image" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lang" label="language" rules={[{ required: true }]}>
          <Select
            placeholder="Select the language of your translated contents"
            allowClear
          >
            <Option value="ko">Korean</Option>
            <Option value="fr">French</Option>
            <Option value="jp">Japanese</Option>
          </Select>
        </Form.Item>
        <Form.Item name="contents" rules={[{ required: true }]}>
          <MDEditor value={content} onChange={setContent} />
        </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
      </Content>
    </Layout>
  );
}