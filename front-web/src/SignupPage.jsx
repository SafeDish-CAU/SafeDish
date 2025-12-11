import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { createUser } from './api';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      const result = await createUser(email, password);

      if (!result || !result.id || !result.token) {
        alert('회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      document.cookie = `sd_user_id=${encodeURIComponent(result.id)}; path=/`;
      document.cookie = `sd_token=${encodeURIComponent(result.token)}; path=/`;

      navigate('/mypage');
    } catch (err) {
      console.error(err);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  const goToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="signup-root">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>

        <form className="signup-form" onSubmit={onSubmit}>
          <label className="signup-label">
            이메일
            <input
              className="signup-input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>

          <label className="signup-label">
            비밀번호
            <input
              className="signup-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>

          <button className="signup-button" type="submit">
            가입하기
          </button>
        </form>

        <div className="signup-footer">
          <span>이미 계정이 있다면: </span>
          <button
            type="button"
            className="signup-link"
            onClick={goToSignin}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
