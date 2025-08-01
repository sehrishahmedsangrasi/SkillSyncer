"use client";

import { useEffect, useState } from "react";
import { useUser,SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "../../components/navbar";

// TypeScript interfaces
interface CareerPath {
  title: string;
  description: string;
}

interface PathPosition {
  x: number;
  y: number;
  isBottom: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
}

export default function CareerPathsPage() {
  const { user } = useUser();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredPath, setHoveredPath] = useState<number | null>(null);
  const [clickedPath, setClickedPath] = useState<number | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [pathPositions, setPathPositions] = useState<PathPosition[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user data from backend using same logic as CareerIdentityPage
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/userData/${user.id}`);
        console.log("✅ Fetching data for user ID:", user.id);

        const data = res.data;
        console.log("📄 Full fetched user data:", data);

        setUserData(data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Get career paths from API using the full userData array
  useEffect(() => {
    const getPaths = async () => {
      if (!userData || userData.length === 0 || careerPaths.length > 0) return;
      
      setLoading(true);
      try {
        const res = await axios.post("/api/generate-career-path", { 
          userData,
          userId: user?.id || 'anonymous'
        });

        const rawText = res.data.careerPaths || "";

        const parsedPaths: CareerPath[] = rawText
          .split("•")
          .map((line: string) => line.trim())
          .filter(Boolean)
          .map((line: string) => {
            const colonIndex = line.indexOf(":");
            if (colonIndex > 0) {
              return {
                title: line.substring(0, colonIndex).trim(),
                description: line.substring(colonIndex + 1).trim()
              };
            }
            return {
              title: line,
              description: "Explore this exciting career opportunity tailored for your skills."
            };
          });

        setCareerPaths(parsedPaths);
        
      } catch (err: any) {
        console.error("Career path generation failed:", err);
        
        if (err.response?.status === 429) {
          alert("⏳ Please wait a moment before requesting again. Our AI is taking a short break!");
        } else if (err.response?.status === 503) {
          alert("🤖 AI service is busy right now. Please try again in 2-3 minutes!");
        } else if (err.response?.data?.details?.includes('quota')) {
          alert("📅 Daily limit reached. Please try again tomorrow!");
        } else {
          alert("❌ Failed to generate career paths. Please try again later.");
        }
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(getPaths, 1000);
    return () => clearTimeout(timeoutId);
  }, [userData, user?.id, careerPaths.length]);

  // Generate random stars
  useEffect(() => {
    const generateStars = () => {
      const starArray: Star[] = [];
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 3
        });
      }
      setStars(starArray);
    };
    generateStars();
  }, []);

  // Generate positions for both mobile and desktop layouts
  useEffect(() => {
    if (careerPaths.length > 0 && pathPositions.length === 0) {
      const positions: PathPosition[] = [];
      
      // Always generate circular positions (for desktop)
      // Mobile will use CSS classes to override positioning
      const centerX = 50;
      const centerY = 50;
      const centerRadius = 22;
      const minDistance = 15;
      
      const rings = [
        { radius: 35, positions: 8 },
        { radius: 45, positions: 12 }, 
        { radius: 60, positions: 16 }
      ];
      
      const availablePositions: Array<{
        x: number;
        y: number;
        used: boolean;
        distanceFromCenter: number;
        isBottom: boolean;
      }> = [];
      
      rings.forEach(ring => {
        for (let i = 0; i < ring.positions; i++) {
          const angle = (i * 360) / ring.positions;
          const radian = (angle * Math.PI) / 180;
          
          const x = centerX + (Math.cos(radian) * ring.radius * 0.8);
          const y = centerY + (Math.sin(radian) * ring.radius * 0.8);
          
          const margin = 10;
          if (x >= margin && x <= (100 - margin) && y >= margin && y <= (100 - margin)) {
            const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            if (distanceFromCenter >= centerRadius) {
              availablePositions.push({ 
                x, 
                y, 
                used: false, 
                distanceFromCenter,
                isBottom: y > 65
              });
            }
          }
        }
      });
      
      availablePositions.sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);
      
      careerPaths.forEach((_, index) => {
        let bestPosition: typeof availablePositions[0] | null = null;
        let bestScore = -1;
        
        availablePositions.forEach(candidate => {
          if (candidate.used) return;
          
          let minDistanceToOthers = Infinity;
          positions.forEach(pos => {
            const distance = Math.sqrt(
              Math.pow(candidate.x - pos.x, 2) + Math.pow(candidate.y - pos.y, 2)
            );
            minDistanceToOthers = Math.min(minDistanceToOthers, distance);
          });
          
          const score = positions.length === 0 ? 
            candidate.distanceFromCenter : 
            (minDistanceToOthers >= minDistance ? minDistanceToOthers + candidate.distanceFromCenter : -1);
          
          if (score > bestScore) {
            bestScore = score;
            bestPosition = candidate;
          }
        });
        
        if (!bestPosition) {
          bestPosition = availablePositions.find(pos => !pos.used) || null;
        }
        
        if (bestPosition) {
          bestPosition.used = true;
          positions.push({
            x: bestPosition.x,
            y: bestPosition.y,
            isBottom: bestPosition.isBottom
          });
        }
      });
      
      setPathPositions(positions);
    }
  }, [careerPaths]);

 
  const handlePathClick = (index: number) => {
    if (isMobile) {
      setClickedPath(clickedPath === index ? null : index);
    }
  };

  const handlePathHover = (index: number | null) => {
    if (!isMobile) {
      setHoveredPath(index);
    }
  };

  const activeTooltipIndex = isMobile ? clickedPath : hoveredPath;

  return (
    <>
    <SignedIn>
      <NavBar />
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`
            }}
          />
        ))}
      </div>

      {/* Central Circle - Desktop Only */}
      <div className="absolute inset-0 items-center justify-center hidden md:flex">
        <div className="relative z-10">
          <div 
            className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: '0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)'
            }}
          >
            <div className="text-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-purple-300 text-sm">🔍 Analyzing your profile...</p>
                </>
              ) : !userData || userData.length === 0 ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-2">🌟 Ready to Explore?</h2>
                  <p className="text-purple-300 text-xs mb-4">Add your skills first through skill generator</p>
                
                 
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">🚀 Career Paths</h2>
                  <p className="text-purple-300 text-sm">Your Future Awaits</p>
                  <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Rotating border effect */}
          {!userData || userData && (
            <div 
              className="absolute inset-0 rounded-full border-2 border-transparent opacity-50"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                animation: 'spin 8s linear infinite'
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="md:hidden">
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            
            <div 
                className="w-60 h-60 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-2xl relative mb-4"
                style={{
                  boxShadow: '0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)'
                }}
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-purple-300 text-sm">🔍 Analyzing your profile...</p>
                </div>
                <div 
                  className="absolute inset-0 rounded-full border-2 border-transparent opacity-50"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                    animation: 'spin 8s linear infinite'
                  }}
                ></div>
              </div>

          </div>
        ) : !userData || userData.length === 0 ? (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div 
              className="w-60 h-60 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-2xl relative mb-4"
              style={{
                boxShadow: '0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)'
              }}
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2 text-center">🌟 Ready to Explore?</h3>
                <p className="text-purple-300 text-xs mb-4">Add your skills first through skill generator</p>
              </div>
              <div 
                className="absolute inset-0 rounded-full border-2 border-transparent opacity-50"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                  animation: 'spin 8s linear infinite'
                }}
              ></div>
            </div>
          </div>
        ) : careerPaths.length > 0 && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            {/* Top 4 career paths */}
            <div className="flex flex-col items-center space-y-3 ml-[21rem]  w-full">
              {careerPaths.slice(0, 4).map((path, index) => (
                <div
                  key={`top-${index}`}
                  className="transition-all duration-500 ease-in-out transform cursor-pointer flex justify-center w-full"
                  style={{
                    animation: `float ${3 + (index % 3)}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    zIndex: activeTooltipIndex === index ? 50 : 20
                  }}
                  onClick={() => handlePathClick(index)}
                >
                  <div 
                    className={`
                      px-4 py-2 text-sm rounded-xl font-medium text-white backdrop-blur-sm 
                      transition-all duration-300 border-2 min-w-max
                      ${activeTooltipIndex === index 
                        ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 shadow-2xl scale-110 border-purple-400/80' 
                        : 'bg-gradient-to-r from-purple-700/60 to-blue-700/60 border-purple-500/40'
                      }
                    `}
                    style={{
                      boxShadow: activeTooltipIndex === index 
                        ? '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' 
                        : '0 0 15px rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base"></span>
                      <span className="text-sm font-semibold">{path.title}</span>
                    </div>
                  </div>

                  {/* Mobile Tooltip */}
                  {activeTooltipIndex === index && (
                    <div className="absolute mt-16 bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-xl shadow-2xl p-3 max-w-xs mx-auto left-1/2 transform -translate-x-1/2">
                      <div className="text-purple-300 text-xs font-medium mb-2 flex items-center gap-1">
                        <span>✨</span>
                        Career Overview
                        <button 
                          onClick={(e) => { e.stopPropagation(); setClickedPath(null); }}
                          className="ml-auto text-purple-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-white text-xs leading-relaxed">
                        {path.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Center Circle - positioned with margin */}
            <div className="my-8 flex justify-center w-full">
              <div 
                className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-2 border-purple-500/50 flex items-center justify-center shadow-2xl relative"
                style={{
                  boxShadow: '0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)'
                }}
              >
                <div className="text-center">
                  <h2 className="text-lg font-bold text-white mb-2">🚀 Career Paths</h2>
                  <p className="text-purple-300 text-xs">Your Future Awaits</p>
                  <div className="mt-4 flex justify-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                
                {/* Rotating border effect */}
                {!loading && userData && (
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-transparent opacity-50"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                      animation: 'spin 8s linear infinite'
                    }}
                  ></div>
                )}
              </div>
            </div>

            {/* Bottom 4 career paths */}
            <div className="flex flex-col items-center space-y-3 mt-[1rem] ml-[21rem] w-full">
              {careerPaths.slice(4, 8).map((path, index) => {
                const actualIndex = index + 4;
                return (
                  <div
                    key={`bottom-${index}`}
                    className="transition-all duration-500 ease-in-out transform cursor-pointer flex justify-center w-full"
                    style={{
                      animation: `float ${3 + (actualIndex % 3)}s ease-in-out infinite`,
                      animationDelay: `${actualIndex * 0.2}s`,
                      zIndex: activeTooltipIndex === actualIndex ? 50 : 20
                    }}
                    onClick={() => handlePathClick(actualIndex)}
                  >
                    <div 
                      className={`
                        px-4 py-2 text-sm rounded-xl font-medium text-white backdrop-blur-sm 
                        transition-all duration-300 border-2 min-w-max
                        ${activeTooltipIndex === actualIndex 
                          ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 shadow-2xl scale-110 border-purple-400/80' 
                          : 'bg-gradient-to-r from-purple-700/60 to-blue-700/60 border-purple-500/40'
                        }
                      `}
                      style={{
                        boxShadow: activeTooltipIndex === actualIndex 
                          ? '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' 
                          : '0 0 15px rgba(168, 85, 247, 0.3)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base"></span>
                        <span className="text-sm font-semibold">{path.title}</span>
                      </div>
                    </div>

                    {/* Mobile Tooltip */}
                    {activeTooltipIndex === actualIndex && (
                      <div className="absolute mt-16 bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-xl shadow-2xl p-3 max-w-xs mx-auto left-1/2 transform -translate-x-1/2">
                        <div className="text-purple-300 text-xs font-medium mb-2 flex items-center gap-1">
                          <span>✨</span>
                          Career Overview
                          <button 
                            onClick={(e) => { e.stopPropagation(); setClickedPath(null); }}
                            className="ml-auto text-purple-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-white text-xs leading-relaxed">
                          {path.description}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Floating Career Paths (Circular Layout) */}
      <div className="hidden md:block">
        {!loading && careerPaths.length > 0 && careerPaths.map((path, index) => {
          const position = pathPositions[index] || {x: 50, y: 50, isBottom: false};
          return (
            <div
              key={index}
              className="absolute transition-all duration-500 ease-in-out transform cursor-pointer hover:scale-110"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${3 + (index % 3)}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                zIndex: activeTooltipIndex === index ? 50 : 20
              }}
              onMouseEnter={() => handlePathHover(index)}
              onMouseLeave={() => handlePathHover(null)}
            >
              <div 
                className={`
                  px-6 py-3 text-sm rounded-xl font-medium text-white backdrop-blur-sm 
                  transition-all duration-300 border-2 min-w-max
                  ${activeTooltipIndex === index 
                    ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 shadow-2xl scale-110 border-purple-400/80' 
                    : 'bg-gradient-to-r from-purple-700/60 to-blue-700/60 hover:from-purple-600/70 hover:to-pink-600/70 border-purple-500/40'
                  }
                `}
                style={{
                  boxShadow: activeTooltipIndex === index 
                    ? '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' 
                    : '0 0 15px rgba(168, 85, 247, 0.3)'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg"></span>
                  <span className="text-sm font-semibold leading-tight">
                    {path.title}
                  </span>
                </div>
              </div>

              {/* Desktop Hover Description */}
              {activeTooltipIndex === index && (
          <div
                className={`
                  absolute left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm
                  border border-purple-500/50 rounded-xl shadow-2xl z-50 p-4 w-80 text-sm
                  ${position.isBottom ? 'bottom-full mb-2' : 'top-full mt-2'}
                `}
                style={{
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                }}
              >
                <div className="text-purple-300 text-xs font-medium mb-2 flex items-center gap-1">
                  <span>✨</span>
                  Career Overview
                </div>
                <div className="text-white text-sm leading-relaxed">
                  {path.description}
                </div>
              
                {/* Arrow pointing to the career path box */}
                <div
                  className={`
                    absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-500 rotate-45
                    ${position.isBottom ? '-bottom-1.5' : '-top-1.5'}
                  `}
                ></div>
              </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {!loading && careerPaths.length > 0 && (
        <div className={`
          absolute bottom-4 right-4 bg-transparent backdrop-blur-sm border border-purple-500/30 
          rounded-lg text-white z-30
          ${isMobile ? 'p-2' : 'p-4'}
        `}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-purple-300 mb-2`}>✨ {careerPaths.length} opportunities found</div>
          <div className={`space-y-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            <div>• {isMobile ? 'Tap' : 'Hover over'} career paths for details</div>
            
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </SignedIn>
    <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
