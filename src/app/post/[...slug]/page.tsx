"use client"

import { Card, Avatar, Typography, Space, Popover, Layout, Button, Input } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;
const { Title, Text } = Typography;
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Post({ params }: { params: { slug: [string, string] } }) {
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<string[]>([]);
    const getPost = async(lang: string, reference: string) => {
        const data = await (await fetch(`https://mt3fthybo4agqytt2h77jp4ufq0ertvi.lambda-url.ap-northeast-2.on.aws/?lang=${lang}&reference=${reference}`)).json();
        console.log(data);
        setPost(data);
    }
    const router = useRouter();

    useEffect(()=>{console.log(params.slug[0], params.slug.slice(1).join("/")); getPost(params.slug[0], params.slug.slice(1).join("/"))}, []);

    const handleAddComment = () => {
      if (comment.trim() !== '') {
        setComments([...comments, comment]);
        setComment('');  // Clear the comment input after adding
      }
    };

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
          style={{ maxWidth: '1200px', margin: 'auto' }}
        >
          <Title level={2}>{post?.title}</Title>
          <Space direction="vertical">
            <Space>
              <Avatar icon={<img src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" alt={post?.uid} />} />
              <Text>Author UID: {post?.uid}</Text>
            </Space>
            <div>
              <Text strong>Reference: </Text>
              <a href={post?.reference} target="_blank" rel="noopener noreferrer">
                {post?.reference}
              </a>
            </div>
          </Space>
          <div style={{ margin: '20px 0' }}>
            <Text>{post?.contents}</Text>
          </div>
          <div>
            <HeartOutlined />
            <Text> {post?.like} Likes</Text>
          </div>

          {/* Comment Section */}
          <div style={{ marginTop: '20px' }}>
            <ConnectButton/>
            <Input.TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here."
              rows={4}
            />
            <Button onClick={handleAddComment}>Upload</Button>
            <ul>
              {comments.map((com, index) => (
                <li key={index}>{com}</li>
              ))}
            </ul>
          </div>

        </Card>
        </Content>
    </>
      );
  }
