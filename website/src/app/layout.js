import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../components/AuthProvider';
import { CarrinhoProvider } from '../components/CarrinhoProvider';

export const metadata = {
    title: 'Reborn Fight Team | Academia de Artes Marciais',
    description: 'Academia de MMA, BJJ e Muay Thai. Treina com os melhores instrutores.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt">
            <body>
                <AuthProvider>
                    <CarrinhoProvider>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </CarrinhoProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
