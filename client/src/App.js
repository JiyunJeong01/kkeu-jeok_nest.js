import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from './routes/Home';
import Memo from './routes/Memo';
import Login from './routes/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
