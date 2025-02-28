import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from './routes/Home';
import Memo from './routes/Memo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/memo" element={<Memo/>}/>
    </Routes>
  );
}

export default App;
