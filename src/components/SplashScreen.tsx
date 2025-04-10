import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  isAuthenticated: boolean;
};

const SplashScreen: React.FC<Props> = ({ isAuthenticated }) => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginForm");
    } else {
      // Set timer for 10 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
        setTimeout(() => {
          navigate("/home");
        }, 100);
      }, 3000); // 10 seconds splash screen

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !showSplash) return null;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e5e9f2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Logo container with subtle animation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          animation: "fadeIn 0.8s ease-out forwards",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f63cd 0%, #647dee 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 20px rgba(79, 99, 205, 0.3)",
              marginRight: "15px",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              J
            </span>
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#000000", // Changed to black
              letterSpacing: "0.5px",
              margin: 0,
            }}
          >
            Job<span style={{ color: "#000000" }}>Match</span>{" "}
            {/* Changed to black */}
          </h1>
        </div>
      </div>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `,
        }}
      />
    </div>
  );
};

export default SplashScreen;
