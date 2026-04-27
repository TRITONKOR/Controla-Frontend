import "./App.scss";
import { LoginPage } from "./pages/LoginPage";
import { PageLayout } from "./widgets/PageLayout";

function App() {
    return (
        <div className="App">
            <PageLayout>
                {/* <GreetingPage /> */}
                <LoginPage />
            </PageLayout>
        </div>
    );
}

export default App;
