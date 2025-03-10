

import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { AdminCallbackPage } from "./pages/admin";
import { CreateObject } from "./pages/Create/Object";
import { EditObject } from "./pages/Edit/Edit";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { Main } from "./pages/Main";
import { queryClient } from "./query";
import { Redirect } from "./components/Redirect/Redirect";
import { Suspense } from "react";
import { Verify } from "./pages/Verify/Verify";
import { ViewObject } from "./pages/View/Object";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/">
                    <Route path="redirect" element={<Redirect />} />
                    <Route index element={<Main />} />
                    <Route path="verify" element={<Verify />} />
                    <Route path="create">
                      <Route path=":objectName" element={<CreateObject />} />
                      <Route
                        path=":objectName/:objectId"
                        element={<CreateObject />}
                      />
                    </Route>
                    <Route path="edit">
                      <Route
                        path=":objectName/:objectId"
                        element={<EditObject />}
                      />
                    </Route>
                    <Route path="admin">
                      <Route
                        path="callback"
                        element={<AdminCallbackPage />}
                      />
                    </Route>
                    <Route path="findOrCreate" element={<FindOrCreate />} />
                    <Route path="admin"></Route>
                    <Route path="view">
                      <Route
                        path=":objectView/:objectName/:objectId"
                        element={<ViewObject />}
                      />
                    </Route>
                  </Route>
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
