import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, Search } from "lucide-react";
import SearchBox from "@/components/search/SearchBox"; 

// Ảnh nền chất lượng cao (Landscape)
const HERO_BG = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2668&auto=format&fit=crop";

// Danh sách từ khóa thay đổi
const ROTATING_WORDS = ["trong mơ", "đẳng cấp", "hoàn hảo", "bất tận"];

// Danh sách địa điểm gợi ý
const POPULAR_KEYWORDS = [
    { name: "Đà Lạt" },
    { name: "Vũng Tàu"},
    { name: "Sapa" },
    { name: "Hạ Long" },
    { name: "Đà Nẵng" }
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. LOGIC TYPING EFFECT ---
  useEffect(() => {
    const word = ROTATING_WORDS[currentWordIndex];
    const typeSpeed = isDeleting ? 100 : 150;
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === word) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      } else {
        setDisplayText(
          isDeleting ? word.substring(0, displayText.length - 1) : word.substring(0, displayText.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  // --- 2. XỬ LÝ TÌM KIẾM TỪ KHÓA ---
  const handleKeywordClick = (keyword) => {
    navigate(`/hotels?keyword=${encodeURIComponent(keyword)}&guests=1`);
  };

  return (
    // 👇 Thêm pb-20 hoặc pb-32 để đẩy nội dung lên cao một chút, tránh sát đáy quá
    <section className="relative w-full min-h-[95vh] flex flex-col justify-center items-center overflow-hidden -mt-[64px] pb-20">
      
      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        .animate-ken-burns { animation: ken-burns 20s infinite alternate ease-in-out; }
        .animate-float { animation: float-slow 6s infinite ease-in-out; }
        .cursor-blink { border-right: 3px solid #60a5fa; animation: blink 0.75s step-end infinite; }
      `}</style>

      {/* --- BACKGROUND & OVERLAY --- */}
      {/* z-0: Lớp nền thấp nhất */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_BG} 
          alt="Hero Background" 
          className="w-full h-full object-cover animate-ken-burns" 
        />
        {/* Lớp phủ tối để text trắng dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-gray-900/60" />
        
        {/* Texture noise nhẹ */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      {/* --- BOTTOM GRADIENT FADE (ĐÃ SỬA) --- */}
      {/* 1. z-0: Đảm bảo nó nằm NGANG HÀNG với ảnh nền, KHÔNG đè lên nội dung (SearchBox z-50).
          2. h-64 (hoặc h-96): Kéo dài chiều cao ra để màu trắng loang lên từ từ, không bị gắt.
          3. from-white via-white/80 to-transparent: Chuyển màu mượt hơn.
      */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white via-white/50 to-transparent z-0 pointer-events-none" />


      {/* --- FLOATING SHAPES --- */}
      {/* z-0: Vẫn là trang trí nền */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-500/30 rounded-full blur-3xl animate-float opacity-60 z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-float opacity-60 z-0" style={{animationDelay: '1s'}}></div>

      {/* --- MAIN CONTENT --- */}
      {/* z-10: Nội dung chính, cao hơn nền */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-20 md:mt-0">
        
        {/* Badge */}
        <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-2 py-1.5 pl-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in-up hover:bg-white/20 transition-all cursor-default">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-6 h-6 rounded-full border border-white" alt="user"/>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 pr-2">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">Được tin dùng bởi 10k+ du khách</span>
                </div>
            </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-2xl max-w-6xl mx-auto">
          Đánh thức hành trình <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            {displayText}
          </span>
          <span className="cursor-blink ml-1"></span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed opacity-90">
          Khám phá bộ sưu tập khách sạn, resort và homestay độc đáo nhất Việt Nam. Trải nghiệm đẳng cấp chỉ với một cú chạm.
        </p>

        {/* --- SEARCH BOX CONTAINER --- */}
        {/* z-50: CAO NHẤT - Đảm bảo dropdown đè lên mọi thứ */}
        <div className="relative w-full max-w-5xl mx-auto group z-50">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-[2rem] blur-lg opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
            
            {/* Search Box chính */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[1.8rem] p-3 md:p-4 shadow-2xl border border-white/60">
                <SearchBox />
            </div>
        </div>

        {/* --- POPULAR KEYWORDS --- */}
        {/* z-10: Thấp hơn SearchBox (50) nhưng cao hơn nền (0) */}
        <div className="mt-10 animate-fade-in-up relative z-10" style={{animationDelay: '0.5s'}}>
            <p className="text-white/60 text-sm font-medium mb-4 uppercase tracking-widest flex items-center justify-center gap-2">
                <TrendingUp size={14} /> Xu hướng tìm kiếm
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                {POPULAR_KEYWORDS.map((place) => (
                    <button 
                        key={place.name} 
                        onClick={() => handleKeywordClick(place.name)}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-base filter drop-shadow-md">{place.icon === 'dragon' ? '🐲' : place.icon}</span>
                        <span className="text-white text-sm font-semibold group-hover:text-blue-200 transition-colors">{place.name}</span>
                        <Search size={12} className="text-white/40 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 duration-300" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;