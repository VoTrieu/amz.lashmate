import { FC } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProductPage from './pages/admin/products/ProductPage';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
            <Route exact path="/" component={ProductPage}/>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
