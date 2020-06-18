import { useEffect } from "react";

export default () => {
  useEffect(() => {
    window.opener.location.reload();
    window.close();
  }, []);

  return null;
};
