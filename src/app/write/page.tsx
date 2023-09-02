"use client";

import { message, Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Form, Input } from 'antd';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  SismoConnectButton,
  SismoConnectResponse,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-react";
import {
  CONFIG,
  AUTHS,
  CLAIMS,
  SIGNATURE_REQUEST,
  AuthType,
  ClaimType,
} from "../sismo-connect-config";

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
  const router = useRouter();
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] =
  useState<SismoConnectVerifiedResult>();
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse>();
  const [pageState, setPageState] = useState<string>("init");
  const [error, setError] = useState<string>("");
  const componentDisabled = pageState === "init";

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
    <>
     <Header style={{ 
        display: 'flex',
        justifyContent: 'space-between', // Separates left and right components
        alignItems: 'center', // Align items vertically in the center
      }}>
        <Title level={5} style={{color: "white"}} onClick={()=>{router.push("/")}}>TransWeb3</Title>
        <ConnectButton />
        {/* <Popover placement="bottomLeft" trigger="click" content={
          <Space direction="vertical">
            <Text>address-text</Text>
            <Button onClick={() => { window.location.href = "/";}}>DISCONNECT</Button>
          </Space>
            }>
              <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        </Popover> */}
      </Header>
      <Content style={{display: 'flex', justifyContent: 'center', margin: '0 auto'}}>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ marginTop: 24 }}
        size="large"
        disabled={componentDisabled}
      >
        <Form.Item name="title" label="title" rules={[{ required: true }]}>
          <Input placeholder={pageState === "init" ? "Confirm your Proof of Humanity" : ""} />
        </Form.Item>
        <Form.Item name="reference" label="reference" rules={[{ required: true }]}>
          <Input placeholder={pageState === "init" ? "Confirm your Proof of Humanity" : ""} />
        </Form.Item>
        <Form.Item name="image" label="image" rules={[{ required: true }]}>
          <Input placeholder={pageState === "init" ? "Confirm your Proof of Humanity" : ""} />
        </Form.Item>
        <Form.Item name="lang" label="language" rules={[{ required: true }]}>
          <Select
            placeholder={pageState === "init" ? "Confirm your Proof of Humanity" : "Select the language of your translated contents"}
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
      {pageState == "init" ? (
          <>
            <SismoConnectButton
              config={CONFIG}
              // Auths = Data Source Ownership Requests. (e.g Wallets, Github, Twitter, Github)
              auths={AUTHS}
              // Claims = prove group membership of a Data Source in a specific Data Group.
              // (e.g ENS DAO Voter, Minter of specific NFT, etc.)
              // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
              // Existing Data Groups and how to create one: https://factory.sismo.io/groups-explorer
              claims={CLAIMS}
              // Signature = user can sign a message embedded in their zk proof
              signature={SIGNATURE_REQUEST}
              text="Sismo로 접속하기"
              // Triggered when received Sismo Connect response from user data vault
              onResponse={async (response: SismoConnectResponse) => {
                setSismoConnectResponse(response);
                setPageState("verifying");
                const verifiedResult = await fetch("/api/verify", {
                  method: "POST",
                  body: JSON.stringify(response),
                });
                const data = await verifiedResult.json();
                if (verifiedResult.ok) {
                  setSismoConnectVerifiedResult(data);
                  setPageState("verified");
                } else {
                  setPageState("error");
                  setError(data);
                }
              }}
            />
          </>
        ) : (
          <>
            <br></br>
            <div className="status-wrapper">
              {pageState == "verifying" ? (
                <span className="verifying"> Verifying ZK Proofs... </span>
              ) : (
                <>
                  {Boolean(error) ? (
                    <span className="error"> Error verifying ZK Proofs: {error} </span>
                  ) : (
                    <span className="verified"> ZK Proofs verified!</span>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
      </Content>
    </>
  );
}