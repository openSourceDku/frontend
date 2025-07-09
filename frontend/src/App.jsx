import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const location = useLocation();
  const noHeaderPaths = ['/'];

  return (
    <>
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;