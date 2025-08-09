
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Equation } from "./EquationManager";
import { ImportantPoint, evaluateFunction } from "@/utils/mathUtils";

interface InteractiveGraphProps {
  equations: Equation[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  importantPoints: ImportantPoint[];
  onRangeChange: (xMin: number, xMax: number, yMin: number, yMax: number) => void;
}

export const InteractiveGraph = ({ 
  equations, 
  xMin, 
  xMax, 
  yMin, 
  yMax, 
  importantPoints,
  onRangeChange 
}: InteractiveGraphProps) => {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalRange, setOriginalRange] = useState({ xMin, xMax, yMin, yMax });

  const svgWidth = 500;
  const svgHeight = 400;

  const getScreenCoordinates = (x: number, y: number) => {
    const screenX = ((x - xMin) / (xMax - xMin)) * svgWidth;
    const screenY = svgHeight - ((y - yMin) / (yMax - yMin)) * svgHeight;
    return { x: screenX, y: screenY };
  };

  const getWorldCoordinates = (screenX: number, screenY: number) => {
    const x = xMin + (screenX / svgWidth) * (xMax - xMin);
    const y = yMax - (screenY / svgHeight) * (yMax - yMin);
    return { x, y };
  };

  const generatePoints = (equation: Equation) => {
    const step = (xMax - xMin) / 400;
    const points: Array<{x: number, y: number}> = [];
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(x, equation.expression);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x, y });
      }
    }
    
    return points;
  };

  const createPath = (points: Array<{x: number, y: number}>) => {
    if (points.length === 0) return '';
    
    let path = '';
    let isFirstPoint = true;
    
    for (const point of points) {
      const screen = getScreenCoordinates(point.x, point.y);
      
      if (screen.y >= -50 && screen.y <= svgHeight + 50) {
        if (isFirstPoint) {
          path += `M ${screen.x} ${screen.y}`;
          isFirstPoint = false;
        } else {
          path += ` L ${screen.x} ${screen.y}`;
        }
      } else {
        isFirstPoint = true;
      }
    }
    
    return path;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOriginalRange({ xMin, xMax, yMin, yMax });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const worldDeltaX = (-deltaX / svgWidth) * (originalRange.xMax - originalRange.xMin);
    const worldDeltaY = (deltaY / svgHeight) * (originalRange.yMax - originalRange.yMin);
    
    onRangeChange(
      originalRange.xMin + worldDeltaX,
      originalRange.xMax + worldDeltaX,
      originalRange.yMin + worldDeltaY,
      originalRange.yMax + worldDeltaY
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const rangeX = (xMax - xMin) * zoomFactor;
    const rangeY = (yMax - yMin) * zoomFactor;
    
    onRangeChange(
      centerX - rangeX / 2,
      centerX + rangeX / 2,
      centerY - rangeY / 2,
      centerY + rangeY / 2
    );
  };

  const zoomIn = () => {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const rangeX = (xMax - xMin) * 0.8;
    const rangeY = (yMax - yMin) * 0.8;
    
    onRangeChange(
      centerX - rangeX / 2,
      centerX + rangeX / 2,
      centerY - rangeY / 2,
      centerY + rangeY / 2
    );
  };

  const zoomOut = () => {
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const rangeX = (xMax - xMin) * 1.25;
    const rangeY = (yMax - yMin) * 1.25;
    
    onRangeChange(
      centerX - rangeX / 2,
      centerX + rangeX / 2,
      centerY - rangeY / 2,
      centerY + rangeY / 2
    );
  };

  const resetView = () => {
    onRangeChange(-10, 10, -10, 10);
  };

  const exportGraph = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = svgWidth;
    canvas.height = svgHeight;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Button onClick={zoomIn} size="sm" variant="outline">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={zoomOut} size="sm" variant="outline">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={resetView} size="sm" variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={exportGraph} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          {t('export')}
        </Button>
      </div>
      
      <div className="border border-border rounded-lg p-2 bg-calc-display">
        <svg 
          ref={svgRef}
          width={svgWidth} 
          height={svgHeight} 
          className="w-full h-auto cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          {xMin <= 0 && xMax >= 0 && (
            <line 
              x1={getScreenCoordinates(0, yMin).x} 
              y1="0" 
              x2={getScreenCoordinates(0, yMax).x} 
              y2={svgHeight} 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth="2"
            />
          )}
          {yMin <= 0 && yMax >= 0 && (
            <line 
              x1="0" 
              y1={getScreenCoordinates(xMin, 0).y} 
              x2={svgWidth} 
              y2={getScreenCoordinates(xMax, 0).y} 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth="2"
            />
          )}
          
          {/* Function curves */}
          {equations.filter(eq => eq.visible).map((equation) => {
            const points = generatePoints(equation);
            return (
              <path
                key={equation.id}
                d={createPath(points)}
                fill="none"
                stroke={equation.color}
                strokeWidth="2"
              />
            );
          })}
          
          {/* Important points */}
          {importantPoints.map((point, index) => {
            const screen = getScreenCoordinates(point.x, point.y);
            const color = point.type === 'root' ? '#10b981' : 
                         point.type === 'intersection' ? '#3b82f6' : '#8b5cf6';
            
            return (
              <g key={index}>
                <circle
                  cx={screen.x}
                  cy={screen.y}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={screen.x + 8}
                  y={screen.y - 8}
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
          
          {/* Axis labels */}
          {xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0 && (
            <>
              <text x={svgWidth - 15} y={getScreenCoordinates(0, 0).y - 5} fill="hsl(var(--foreground))" fontSize="12">X</text>
              <text x={getScreenCoordinates(0, 0).x + 5} y="15" fill="hsl(var(--foreground))" fontSize="12">Y</text>
            </>
          )}
        </svg>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        <p>{t('dragToPan')} • {t('scrollToZoom')}</p>
        <p>{t('range')}: [{xMin.toFixed(1)}, {xMax.toFixed(1)}] × [{yMin.toFixed(1)}, {yMax.toFixed(1)}]</p>
      </div>
    </div>
  );
};
