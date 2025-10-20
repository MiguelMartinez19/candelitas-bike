// import React from 'react';
// import { motion } from 'framer-motion';
// import { Calendar, MapPin, ArrowRight } from 'lucide-react';

// const Events = () => {
//   const upcomingEvents = [
//     {
//       title: 'Ruta de Velitas Nocturna',
//       date: '15 de Marzo, 2024',
//       location: 'Carretera Costera',
//       description: 'Una rodada iluminada por la luna y las chispas de fraternidad, con paradas para compartir historias.'
//     },
//     {
//       title: 'Encuentro de Mecánicos',
//       date: '22 de Marzo, 2024',
//       location: 'Taller Central',
//       description: 'Reunión para tips de mantenimiento y planear la próxima llama en el camino.'
//     },
//     {
//       title: 'Carrera de Chispas',
//       date: '5 de Abril, 2024',
//       location: 'Circuito Sur',
//       description: '¡Enciende tu motor! Desafío con premios para los que brillan más rápido.'
//     }
//   ];

//   return (
//     <section className="py-20 bg-white">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <motion.h2
//           className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           Eventos Próximos
//         </motion.h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           {upcomingEvents.map((event, index) => (
//             <motion.div
//               key={index}
//               className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200"
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               viewport={{ once: true }}
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
//                   <Calendar className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="font-bold text-orange-600">{event.date}</span>
//               </div>
//               <h3 className="text-2xl font-bold mb-2 text-gray-800">{event.title}</h3>
//               <p className="text-gray-600 mb-4">{event.description}</p>
//               <div className="flex items-center gap-2 mb-4">
//                 <MapPin className="w-4 h-4 text-orange-500" />
//                 <span className="text-gray-600">{event.location}</span>
//               </div>
//               <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md">
//                 Inscribirme <ArrowRight className="w-4 h-4" />
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Events;