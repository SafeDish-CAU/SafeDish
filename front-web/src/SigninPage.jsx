import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SigninPage.css';
import { login } from './api';

function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result || !result.id || !result.token) {
      alert('로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.');
      return;
    }

    document.cookie = `sd_user_id=${encodeURIComponent(result.id)}; path=/`;
    document.cookie = `sd_token=${encodeURIComponent(result.token)}; path=/`;

    navigate('/mypage');
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-label">
            이메일
            <input
              className="login-input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>

          <label className="login-label">
            비밀번호
            <input
              className="login-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>

          <button className="login-button" type="submit">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <span>아이디가 없나요?</span>
          <button
            type="button"
            className="login-link"
            onClick={() => {
              navigate('/signup');
            }}
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;
