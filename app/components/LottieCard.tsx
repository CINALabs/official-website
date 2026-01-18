'use client';

import { useEffect, useRef, useState } from 'react';

interface CardContent {
  badge: string;
  title: string;
  description: string;
  animationPath: string;
}

interface LottieCardProps {
  badge?: string;
  title?: string;
  description?: string;
  animationPath?: string;
  className?: string;
  switchable?: boolean;
  contents?: CardContent[];
}

export default function LottieCard({
  badge,
  title,
  description,
  animationPath,
  className = '',
  switchable = false,
  contents = [],
}: LottieCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  // 默认内容配置
  const defaultContents: CardContent[] = [
    {
      badge: "For Individuals",
      title: "Institutional opportunities without barriers",
      description: "Access global markets with onchain capital. Theo builds permissionless products directly backed by the same high-quality assets institutions rely on.",
      animationPath: "/iAtwaAlMxMiMYxB3HyEPbkDjx0.json"
    },
    {
      badge: "For Allocators", 
      title: "Tokenized products that do more",
      description: "Invest in robust financial products without sacrificing optionality or capital efficiency. Theo offers liquid, high-quality assets you can leverage across leading venues.",
      animationPath: "/iGbdwc03WgC0FEfcd59IJdnhUkI.json"
    },
    {
      badge: "For Issuers",
      title: "Complete ecosystems for tokenized assets", 
      description: "Tap into onchain markets with an institutional-grade tokenization stack that goes beyond issuance. Theo powers financial products with built-in distribution, liquidity, and interoperability.",
      animationPath: "/KBgd1luvWIPR43iwbHqMrXiqWfs.json"
    }
  ];

  // 使用传入的contents或默认配置
  const cardContents = switchable && contents.length > 0 ? contents : defaultContents;
  
  // 获取当前显示的内容
  const currentContent = switchable ? cardContents[currentIndex] : {
    badge: badge || cardContents[0].badge,
    title: title || cardContents[0].title, 
    description: description || cardContents[0].description,
    animationPath: animationPath || cardContents[0].animationPath
  };

  // 切换到下一个内容
  const handleSwitch = () => {
    if (switchable) {
      setCurrentIndex((prev) => (prev + 1) % cardContents.length);
    }
  };

  useEffect(() => {
    if (!currentContent.animationPath || typeof window === 'undefined') return;

    const loadAnimation = async () => {
      if (!(window as any).lottie) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (containerRef.current && (window as any).lottie) {
        // 清除之前的动画
        if (animationRef.current) {
          animationRef.current.destroy();
        }
        
        animationRef.current = (window as any).lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: currentContent.animationPath,
        });
      }
    };

    loadAnimation().catch(console.error);

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [currentContent.animationPath]);

  return (
    <div className={`relative rounded-[10px] overflow-hidden bg-[#181818] ${className}`}>
      <div className="relative min-h-[500px] md:min-h-[500px] flex items-center">
        {/* 左侧内容区域 */}
        <div className="relative z-10 p-6 md:p-12 max-w-full md:max-w-[50%]">
          {/* 徽章 */}
          <div className="inline-flex items-center justify-center px-3 py-1 rounded mb-4 md:mb-6 bg-[#60787c]">
            <p className="text-xs md:text-sm text-center text-white m-0">{currentContent.badge}</p>
          </div>
          
          {/* 标题 */}
          <h3 className="text-xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-4 text-white leading-tight">
            {currentContent.title}
          </h3>
          
          {/* 描述 */}
          <p className="text-[#d6d6d6] leading-relaxed text-sm md:text-base mb-6 max-w-md">
            {currentContent.description}
          </p>

          {/* 切换按钮 */}
          {switchable && (
            <div className="flex gap-2">
              {cardContents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Switch to content ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 右侧 Lottie 动画 */}
        {currentContent.animationPath && (
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] pointer-events-none"
            style={{ 
              opacity: 0.4
            }}
          >
            <div 
              ref={containerRef}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
