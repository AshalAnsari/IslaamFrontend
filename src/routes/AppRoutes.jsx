
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/home/HomeScreen';
import CheckQuran from '../screens/quran/CheckQuran'
import AddMoreForm from '../screens/more/AddMoreForm';
import HadeesScreen from '../screens/hadees/HadeesScreen';
import CheckHadees from '../screens/hadees/CheckHadees';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/check_quran" element={<CheckQuran />} />
        <Route path="/add_more" element={<AddMoreForm />} />
        <Route path="/hadees" element={<HadeesScreen />} />
        <Route path="/hadees/check_hadees" element={<CheckHadees />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
