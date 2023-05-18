import React from "react";
import {Provider} from "react-redux";
import state from "./store";
import AppRouter from "./routing";
import Toast from "./components/Toast";
import AppFirebaseService from "./components/AppFirebaseService";

function App() {
    return (
          <Provider store={state}>
            <Toast/>
            <AppRouter/>
            {/*<AppFirebaseService/>*/}
          </Provider>
    );
}

export default App;
