"use client";

import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Input, Avatar, Button, Col, Layout, Menu, Popover, Row, Typography, Space, Select, Tabs } from 'antd';
import { RiseOutlined, HistoryOutlined } from '@ant-design/icons';
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
        <Title level={5} style={{color: "white"}}>TransWeb3</Title>
        <Space style={{ justifyContent: 'flex-end' }} size="small">
        <ConnectButton />
        <Button onClick={() => {router.push("/write")}}>CREATE</Button>
            {/* <Popover placement="bottomLeft" trigger="click" content={
              <Space direction="vertical">
                <Text>address-text</Text>
                <Button>DISCONNECT</Button>
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
             */}
          </Space>
      </Header>
      
      <Content style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {<>
        <Title level={1} style={{ textAlign: 'center'}}>TransWeb3</Title>
        <Paragraph style={{ textAlign: 'center' }}>
        웹3 콘텐츠, 번역해서 읽고 있다면 혼자 보지 말고 올려보세요.  <br /> 글 작성에 대한 <Text code>NFT</Text>를 발급해드리며, 재단의 공식 번역 문서로 사용될 수 있게 돕겠습니다.<br /><br />
        <Search addonBefore="https://" placeholder="url을 입력해보세요." allowClear />
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