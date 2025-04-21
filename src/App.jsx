import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import HomeScreen from './screens/home/HomeScreen';
import Quran from './screens/quran/Quran';
import CheckQuran from './screens/quran/CheckQuran';
import AddMoreForm from './screens/more/AddMoreForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/check_quran" element={<CheckQuran />} />
        <Route path="/add_more" element={<AddMoreForm />} />
      </Routes>
    </Router>
  );
}

export default App;