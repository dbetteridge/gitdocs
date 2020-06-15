import NewSpaceForm from "@components/NewSpaceForm";
import AuthProvider from "@components/AuthProvider";

export default () => (
  <AuthProvider>
    <NewSpaceForm />
  </AuthProvider>
);
