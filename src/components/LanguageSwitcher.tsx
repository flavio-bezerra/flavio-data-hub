import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const flags = {
        pt: (
            <svg viewBox="0 0 640 480" className="w-6 h-6 rounded-sm shadow-sm">
                <g fillRule="evenodd" strokeWidth="1pt">
                    <path fill="#009c3b" d="M0 0h640v480H0z" />
                    <path fill="#ffdf00" d="M320 40L40 240l280 200 280-200z" />
                    <circle cx="320" cy="240" r="100" fill="#002776" />
                    <path fill="#fff" fillRule="evenodd" d="M320 240l-20-80h40z" opacity="0.1" />
                    {/* Simplified Brazil Flag */}
                    <path fill="#fff" d="M250 240a120 120 0 00140 0h-140z" opacity="0.1" />
                </g>
            </svg>
        ),
        en: (
            <svg viewBox="0 0 640 480" className="w-6 h-6 rounded-sm shadow-sm">
                <path fill="#012169" d="M0 0h640v480H0z" />
                <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
                <path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
                <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
                <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
            </svg>
        ),
        es: (
            <svg viewBox="0 0 640 480" className="w-6 h-6 rounded-sm shadow-sm">
                <path fill="#AA151B" d="M0 0h640v480H0z" />
                <path fill="#F1BF00" d="M0 120h640v240H0z" />
            </svg>
        )
    };

    return (
        <motion.div
            className="fixed top-4 right-4 z-50 flex gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            <Button
                variant={language === 'pt' ? 'default' : 'ghost'}
                size="icon"
                className={`w-8 h-8 rounded-full ${language === 'pt' ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setLanguage('pt')}
                title="Português"
            >
                {flags.pt}
            </Button>
            <Button
                variant={language === 'es' ? 'default' : 'ghost'}
                size="icon"
                className={`w-8 h-8 rounded-full ${language === 'es' ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setLanguage('es')}
                title="Español"
            >
                {flags.es}
            </Button>
            <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="icon"
                className={`w-8 h-8 rounded-full ${language === 'en' ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setLanguage('en')}
                title="English"
            >
                {flags.en}
            </Button>
        </motion.div>
    );
};

export default LanguageSwitcher;
