import '../styles/globals.css';
import Layout from '../components/Layout';
import { RecommendationProvider } from '../context/RecommendationContext';

export default function App({ Component, pageProps }) {
  return (
    <RecommendationProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </RecommendationProvider>
  );
}