import "../styles/global.css";

export const metadata = {
  title: "COMPLYSIGHT",
  description: "정보시스템 자원 점검 관리 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
