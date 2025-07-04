import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Home } from "@/pages/home";
import { Help } from "@/pages/help";
import { Verified } from "@/pages/verified";
import { Delay1 } from "@/pages/delay1";
import { Verified2 } from "@/pages/verified2";
import { Delay2 } from "@/pages/delay2";
import { Verified3 } from "@/pages/verified3";
import { Verified4 } from "@/pages/verified4";
import { PasswordVerify } from "@/pages/password-verify";
import { Verified5 } from "@/pages/verified5";
import { AdminLogin } from "@/pages/admin-login";
import { Admin } from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        <Header />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/help" component={Help} />
          <Route path="/verified" component={Verified} />
          <Route path="/delay1" component={Delay1} />
          <Route path="/verified2" component={Verified2} />
          <Route path="/delay2" component={Delay2} />
          <Route path="/verified3" component={Verified3} />
          <Route path="/verified4" component={Verified4} />
          <Route path="/password-verify" component={PasswordVerify} />
          <Route path="/verified5" component={Verified5} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
