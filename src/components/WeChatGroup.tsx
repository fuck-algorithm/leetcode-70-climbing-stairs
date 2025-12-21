import { useState } from 'react';
import styled from 'styled-components';

const FloatingBall = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.4);
  z-index: 9999;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(7, 193, 96, 0.5);
  }
`;

const GroupIcon = styled.div`
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  
  svg {
    width: 24px;
    height: 24px;
    fill: white;
    margin-bottom: 2px;
  }
`;

const Popup = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
  max-width: 280px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 24px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }
`;

const PopupTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
`;

const PopupDesc = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1.5;
`;

const QRCode = styled.img`
  width: 200px;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
`;

const Instruction = styled.div`
  font-size: 11px;
  color: #999;
  text-align: center;
  margin-top: 12px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
`;

// 微信二维码图片URL - 使用本地图片
const WECHAT_QR_URL = '/leetcode-70-climbing-stairs/wechat-group.png';

export default function WeChatGroup() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <FloatingBall
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <GroupIcon>
          <svg viewBox="0 0 24 24">
            <path d="M8.5 7C5.46 7 3 9.46 3 12.5c0 1.33.47 2.55 1.26 3.5L3 19l3.04-1.27c.95.78 2.16 1.27 3.46 1.27 3.04 0 5.5-2.46 5.5-5.5S11.54 7 8.5 7zm0 9.5c-.97 0-1.87-.3-2.62-.81l-.18-.12-1.89.79.79-1.89-.12-.18c-.51-.75-.81-1.65-.81-2.62 0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
            <path d="M15.5 3C12.46 3 10 5.46 10 8.5c0 .34.03.67.09 1 .66-.09 1.33-.09 2-.01-.03-.33-.09-.66-.09-1 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5c-.34 0-.67-.06-1-.09-.08.67-.08 1.34.01 2 .33.06.66.09 1 .09 3.04 0 5.5-2.46 5.5-5.5S18.54 3 15.5 3z"/>
          </svg>
          交流群
        </GroupIcon>
      </FloatingBall>
      
      <Popup isVisible={isVisible}>
        <PopupTitle>🎉 加入算法交流群</PopupTitle>
        <PopupDesc>
          和志同道合的小伙伴一起刷题<br/>
          分享算法心得，共同进步！
        </PopupDesc>
        <QRCode src={WECHAT_QR_URL} alt="微信二维码" />
        <Instruction>
          微信扫码，发送 <strong>"leetcode"</strong> 加入交流群
        </Instruction>
      </Popup>
    </>
  );
}