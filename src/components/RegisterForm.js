import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Image as ImageIcon, Send, Shield, Users, Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    cedula: '',
    blood_type: '',
    role: 'piloto',
    health_service: '',
    personal_photo: null,
    bike_photo: null,
    email: '',
    whatsapp: ''
  });
  const [uploading, setUploading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, type) => {
    setFormData({ ...formData, [type]: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    let personalPhotoUrl = null;
    let bikePhotoUrl = null;

    if (formData.personal_photo) {
      const fileExt = formData.personal_photo.name.split('.').pop();
      const personalFileName = `${formData.cedula}_personal.${fileExt}`;
      const { error: personalError } = await supabase.storage
        .from('members')
        .upload(personalFileName, formData.personal_photo);
      if (personalError) {
        alert('Error subiendo foto personal: ' + personalError.message);
        setRegistering(false);
        return;
      }
      const { data: personalPublic } = supabase.storage.from('members').getPublicUrl(personalFileName);
      personalPhotoUrl = personalPublic.publicUrl;
    }

    if (formData.bike_photo && formData.role === 'piloto') {
      const fileExt = formData.bike_photo.name.split('.').pop();
      const bikeFileName = `${formData.cedula}_bike.${fileExt}`;
      const { error: bikeError } = await supabase.storage
        .from('members')
        .upload(bikeFileName, formData.bike_photo);
      if (bikeError) {
        alert('Error subiendo foto de moto: ' + bikeError.message);
        setRegistering(false);
        return;
      }
      const { data: bikePublic } = supabase.storage.from('members').getPublicUrl(bikeFileName);
      bikePhotoUrl = bikePublic.publicUrl;
    }

    const { error: insertError } = await supabase
      .from('members')
      .insert([{
        name: formData.name,
        nickname: formData.nickname,
        cedula: formData.cedula,
        personal_photo_url: personalPhotoUrl,
        bike_photo_url: bikePhotoUrl,
        blood_type: formData.blood_type,
        role: formData.role,
        health_service: formData.health_service,
        email: formData.email,
        whatsapp: formData.whatsapp
      }]);

    if (insertError) {
      console.error('Error inserting member:', insertError);
      alert('¡Ups! Algo falló al guardar: ' + insertError.message + '. Intenta de nuevo.');
    } else {
      const motoMsg = formData.role === 'piloto' ? `Moto: ${formData.bike_photo ? 'Subida' : 'No subida'}` : 'Copiloto (sin moto)';
      alert(`¡Bienvenido al crew, ${formData.name}! Notificaciones a ${formData.email}. WhatsApp: ${formData.whatsapp || 'No proporcionado'}. ${motoMsg}. ¡Enciende la ruta!`);
      navigate('/');
    }

    setRegistering(false);
  };

  const showBikePhoto = formData.role === 'piloto';

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Únete a Candelitas Bike
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <Shield className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-bold text-orange-600">Simple y Seguro</h3>
                <p className="text-gray-600">Solo datos esenciales. Email para notis de rutas, WhatsApp para mensajes rápidos.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <Users className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-bold text-yellow-600">Crew Instantáneo</h3>
                <p className="text-gray-600">Únete sin dramas: comparte fotos y únete a las chispas de aventura.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <Phone className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-bold text-green-600">Notificaciones Fáciles</h3>
                <p className="text-gray-600">Te avisamos de eventos por email o WhatsApp – ¡nada se te escapa!</p>
              </div>
            </div>
            <p className="text-gray-600">
              Enciende tu perfil con fotos y detalles. ¡Somos familia en la carretera, sin complicaciones!
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                required
              />
              <input
                type="text"
                name="nickname"
                placeholder="Apodo o rol en el grupo"
                value={formData.nickname}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                required
              />
            </div>
            <input
              type="text"
              name="cedula"
              placeholder="Número de cédula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email (para notificaciones de eventos)"
                value={formData.email}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                required
              />
              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp (ej: +573001234567, opcional)"
                value={formData.whatsapp}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                required
              >
                <option value="piloto">Piloto</option>
                <option value="copiloto">Copiloto</option>
              </select>
              <select
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                required
              >
                <option value="">Tipo de sangre (RH)</option>
                {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <input
              type="text"
              name="health_service"
              placeholder="Servicio de salud (ej: EPS Sura)"
              value={formData.health_service}
              onChange={handleChange}
              className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Foto personal
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'personal_photo')}
                  className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none"
                />
              </div>
              {showBikePhoto && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Foto de la moto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'bike_photo')}
                    className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none"
                  />
                </div>
              )}
              {!showBikePhoto && (
                <div className="text-center self-center text-gray-500 italic">
                  Copiloto: No necesitas foto de moto
                </div>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={registering}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {registering ? 'Enciendendo...' : (
                <>
                  <Send className="w-5 h-5" />
                  Unirme al Crew
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;