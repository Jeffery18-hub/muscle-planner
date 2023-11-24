import { useContext } from 'react';
import { AccountContext } from '../contexts/accountContext';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AccountContext);

  const handleSignOut = () => {
    setIsLoggedIn(false);
  }

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo src="/icons/home_logo.png" alt="Logo" />
        <Navigation>
          <Link to="/home">Home</Link>
          <Link to="/home/data">My Data</Link>
          <Link to="/home/youtube">Youtube</Link>
        </Navigation>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <Navigation>
          <Avatar src="/icons/avatar2.png" alt="Avatar" />
          <Link to="/" onClick={handleSignOut} style={{ marginRight: '20px' }}>Sign Out</Link>
        </Navigation>
      </div>
    </HeaderWrapper>
  );
}

export default Header;


const HeaderWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: white;
  box-sizing: border-box;  // 确保padding不增加元素宽度
  width: 100%;  // 设置宽度为100%
  overflow: hidden;  // 防止任何超出的内容显示
  margin: 0;
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;  // 防止元素换行
  box-sizing: border-box;
`;


const Logo = styled.img`
  width: 50px;
  margin-right: 20px;
  max-width: 100%;  // 确保不超出其容器
`;

const Avatar = styled.img`
  width: 50px;
  border-radius: 25px;
  max-width: 100%;  // 确保不超出其容器
`;

const Link = styled(RouterLink)`
  color: white;
  text-decoration: none;
  white-space: nowrap;  // 防止文本换行
`;



