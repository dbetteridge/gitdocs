import Repos from "@components/Repos";
import AuthProvider from "@components/AuthProvider";

export default () => (
  <AuthProvider>
    <Repos />
  </AuthProvider>
);
