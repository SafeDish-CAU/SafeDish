// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SigninPage from './SigninPage';
import SignupPage from './SignupPage';
import MyPage from './MyPage';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p>홈 페이지 입니다.</p>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
