"use client";

import { useEffect, useState } from 'react';
import { Button, Col, Layout, Menu, Row, Typography } from 'antd';
import Card from './components/Card';
const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

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

  const getPosts = async(lang: string) => {
    const data = await (await fetch(`https://pwamiide6d7n4t6ue4facnpqcm0cwktf.lambda-url.ap-northeast-2.on.aws?lang=${lang}`)).json();
    setPosts(data);
  }
  
  useEffect(() => {
    getPosts("ko");
  }, []);


  return (
    <Layout>
      <Header style={{ width: '100%' }}>
        <Menu theme="dark" mode="horizontal" style={{justifyContent: 'flex-end'}}>
        {pageState == "init" ? (
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
        ) : (
          <>
            <Menu.Item key="profile" style={{ color: 'white' }}>Profile</Menu.Item>
            <Menu.Item key="disconnect">
              <Button onClick={() => { window.location.href = "/";}}>DISCONNECT</Button>
          </Menu.Item>
          </>
        )}
        </Menu>
      </Header>
      <Content style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <Title level={1} style={{ textAlign: 'center'}}>TransWeb3</Title>
        <Paragraph style={{ textAlign: 'center' }}>
        웹3 콘텐츠, 번역해서 읽고 있다면 혼자 보지 말고 올려보세요.  <br /> 글 작성에 대한 NFT를 발급해드리며, 재단의 공식 번역 문서로 사용될 수 있게 돕겠습니다.
        </Paragraph>
        <Row gutter={[16, 16]}>
          {posts.map((post) => (
            <Col xs={24} md={12} lg={8} key={post.uid}>
              <Card post={post} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}