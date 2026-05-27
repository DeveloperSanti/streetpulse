import { AppRouter } from '@/routes/router';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
