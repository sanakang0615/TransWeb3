"use client";

import { useEffect, useState } from 'react';
import { Input, Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Tabs } from 'antd';
import { RiseOutlined, HistoryOutlined, EditOutlined, DiffOutlined } from '@ant-design/icons';
import Card from './components/Card';
const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
import type { TabsProps } from 'antd';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [lang, setLang] = useState("ko");
  const [tab, setTab] = useState("trending");
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
        <Title level={4} style={{color: "white", paddingBottom:"15px", marginLeft:"-25px"}}>🌐 Web3 TransWiki</Title>
        <Space style={{ justifyContent: 'flex-end' }} size="small">
        <ConnectButton />
        <Button type="primary" style={{marginLeft:"10px", marginRight:"-24px", marginTop:"15px"}} shape="round" icon={<EditOutlined />} size="large" onClick={() => {router.push("/write")}}>POST</Button>
          </Space>
      </Header>
      
      <Content style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {<>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Title level={1} style={{ textAlign: 'center', fontSize: '53px', fontWeight: 'bold', marginTop:"50px"}}> Potential of crowdsourcing. </Title>
        
        <Paragraph style={{ textAlign: 'center'}}>
          
          <Text type="secondary" >
          UNLOCK THE POWER TO ELEVATE GLOBAL ACCESSIBILITY TO <Text type="secondary" keyboard>MULTILINGUAL WEB3 CONTENT</Text>. <br />
          SHARE YOUR TRANSLATIONS WITH US, AND BE REWARDED FOR YOUR CONTRIBUTIONS WITH EXCLUSIVE <Text type="secondary" keyboard>NFT</Text>. <br />
          WE WILL ALSO ASSIST YOU IN MAKING THEM<Text type="secondary" keyboard>OFFICIAL TRANSLATION DOCUMENTS</Text> FOR OUR FOUNDATION :) <br />

          </Text>
          <br />
          <br />
          <br />
          <Search size="large" addonBefore="https://" placeholder="Discover interesting URLs of your choice!" allowClear />
          <br />
          <br />
          <br />
          <br />
          <br />
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