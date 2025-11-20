import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Home } from './Home'
import { ContextProvider } from "./ContextProvider";
import { Title } from "./Title";

function App() {
    return (
        <BrowserRouter>
            <ContextProvider>
                <Routes>
                    <Route path="/" element={<Title />} >
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </ContextProvider>
        </BrowserRouter>
    );
}

export default App;