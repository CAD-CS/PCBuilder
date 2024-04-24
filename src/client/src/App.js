
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './pages/Layout';
import Builds from './pages/Builds';
import Users from './pages/Users';
import Components from './pages/Components';
import Manufacturers from './pages/Manufacturers';
import Tests from './pages/Tests'
import Reviews from './pages/Reviews'

function App() {
  return (
    <div id="app-view">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Builds />}/>
            <Route path='Users' element={<Users />}/>
            <Route path='components' element={<Components />}/>
            <Route path='manufacturers' element={<Manufacturers />}/>
            <Route path='tests' element={<Tests />}/>
            <Route path='reviews' element={<Reviews />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
