"use client"

import { Card, Avatar, Typography, Space, Popover, Layout, Button, Input } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;
const { Title, Text } = Typography;
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import MyERC721Artifact from '../../../../contracts/MyERC721.json'; // ABI를 포함한 컨트랙트 아티팩트를 import합니다.



export default function Post({ params }: { params: { slug: [string, string] } }) {
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<string[]>(["This is a hard-coded comment-1", "Another hard-coded comment-2"]);
    const getPost = async(lang: string, reference: string) => {
        const data = await (await fetch(`https://mt3fthybo4agqytt2h77jp4ufq0ertvi.lambda-url.ap-northeast-2.on.aws/?lang=${lang}&reference=${reference}`)).json();
        console.log(data);
        setPost(data);
    }
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const router = useRouter();

    const handleClaim = async () => {
      if (contract) {
        const tokenURI = "ipfs://bafybeib3rtjvescbhmlhoqcxhch7otbaq64jnhgcu7skzw22mxdcyyf54m/";
        const tx = await contract.mintToken(signer.getAddress(), tokenURI); // mint는 컨트랙트에서 정의한 함수입니다.
        const receipt = await tx.wait();
        console.log("receipt", receipt);

        const tokenId = receipt.events
          .filter((x) => x.event === "Transfer")
          .map((x) => x.args.tokenId)
          .toString();
        console.log("Minted Token ID:", tokenId);
      }
    };

    useEffect(() => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
        setProvider(newProvider);
        const newSigner = newProvider.getSigner();
        setSigner(newSigner);
      }
    }, []);

    useEffect(()=>{console.log(params.slug[0], params.slug.slice(1).join("/")); getPost(params.slug[0], params.slug.slice(1).join("/"))}, []);

    useEffect(() => {
      if (signer) {
        const newContract = new ethers.Contract("0xabcc66Cd4e03601aC0C93C827D2078865Da59426", MyERC721Artifact.abi, signer);
        setContract(newContract);
      }
    }, [signer]);

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
            <Text>Project: {post?.project}</Text>
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
            <Button onClick={handleClaim}>Claim</Button>
            <ul>
            {comments.map((com, index) => (
    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
      <div style={{ marginRight: '16px' }}>
        <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        <div style={{ fontSize: '12px' }}>0x1234...</div>
      </div>
      <div style={{ backgroundColor: '#f1f1f1', padding: '12px', borderRadius: '8px', flex: 1 }}>
        {com}
      </div>
    </div>
  ))}
            </ul>
          </div>

        </Card>
        </Content>
    </>
      );
  }
