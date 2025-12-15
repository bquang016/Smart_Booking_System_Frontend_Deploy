import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import SearchResultsList from "./SearchResultsList";
import propertyService from "@/services/property.service";
import SearchBox from "@/components/search/SearchBox"; 

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy params để hiển thị lại lên SearchBox
  const initialSearchValues = {
    destination: searchParams.get("keyword") || "",
    guests: parseInt(searchParams.get("guests")) || 2,
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  const handleSearch = (newParams) => {
      setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 1. Lấy đủ thông tin từ URL
        const keyword = searchParams.get("keyword") || "";
        const guests = searchParams.get("guests") || 1;
        const checkIn = searchParams.get("checkIn");   // ✅ Lấy ngày check-in
        const checkOut = searchParams.get("checkOut"); // ✅ Lấy ngày check-out
        
        // 2. Truyền vào service
        const data = await propertyService.searchProperties(keyword, guests, checkIn, checkOut);
        setHotels(data);
      } catch (error) {
        console.error("Failed to search hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]); // useEffect sẽ chạy lại khi URL thay đổi

  return (
      <div className="min-h-screen bg-gray-50 pb-12">
        
        {/* Header Search Box */}
        <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
             <SearchBox 
                initialValues={initialSearchValues}
                onSearch={handleSearch}
                className="shadow-none border-0 p-0 !gap-2" 
             />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-48"> 
                <FilterSidebar />
              </div>
            </div>

            <div className="lg:col-span-3">
              <SearchResultsList 
                hotels={hotels} 
                loading={loading} 
                searchInfo={{ total: hotels.length, location: initialSearchValues.destination }} 
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default HotelSearchPage;