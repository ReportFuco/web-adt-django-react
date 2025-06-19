import Header from "../../components/layout/Header";
import StoreGrid from "../../components/features/store/StoreGrid";
import Footer from "../../components/layout/Footer";
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { useState, useEffect } from "react";

const StorePage = () => {

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-6">
          Nuestros Productos
        </h1>
        <StoreGrid />
      </div>
      <Footer/>
    </div>
  );
};

export default StorePage;
