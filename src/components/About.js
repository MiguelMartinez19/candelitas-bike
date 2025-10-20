import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';

const About = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      const { count, error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.error('Error fetching member count:', error);
        setMemberCount(0);
      } else {
        setMemberCount(count || 0);
      }
      setLoadingCount(false);
    };

    fetchMemberCount();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Sobre Candelitas Bike
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos la chispa que ilumina las noches en la carretera. Un grupo de moteros unidos por la libertad, las rutas épicas y el calor de la hermandad. Desde velitas principiantes hasta llamas expertas, todos encendemos juntos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-orange-600">
              {loadingCount ? 'Cargando...' : memberCount} Miembros
            </h3>
            <p className="text-gray-600">Chispas unidas en una fogata imparable.</p>
          </motion.div>

          {/* <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-red-600">Rutas Semanales</h3>
            <p className="text-gray-600">Explorando caminos con luz propia cada salida.</p>
          </motion.div> */}

          {/* <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-600">Pasión Eterna</h3>
            <p className="text-gray-600">No solo motos, sino una llama que no se apaga.</p>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default About;