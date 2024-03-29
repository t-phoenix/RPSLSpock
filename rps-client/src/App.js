import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Start from './pages/Start';
import Player2 from './pages/Player2';
import Solve from './pages/Solve';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div className="App">
      <Header />
      <div className='body'>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start/>} />
        <Route path="/player2/:id" element={<Player2/>}/>
        <Route path="/solve/:id" element={<Solve/>}/>
        </Routes>
      </div>
      <Toaster toastOptions={{duration: 4000, style: {maxWidth: 800}}}/>
    </div>
  );
}

export default App;
