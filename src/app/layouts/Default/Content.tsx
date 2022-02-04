import { Layout } from 'antd';

interface DefaultLayoutContentProps {
  children: React.ReactNode;
}

const { Content } = Layout;

export default function DefaultLayoutContent(props: DefaultLayoutContentProps) {
  return (
    <Content
      className='site-layout-background'
      style={{
        margin: 0,
        minHeight: 280,
      }}
    >
      {props.children}
    </Content>
  );
}
