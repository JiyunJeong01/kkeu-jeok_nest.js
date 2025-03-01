import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom"; // 라우팅 도와주는 모듈
import { useLogin } from './contexts/LoginContext';
import Home from './routes/Home';
import MemoBoard from './routes/MemoBoard';
import BookmarkBoard from './routes/BookmarkBoard';
import Setting from './routes/Setting';
import Login from './routes/Login';

function App() {
  const { user } = useLogin();
  
  return (
      <Routes>
        <Route path="/" element={user ? <MemoBoard /> : <Home />} />
        <Route path="/bookmark" element={user ? <BookmarkBoard /> : <Home />} />
        <Route path="/setting" element={user ? <Setting /> : <Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
}

export default App;
