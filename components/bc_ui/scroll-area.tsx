import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

interface ScrollAreaWithShadowsProps {
  children: React.ReactNode;
  className?: string;
  shadowSize?: number;
  threshold?: number;
  easingThresholdFactor?: number;
  direction?: "vertical" | "horizontal";
}

const ScrollAreaWithShadows = forwardRef<
  HTMLDivElement | any,
  ScrollAreaWithShadowsProps
>(
  (
    {
      children,
      className = "",
      shadowSize = 20,
      threshold = 10,
      easingThresholdFactor = 2,
      direction = "vertical",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | any>(null);
    const contentRef = useRef<HTMLDivElement | any>(null);
    const [maskImage, setMaskImage] = useState<string>("");

    const handleScroll = useCallback(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const isVertical = direction === "vertical";
      const scrollPosition = isVertical
        ? container.scrollTop
        : container.scrollLeft;
      const containerSize = isVertical
        ? container.clientHeight
        : container.clientWidth;
      const contentSize = isVertical
        ? content.clientHeight
        : content.clientWidth;

      const startOpacity = Math.max(
        0,
        1 - scrollPosition / threshold / easingThresholdFactor
      );
      const endOpacity = Math.max(
        0,
        1 -
          (contentSize - containerSize - scrollPosition) /
            threshold /
            easingThresholdFactor
      );

      const gradientDirection = isVertical ? "to bottom" : "to right";

      setMaskImage(
        `linear-gradient(${gradientDirection}, 
          rgba(0, 0, 0, ${startOpacity}) 0px, 
          rgba(0, 0, 0, 1) ${shadowSize}px, 
          rgba(0, 0, 0, 1) calc(100% - ${shadowSize}px), 
          rgba(0, 0, 0, ${endOpacity}) 100%
        )`
      );
    }, [shadowSize, threshold, easingThresholdFactor, direction]);

    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
        handleScroll(); // Check initial state
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    const containerClass =
      direction === "vertical"
        ? "h-full overflow-y-auto"
        : "w-full overflow-x-auto";

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      },
    }));

    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div
          ref={containerRef}
          className={containerClass}
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          <div ref={contentRef}>{children}</div>
        </div>
      </div>
    );
  }
);

ScrollAreaWithShadows.displayName = "ScrollAreaWithShadows";

export default ScrollAreaWithShadows;
