
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall, Clock, FileText, PenLine } from "lucide-react";
import { motion } from "framer-motion";

export const CallToActionSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/staff-tce.jpg')] bg-cover bg-center opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary to-primary-foreground/10"></div>
      
      {/* Animated circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 transform translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{ 
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 15, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Prêt à transformer votre{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
                relation client
              </span>
              ?
            </h2>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="mb-8 text-primary-foreground/90 text-xl leading-relaxed"
          >
            Rejoignez les entreprises leaders qui font confiance à TopCenter pour leur stratégie de communication client
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-center gap-6 mt-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredButton('contact')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative overflow-hidden group w-full md:w-auto px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10 flex items-center text-lg font-semibold">
                  <PhoneCall className={`w-5 h-5 mr-3 transition-transform duration-300 ${hoveredButton === 'contact' ? 'rotate-12 scale-110' : ''}`} />
                  Contactez-nous maintenant
                  <ArrowRight className={`ml-3 w-5 h-5 transition-transform duration-300 ${hoveredButton === 'contact' ? 'translate-x-2' : ''}`} />
                </span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredButton('devis')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto px-8 py-6 bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10 flex items-center text-lg font-semibold">
                  <FileText className={`w-5 h-5 mr-3 transition-transform duration-300 ${hoveredButton === 'devis' ? 'rotate-12 scale-110' : ''}`} />
                  Demander un devis personnalisé
                </span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-white/80 flex items-center justify-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            <span>Réponse garantie sous 24h</span>
            <span className="mx-4">•</span>
            <PenLine className="w-4 h-4 mr-2" />
            <span>Devis sans engagement</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
