"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  Avatar,
  Typography,
  Space,
  Popover,
  Layout,
  Button,
  Input,
  Row,
} from "antd";
import {
  HeartOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useNetwork } from "wagmi";

import MyERC721Artifact from "../../../../contracts/MyERC721.json";
import MyERC1155Artifact from "../../../../contracts/MyERC1155.json";
import pMyERC721Artifact from "../../../../contracts/pMyERC721.json";
import pMyERC1155Artifact from "../../../../contracts/pMyERC1155.json";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface Comment {
  uid: string;
  comment: string;
}

interface PostParams {
  slug: [string, string];
}

interface PostData {
  uid: string;
  image: string;
  title: string;
  reference: string;
  project: string;
  contents: string;
  like: number;
  comments: Comment[];
}

export default function Post({ params }: { params: PostParams }) {
  const [post, setPost] = useState<PostData>({
    uid: '',
    image: '',
    title: '',
    reference: '',
    project: '',
    contents: '',
    like: 0,
    comments: [],
  });
  const [comment, setComment] = useState<string>("");
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(
    null
  );
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const router = useRouter();
  const { chain, chains } = useNetwork();

  const getSignerAddress = async (
    signer: ethers.providers.JsonRpcSigner | ethers.providers.Provider
  ) => {
    try {
      if (signer instanceof ethers.providers.JsonRpcSigner) {
        const add = await signer.getAddress();
        setSignerAddress(add);
      } else {
        console.error("The signer doesn't support getAddress method");
      }
    } catch (error) {
      console.error("Error getting signer address:", error);
    }
  };

  const handleClaim = async () => {
    if (!signer) {
      console.log("Signer is null");
      return;
    }

    console.log("signer", signerAddress);
    console.log("author", post?.uid);
    console.log("contract", contract);

    if (chain?.name === "Linea Goerli Testnet") {
      console.log("Linea");

      if (signerAddress === post?.uid) {
        await handleMinting(
          MyERC721Artifact.abi,
          "0xebf30384736d28aAD50695117fd599585d0Cb84B"
        );
      } else if (
        post?.comments?.some((item) => item.uid === signerAddress)
      ) {
        await handleMinting(
          MyERC1155Artifact.abi,
          "0xf9EFec12853f3015448485c12d8a742Deb936e57",
          5
        );
      }
    } else {
      console.log("ZK");

      if (signerAddress === post?.uid) {
        await handleMinting(
          pMyERC721Artifact.abi,
          "0x1b126393CE24C0f1Cf643e85bA51be18272ae634"
        );
      } else if (
        post?.comments?.some((item) => item.uid === signerAddress)
      ) {
        console.log("here");
        await handleMinting(
          pMyERC1155Artifact.abi,
          "0x186C275DD08af7Ab4Fe5094B0d2538EB1f2824B5",
          5
        );
      }
    }
  };

  const handleMinting = async (
    abi: any,
    contractAddress: string,
    tokenAmount?: number
  ) => {
    if (signer) {
      const tokenURI =
        "ipfs://bafybeib3rtjvescbhmlhoqcxhch7otbaq64jnhgcu7skzw22mxdcyyf54m/";
      const newContract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      let tx;

      if (tokenAmount) {
        tx = await newContract.mintToken(
          await signer.getAddress(),
          tokenAmount
        );
      } else {
        tx = await newContract.mintToken(
          await signer.getAddress(),
          tokenURI
        );
      }

      const receipt = await tx.wait();
      console.log("receipt", receipt);

      const tokenId = receipt.events
        .filter(
          (x: { event: string; args: { tokenId: any } }) =>
            x.event === "Transfer"
        )
        .map((x: { event: string; args: { tokenId: any } }) => x.args.tokenId)
        .toString();
      console.log("Minted Token ID:", tokenId);
    } else {
      console.error("Signer is null or undefined.");
    }
  };

  useEffect(() => {
    if ((window as any).ethereum) {
      const newProvider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        "any"
      );
      setProvider(newProvider);
      const newSigner = newProvider.getSigner();
      setSigner(newSigner);
      getSignerAddress(newSigner);
    }
  }, []);

  useEffect(() => {
    console.log(params.slug[0], params.slug.slice(1).join("/"));
    getPost(params.slug[0], params.slug.slice(1).join("/"));
  }, []);

  useEffect(() => {
    if (signer && signerAddress === post?.uid) {
      console.log("signerAddress is author");
    } else if (
      signer &&
      post?.comments?.some((item) => item.uid === signerAddress)
    ) {
      console.log("signerAddress is in comments");
    }
  }, [signer]);

  const getPost = async (lang: string, reference: string) => {
    try {
      const data = await (
        await fetch(
          `https://mt3fthybo4agqytt2h77jp4ufq0ertvi.lambda-url.ap-northeast-2.on.aws/?lang=${lang}&reference=${reference}`
        )
      ).json();
      console.log(data);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ color: "white", paddingBottom: "15px", marginLeft: "-25px" }}>
          🌐 Web3 TransWiki
        </Title>
        <Popover
          placement="bottomLeft"
          trigger="click"
          content={
            <Space direction="vertical">
              <Text>address</Text>
              <Button onClick={() => { window.location.href = "/"; }}>DISCONNECT</Button>
            </Space>
          }
        >
          <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        </Popover>
      </Header>
      <Content>
        <Card
          cover={
            <img
              alt="example"
              src={post?.image}
              style={{ objectFit: "cover", height: "200px" }}
            />
          }
          style={{ maxWidth: "1200px", margin: "auto" }}
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
          <div style={{ margin: "20px 0" }}>
            <Text>{post?.contents}</Text>
          </div>
          <div>
            <HeartOutlined />
            <Text> {post?.like} Likes</Text>
          </div>

          <div style={{ marginTop: "20px" }}>
            <ConnectButton />
            <Input.TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here."
              rows={4}
            />
            <Row style={{ marginTop: "15px", marginBottom: "15px" }}>
              <Button shape="round" icon={<UploadOutlined />}>Upload</Button>
              <Button type="primary" shape="round" onClick={handleClaim} icon={<SendOutlined />}>Claim</Button>
            </Row>
            <ul>
              {post?.comments?.map((com: Comment, index: number) => (
                <div key={index} style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                  <div style={{ marginRight: "16px" }}>
                    <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                    <div style={{ fontSize: "12px" }}>{com?.uid}</div>
                  </div>
                  <div style={{ backgroundColor: "#f1f1f1", padding: "12px", borderRadius: "8px", flex: 1 }}>
                    {com?.comment}
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
