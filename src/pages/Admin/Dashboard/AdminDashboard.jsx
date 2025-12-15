// File: src/pages/Admin/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import adminService from "@/services/admin.service";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import BookingTrends from "./components/BookingTrends";
import UserGrowthChart from "./components/UserGrowthChart";
import RevenueOverview from "./components/RevenueOverview";
import TopHotels from "./components/TopHotels";
import RecentBookingsTable from "./components/RecentBookingsTable";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboardStats();
        // ✅ SỬA: API trả về "data", không phải "result"
        if (res && res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingOverlay isLoading={true} />;

  // ✅ FIX LỖI RECHARTS: Kiểm tra nếu có data mới render biểu đồ
  // Nếu data null mà render ResponsiveContainer ngay sẽ bị lỗi width/height
  const hasData = data !== null;

  return (
    <div className="space-y-6 pb-10"> 
      <StatCards stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           {/* Chỉ render khi có dữ liệu để tránh lỗi width=-1 */}
           {hasData && <RevenueChart data={data?.revenueChart} />}
        </div>
        <div className="lg:col-span-1">
          <TopHotels hotels={data?.topHotels} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasData && <BookingTrends data={data?.bookingTrends} />}
        {hasData && <UserGrowthChart data={data?.userGrowth} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           {hasData && <RevenueOverview data={data?.revenueByType} />}
        </div>
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={data?.recentBookings} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;