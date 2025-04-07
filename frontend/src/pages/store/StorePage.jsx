// pages/StorePage.jsx
import React from "react";
import Header from "../../components/layout/Header";
import StoreGrid from "../../components/features/store/StoreGrid";
import Footer from "../../components/layout/Footer";

const StorePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Nuestros Productos
        </h1>
        <StoreGrid />
      </div>
      <Footer/>
    </div>
  );
};

export default StorePage;
