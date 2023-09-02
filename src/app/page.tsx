"use client";

import { useEffect, useState } from 'react';
import { Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Tabs } from 'antd';
import { RiseOutlined, HistoryOutlined } from '@ant-design/icons';
import Card from './components/Card';
const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
import type { TabsProps } from 'antd';
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { useRouter } from 'next/navigation'




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
} from "./sismo-connect-config";

export default function Home() {
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] =
    useState<SismoConnectVerifiedResult>();
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse>();
  const [pageState, setPageState] = useState<string>("init");
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState([]);
  const [lang, setLang] = useState("ko");
  const [tab, setTab] = useState("trending");
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const router = useRouter();

  const items: TabsProps['items'] = [
    { 
      key: 'trending',
      label: <><RiseOutlined />Trending</>,
    },
    {
      key: 'latest',
      label: <><HistoryOutlined />Latest</>,
    },
  ];

  const onTabChange = (key: string) => {
    setTab(key);
  };

  const getPosts = async(lang: string) => {
    const data = await (await fetch(`https://pwamiide6d7n4t6ue4facnpqcm0cwktf.lambda-url.ap-northeast-2.on.aws?lang=${lang}`)).json();
    setPosts(data);
  }
  
  useEffect(() => {
    getPosts(lang);
  }, [lang]);


  return (
    <>
      <Header style={{ 
        display: 'flex',
        justifyContent: 'space-between', // Separates left and right components
        alignItems: 'center', // Align items vertically in the center
      }}>
        <Title level={5} style={{color: "white"}}>TransWeb3</Title>
        {pageState == "init" ? (
          <Button>Connect Wallet</Button>
        //   <SismoConnectButton
        //   config={CONFIG}
        //   // Auths = Data Source Ownership Requests. (e.g Wallets, Github, Twitter, Github)
        //   auths={AUTHS}
        //   // Claims = prove group membership of a Data Source in a specific Data Group.
        //   // (e.g ENS DAO Voter, Minter of specific NFT, etc.)
        //   // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
        //   // Existing Data Groups and how to create one: https://factory.sismo.io/groups-explorer
        //   claims={CLAIMS}
        //   // Signature = user can sign a message embedded in their zk proof
        //   signature={SIGNATURE_REQUEST}
        //   text="Sismo로 접속하기"
        //   // Triggered when received Sismo Connect response from user data vault
        //   onResponse={async (response: SismoConnectResponse) => {
        //     setSismoConnectResponse(response);
        //     setPageState("verifying");
        //     const verifiedResult = await fetch("/api/verify", {
        //       method: "POST",
        //       body: JSON.stringify(response),
        //     });
        //     const data = await verifiedResult.json();
        //     if (verifiedResult.ok) {
        //       setSismoConnectVerifiedResult(data);
        //       setPageState("verified");
        //     } else {
        //       setPageState("error");
        //       setError(data);
        //     }
        //   }}
        // />
        ) : (
          <Space style={{ justifyContent: 'flex-end' }} size="small">
            <Popover placement="bottomLeft" trigger="click" content={
              <Space direction="vertical">
                <Text>{sismoConnectVerifiedResult?.auths[1].userId}</Text>
                <Button onClick={() => { window.location.href = "/";}}>DISCONNECT</Button>
              </Space>
            }>
              <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
            </Popover>
            <Select
              defaultValue="korean"
              style={{ width: 120 }}
              onChange={(v)=>{setLang(v)}}
              options={[
                { value: 'ko', label: 'Korean' },
                { value: 'fr', label: 'French' },
                { value: 'jp', label: 'Japanese' },
              ]}
            />
            <Button onClick={() => {router.push("/write")}}>CREATE</Button>
          </Space>
        )}
      </Header>
      <Content style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {!sismoConnectVerifiedResult && <>
        <Title level={1} style={{ textAlign: 'center'}}>TransWeb3</Title>
        <Paragraph style={{ textAlign: 'center' }}>
        웹3 콘텐츠, 번역해서 읽고 있다면 혼자 보지 말고 올려보세요.  <br /> 글 작성에 대한 NFT를 발급해드리며, 재단의 공식 번역 문서로 사용될 수 있게 돕겠습니다.
        </Paragraph>
      </>}
        <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} style={{marginTop: 30}}/>
        <Row gutter={[16, 16]}>
          {posts.map((post) => (
            <Col xs={24} md={12} lg={8} key={post.uid}>
              <Card post={post}/>
            </Col>
          ))}
        </Row>
      </Content>
    </>
  );
}