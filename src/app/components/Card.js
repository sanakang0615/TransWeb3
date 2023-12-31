import { Card as AntCard } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { useRouter } from 'next/navigation'

const { Text } = Typography;


export default function Card({ post }) {
  const router = useRouter();

  return (
    <AntCard
      onClick={() => {
        router.push(`/post/${post.lang}/${post.reference.substring(8)}`);
      }}
      hoverable
      cover={<div style={{ height: '200px', overflow: 'hidden', display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'}}><img alt={post.title} src={post.image} style={{ 
        height: '100%', flexShrink: 0, objectFit: 'cover', minWidth: '100%'
        // objectPosition: 'center center' 
      }}/></div>}
    >
      <AntCard.Meta title={post.title} description={post.contents.substring(0, 100) + '...'} />
      <Space size="small">
        <Text code>{post.uid.substring(0, 6)}</Text>
        <Text code>{post.period}</Text>
        <p>
          <HeartOutlined /> {post.like}
        </p>
      </Space>
    </AntCard>
  );
}
