import Auth from "./components/features/auth/Auth";
import Counter from "./components/features/counter/Counter";
import Header from "./components/Header";
import UserProfile from "./components/UserProfile";
import { selectAuth } from "./store/selectors/rootSelectors";
import { useAppSelector } from "./common/hooks/hooks";
import StaffingEditor1 from "./components/StaffingEditor1";
import StaffingEditor from "./components/StaffingEditor";
import DynamicTable from "./components/DynamicTable";
import { TABLE_SCHEMA } from "./components/Dataset";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DynamicTable1 from "./components/DynamicTable1";
import DynamicTable2 from "./components/DynamicTable2";

function App() {
  const isAuth = useAppSelector(selectAuth);
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        {!isAuth ? <Auth /> : <UserProfile />}
        <Counter />
        <div>
          {/* <DynamicTable1 schema={TABLE_SCHEMA} reportId={null} /> */}
          {/* <DynamicTable schema={TABLE_SCHEMA} /> */}
          <DynamicTable2 schema={TABLE_SCHEMA} reportId={null} />

          {/* <StaffingEditor1 /> */}
          {/* <StaffingEditor /> */}
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
