import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';       // НОВАЯ главная
import WaterBodyPage from './pages/WaterBodyPage'; // Карта теперь тут
import FishPage from './pages/FishPage';
import GuideMapPage from './pages/GuideMapPage';
import WinterPage from './pages/WinterPage';
import LakeItem from "./pages/InventoryPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import EquipmentPage from "./pages/EquipmentPage.jsx";
import LakeDetailPage from "./pages/LakeDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LakeInfoPage from "./pages/ExperimentPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<WaterBodyPage />} />
            <Route path="/fish" element={<FishPage />} />
            <Route path="/guide" element={<GuideMapPage />} />
            <Route path="/winter" element={<WinterPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/water" element={<LakeDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/info" element={<LakeInfoPage />} />
        </Routes>
    );
}

export default App;