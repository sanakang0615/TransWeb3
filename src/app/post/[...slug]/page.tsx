"use client"

import { Card, Avatar, Typography, Space, Popover, Layout, Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

const { Title, Text } = Typography;import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';

export default function Post({ params }: { params: { slug: [string, string] } }) {
    const [post, setPost] = useState({})
    const getPost = async(lang: string, reference: string) => {
        const data = await (await fetch(`https://mt3fthybo4agqytt2h77jp4ufq0ertvi.lambda-url.ap-northeast-2.on.aws/?lang=${lang}&reference=${reference}`)).json();
        console.log(data);
        setPost(data);
    }
    const router = useRouter();

    useEffect(()=>{console.log(params.slug[0], params.slug.slice(1).join("/")); getPost(params.slug[0], params.slug.slice(1).join("/"))}, []);

    return (
        <>
        <Header style={{ 
           display: 'flex',
           justifyContent: 'space-between', // Separates left and right components
           alignItems: 'center', // Align items vertically in the center
         }}>
           <Title level={5} style={{color: "white"}} onClick={()=>{router.push("/")}}>TransWeb3</Title>
           <Popover placement="bottomLeft" trigger="click" content={
             <Space direction="vertical">
               <Text>address</Text>
               <Button onClick={() => { window.location.href = "/";}}>DISCONNECT</Button>
             </Space>
               }>
                 <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
           </Popover>
         </Header>
         <Content>
        <Card
          cover={
            <img
              alt="example"
              src={post?.image}
              style={{ objectFit: 'cover', height: '200px' }}
            />
          }
          style={{ maxWidth: '800px', margin: 'auto' }}
        >
          <Title level={2}>{post?.title}</Title>
          <Space>
            <Avatar icon={<img src={post?.avatar} alt={post?.uid} />} />
            <Text>Author UID: {post?.uid}</Text>
          </Space>
          <div>
            <Text strong>Reference:</Text>
            <a href={post?.reference} target="_blank" rel="noopener noreferrer">
              {post?.reference}
            </a>
          </div>
          <div style={{ margin: '20px 0' }}>
            <Text>{post?.contents}</Text>
          </div>
          <div>
            <HeartOutlined />
            <Text> {post?.like} Likes</Text>
          </div>
        </Card>
        </Content>
    </>
      );
  }