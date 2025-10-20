import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Users,
  Bike,
  Mail,
  Phone,
  Edit,
  Trash2,
  Key,
  Check,
  X,
  Users as UsersIcon,
  Shield,
} from "lucide-react";
import { supabase } from "../supabaseClient";

// Componente reutilizable para tarjetas de miembros
const MemberCard = ({ member, index, adminMode, onEdit, onDelete }) => (
  <motion.div
    className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200/50 group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
  >
    {/* Botones admin solo en modo jefe */}
    {adminMode && (
      <div className="absolute top-3 right-3 flex gap-2 bg-white/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <motion.button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    )}

    {/* Contenido de la tarjeta */}
    <div className="text-center">
      <div className="mb-4">
        {member.personal_photo_url ? (
          <img
            src={member.personal_photo_url}
            alt={member.name}
            loading="lazy"
            className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg border-4 border-white"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl shadow-lg">
            {member.nickname?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-orange-600">
        {member.nickname || member.name}
      </h3>
      <p className="text-gray-700 font-medium mb-3">{member.name}</p>

      <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-orange-50 rounded-lg">
        <Bike className="w-5 h-5 text-orange-600" />
        <span className="font-semibold text-orange-700 capitalize">{member.role}</span>
      </div>

      {/* Info adicional: EPS, RH */}
      <div className="space-y-2 mb-4">
        {member.health_service && (
          <div className="flex items-center justify-center gap-1 text-xs bg-blue-50 px-3 py-1 rounded-full">
            <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <span className="text-blue-700 font-medium truncate">
              EPS {member.health_service}
            </span>
          </div>
        )}
        {member.blood_type && (
          <div className="flex items-center justify-center gap-1 bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 font-medium">{member.blood_type}</span>
          </div>
        )}
      </div>

      {member.bike_photo_url && member.role === "piloto" && (
        <div className="mb-4">
          <img
            src={member.bike_photo_url}
            alt="Moto"
            loading="lazy"
            className="w-full h-32 object-cover rounded-xl shadow-md"
          />
        </div>
      )}

      <div className="space-y-1 text-xs text-gray-600 text-center border-t pt-3">
        {member.email && (
          <div className="flex items-center justify-center gap-1">
            <Mail className="w-3 h-3 text-gray-500" />
            <span className="truncate max-w-[140px]">{member.email}</span>
          </div>
        )}
        {member.whatsapp && (
          <div className="flex items-center justify-center gap-1">
            <Phone className="w-3 h-3 text-gray-500" />
            <span className="truncate max-w-[140px]">{member.whatsapp}</span>
          </div>
        )}
        <div className="text-gray-400 text-xs">
          Unido: {new Date(member.created_at).toLocaleDateString("es-ES")}
        </div>
      </div>
    </div>
  </motion.div>
);

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editUploading, setEditUploading] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error("Error fetching members:", error);
      alert("Error cargando miembros: " + error.message);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminKey === "cdb1903") {
      setAdminMode(true);
      setKeyModalOpen(false);
      alert("¡Modo jefe activado! Ahora puedes editar/eliminar.");
    } else {
      alert("Clave incorrecta. Intenta de nuevo.");
      setAdminKey("");
    }
  };

  const handleEditMember = (member) => {
    setEditForm({
      id: member.id,
      name: member.name,
      nickname: member.nickname,
      cedula: member.cedula,
      blood_type: member.blood_type,
      role: member.role,
      health_service: member.health_service,
      email: member.email || "",
      whatsapp: member.whatsapp || "",
      personal_photo: null,
      bike_photo: null,
      personal_photo_url: member.personal_photo_url,
      bike_photo_url: member.bike_photo_url,
    });
    setEditingMember(member.id);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditFileChange = (e, type) => {
    setEditForm({ ...editForm, [type]: e.target.files?.[0] || null });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditUploading(true);

    let personalPhotoUrl = editForm.personal_photo_url;
    let bikePhotoUrl = editForm.bike_photo_url;

    if (editForm.personal_photo) {
      if (editForm.personal_photo_url) {
        const oldFileName = editForm.personal_photo_url.split("/").pop();
        await supabase.storage.from("members").remove([oldFileName]);
      }
      const fileExt = editForm.personal_photo.name.split(".").pop();
      const personalFileName = `${editForm.cedula}_${Date.now()}_personal.${fileExt}`;
      const { error: personalError } = await supabase.storage
        .from("members")
        .upload(personalFileName, editForm.personal_photo);
      if (personalError) {
        alert("Error actualizando foto personal: " + personalError.message);
        setEditUploading(false);
        return;
      }
      const { data: personalPublic } = supabase.storage
        .from("members")
        .getPublicUrl(personalFileName);
      personalPhotoUrl = personalPublic.publicUrl;
    }

    if (editForm.bike_photo && editForm.role === "piloto") {
      if (editForm.bike_photo_url) {
        const oldBikeFileName = editForm.bike_photo_url.split("/").pop();
        await supabase.storage.from("members").remove([oldBikeFileName]);
      }
      const fileExt = editForm.bike_photo.name.split(".").pop();
      const bikeFileName = `${editForm.cedula}_${Date.now()}_bike.${fileExt}`;
      const { error: bikeError } = await supabase.storage
        .from(" members")
        .upload(bikeFileName, editForm.bike_photo);
      if (bikeError) {
        alert("Error actualizando foto de moto: " + bikeError.message);
        setEditUploading(false);
        return;
      }
      const { data: bikePublic } = supabase.storage
        .from("members")
        .getPublicUrl(bikeFileName);
      bikePhotoUrl = bikePublic.publicUrl;
    }
    const { error: updateError } = await supabase
      .from("members")
      .update({
        name: editForm.name,
        nickname: editForm.nickname,
        blood_type: editForm.blood_type,
        role: editForm.role,
        health_service: editForm.health_service,
        email: editForm.email,
        whatsapp: editForm.whatsapp,
        personal_photo_url: personalPhotoUrl,
        bike_photo_url: bikePhotoUrl,
      })
      .eq("id", editForm.id);
    if (updateError) {
      alert("Error guardando cambios: " + updateError.message);
    } else {
      alert("Miembro actualizado con éxito.");
      fetchMembers();
      setEditingMember(null);
    }
    setEditUploading(false);
  };
  const handleDeleteMember = async (member) => {
    if (
      window.confirm(
        `¿Seguro que quieres eliminar a ${member.name}? Esta acción no se puede deshacer.`
      )
    ) {
      if (member.personal_photo_url) {
        const personalFileName = member.personal_photo_url.split("/").pop();
        await supabase.storage.from("members").remove([personalFileName]);
      }
      if (member.bike_photo_url) {
        const bikeFileName = member.bike_photo_url.split("/").pop();
        await supabase.storage.from("members").remove([bikeFileName]);
      }
      const { error } = await supabase.from("members").delete().eq("id", member.id);
      if (error) {
        alert("Error eliminando miembro: " + error.message);
      } else {
        alert("Miembro eliminado con éxito.");
        fetchMembers();
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600 flex items-center gap-2">
            <UsersIcon className="w-8 h-8" /> Miembros del Club
          </h1>
          {!adminMode && (
            <motion.button
              onClick={() => setKeyModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Key className="w-5 h-5" /> Modo Jefe
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Cargando miembros...</div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Pilotos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members
                  .filter((member) => member.role === "piloto")
                  .map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      adminMode={adminMode}
                      onEdit={() => handleEditMember(member)}
                      onDelete={() => handleDeleteMember(member)}
                    />
                  ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Copilotos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members
                  .filter((member) => member.role !== "piloto")
                  .map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      adminMode={adminMode}
                      onEdit={() => handleEditMember(member)}
                      onDelete={() => handleDeleteMember(member)}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      {/* Modal Clave Admin */}
      {keyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-orange-600 flex items-center gap-2">
              <Key className="w-6 h-6" /> Modo Jefe
            </h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingresa la clave:
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setKeyModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Entrar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Modal Editar Miembro */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 overflow-auto p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-orange-600 flex items-center gap-2">
              <Edit className="w-6 h-6" /> Editar Miembro
            </h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apodo:
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={editForm.nickname}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Sangre:
                </label>
                <input
                  type="text"
                  name="blood_type"
                  value={editForm.blood_type}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol:
                </label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="piloto">Piloto</option>
                  <option value="mecanico">Mecánico</option>
                  <option value="soporte">Soporte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EPS:
                </label>
                <input
                  type="text"
                  name="health_service"
                  value={editForm.health_service}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp:
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={editForm.whatsapp}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Personal:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditFileChange(e, "personal_photo")}
                  className="w-full"
                />
              </div>
              {editForm.role === "piloto" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto de Moto:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditFileChange(e, "bike_photo")}
                    className="w-full"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  disabled={editUploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
                  disabled={editUploading}
                >
                  {editUploading ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default MembersList;
