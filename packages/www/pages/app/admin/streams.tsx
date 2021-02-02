import useApi from "../../../hooks/use-api";
import Layout from "../../../components/Layout";
import useLoggedIn from "../../../hooks/use-logged-in";
import TabbedLayout from "../../../components/TabbedLayout";
import AdminStreamsTable from "../../../components/AdminStreamsTable/v2";
import { getTabs } from "../admin";

const AdminStreamsPage = () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user || user.emailValid === false) {
    return <Layout />;
  }
  const tabs = getTabs(2);

  return (
    <TabbedLayout tabs={tabs} logout={logout}>
      <AdminStreamsTable id="Admin API Token Table" />
    </TabbedLayout>
  );
};

export default AdminStreamsPage;
