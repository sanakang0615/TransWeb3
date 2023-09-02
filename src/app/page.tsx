"use client";

import { useEffect, useState } from 'react';
import { Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Tabs } from 'antd';
import { RiseOutlined, HistoryOutlined } from '@ant-design/icons';
import Card from './components/Card';
const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
import type { TabsProps } from 'antd';
import { useAccount, useConnect, useEnsName, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
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
  const [posts, setPosts] = useState([]);
  const [lang, setLang] = useState("ko");
  const [tab, setTab] = useState("trending");
  const { address, connector, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const router = useRouter();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { chains, pendingChainId, switchNetwork } =
  useSwitchNetwork()
 
  const goerliTestnet = {
    /** ID in number form */
    id: 5,
    /** Human-readable name */
    name: 'Goerli Testnet',
    /** Internal network name */
    network: 'goerlitest',
    /** Currency used by chain */
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    /** Collection of RPC endpoints */
    rpcUrls: {
      infura:
        'https://aurora-testnet.infura.io/v3'
    },
    testnet: true
  }
  

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
        {isConnected ? (
          <Space style={{ justifyContent: 'flex-end' }} size="small">
            <img src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" alt="ENS Avatar" />
            {/* <p style={{color: "white"}}> */}
              {ensName ? `${ensName} (${address})` : address}
            {chain && <div>Connected to {chain.name}</div>}
            {[...chains, goerliTestnet].map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && ' (switching)'}
        </button>
        
      ))}
      {/* </p>  */}
            <button onClick={() => disconnect()}>Disconnect</button>
          </Space>
        ) : (
          <div>
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </button>
            ))}
       
            {error && <div>{error.message}</div>}
          </div>
        )}
      </Header>
      <Content style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {<>
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