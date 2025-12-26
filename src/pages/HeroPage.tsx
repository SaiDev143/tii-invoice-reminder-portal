import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { getLoginRequest } from "@/authConfig";
import Index from "./Index";
import FullScreenLoader from "@/components/FullScreenLoader";

const HeroPage = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/dashboard");
    }
  }, [accounts, navigate]);

  const onAccessPortalClick = () => {
    setLoading(true);

    setTimeout(() => {
      instance.loginRedirect({
        ...getLoginRequest(),
        prompt: "select_account",
      });
    }, 300); // small delay so loader renders
  };

  if (loading) return <FullScreenLoader />;

  return <Index onAccessPortalClick={onAccessPortalClick} />;
};

export default HeroPage;
