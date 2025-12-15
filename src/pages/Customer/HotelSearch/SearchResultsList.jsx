import React from "react";
import HotelListCard from "@/components/common/Card/HotelListCard";
import { ArrowUpDown, Map } from "lucide-react";
import Button from "@/components/common/Button/Button";

const SearchResultsList = ({ hotels, loading, searchInfo }) => {
  
  // --- SKELETON LOADING COMPONENT ---
  const HotelSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 animate-pulse h-auto md:h-[260px]">
      <div className="w-full md:w-[35%] bg-gray-200 rounded-xl h-48 md:h-full"></div>
      <div className="flex-1 flex flex-col justify-between py-2">
         <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
         </div>
         <div className="flex justify-between items-end mt-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
         </div>
      </div>
    </div>
  );

  // --- RENDER LOADING STATE ---
  if (loading) {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
         </div>
         {[1, 2, 3, 4].map((i) => <HotelSkeleton key={i} />)}
      </div>
    );
  }

  // --- RENDER EMPTY STATE ---
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
            <Map size={48} className="text-[rgb(40,169,224)]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Không tìm thấy chỗ nghỉ nào
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Chúng tôi không tìm thấy chỗ nghỉ nào phù hợp với từ khóa "{searchInfo.location}" của bạn. Hãy thử thay đổi ngày hoặc tìm kiếm địa điểm khác.
        </p>
        <Button className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6]">
           Xóa bộ lọc
        </Button>
      </div>
    );
  }

  // --- RENDER SUCCESS LIST ---
  return (
    <div>
      {/* Header kết quả */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
             {searchInfo.location ? `Kết quả tại "${searchInfo.location}"` : "Tất cả chỗ nghỉ"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tìm thấy <span className="font-semibold text-[rgb(40,169,224)]">{hotels.length}</span> chỗ nghỉ phù hợp
          </p>
        </div>

        {/* Nút sắp xếp đơn giản */}
        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-500 hidden sm:inline">Sắp xếp theo:</span>
           <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
              Được gợi ý <ArrowUpDown size={14} className="ml-2"/>
           </Button>
        </div>
      </div>

      {/* Danh sách Cards */}
      <div className="grid grid-cols-1 gap-6">
        {hotels.map((hotel) => (
          <HotelListCard key={hotel.propertyId} hotel={hotel} />
        ))}
      </div>

      {/* Pagination Placeholder (Nếu cần sau này) */}
      {/* <div className="mt-8 flex justify-center">...Pagination...</div> */}
    </div>
  );
};

export default SearchResultsList;