import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  fallbackPath?: string;
}

export const BackButton = ({ 
  className = "", 
  variant = "outline", 
  size = "sm",
  fallbackPath = "/dashboard"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in history, fallback to dashboard if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleBack}
      className={`hover-scale ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};