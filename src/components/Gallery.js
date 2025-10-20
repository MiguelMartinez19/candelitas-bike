import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, Plus, Upload, Edit, Trash2, Key, Check, X } from "lucide-react";
import { supabase } from "../supabaseClient";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");
  const [newImageDate, setNewImageDate] = useState("");
  const [file, setFile] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editUploading, setEditUploading] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error("Error fetching images:", error);
      alert("Error cargando galería: " + error.message);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminKey === "cdb1903") {
      setAdminMode(true);
      setKeyModalOpen(false);
      alert("¡Modo jefe activado!");
    } else {
      alert("Clave incorrecta.");
      setAdminKey("");
    }
  };

  const handleEditImage = (img) => {
    setEditForm({
      id: img.id,
      title: img.title,
      description: img.description,
      adventure_date: img.adventure_date,
      image_url: img.image_url,
      new_image: null,
    });
    setEditingImage(img.id);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditFileChange = (e) => {
    setEditForm({ ...editForm, new_image: e.target.files?.[0] || null });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditUploading(true);

    let imageUrl = editForm.image_url;

    if (editForm.new_image) {
      if (editForm.image_url) {
        const oldFileName = editForm.image_url.split("/").pop();
        await supabase.storage.from("adventures").remove([oldFileName]);
      }

      const fileExt = editForm.new_image.name.split(".").pop();
      const fileName = `${editForm.id}_${Date.now()}_edit.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("adventures")
        .upload(fileName, editForm.new_image);
      if (uploadError) {
        alert("Error subiendo imagen: " + uploadError.message);
        setEditUploading(false);
        return;
      }
      const { data: publicData } = supabase.storage
        .from("adventures")
        .getPublicUrl(fileName);
      imageUrl = publicData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("gallery_images")
      .update({
        title: editForm.title,
        description: editForm.description,
        adventure_date: editForm.adventure_date,
        image_url: imageUrl,
      })
      .eq("id", editForm.id);

    if (updateError) {
      alert("Error actualizando: " + updateError.message);
    } else {
      alert("Imagen actualizada!");
      fetchImages();
      setEditingImage(null);
      setAdminMode(false);
    }

    setEditUploading(false);
  };

  const handleDeleteImage = async (id) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    const { data: img } = await supabase
      .from("gallery_images")
      .select("image_url")
      .eq("id", id)
      .single();
    if (img && img.image_url) {
      const fileName = img.image_url.split("/").pop();
      await supabase.storage.from("adventures").remove([fileName]);
    }

    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) {
      alert("Error eliminando: " + error.message);
    } else {
      alert("Imagen eliminada.");
      fetchImages();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !newImageTitle) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${newImageTitle.replace(/\s+/g, "_")}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("adventures")
      .upload(fileName, file);

    if (uploadError) {
      alert("Error subiendo: " + uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("adventures").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("gallery_images").insert([
      {
        title: newImageTitle,
        description: newImageDescription,
        image_url: publicUrl,
        adventure_date: newImageDate,
      },
    ]);

    if (insertError) {
      alert("Error guardando: " + insertError.message);
    } else {
      fetchImages();
      setNewImageTitle("");
      setNewImageDescription("");
      setNewImageDate("");
      setFile(null);
      alert("Aventura agregada!");
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-xl">Cargando galería...</p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Galería de Aventuras ({images.length})
          </h2>
          <p className="text-xl text-gray-600">
            Chispas de la carretera que iluminan nuestros recuerdos.
          </p>
          {!adminMode && (
            <motion.button
              className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto"
              onClick={() => setKeyModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Key className="w-5 h-5" />
              Modo Jefe
            </motion.button>
          )}
          {adminMode && (
            <motion.button
              className="mt-4 bg-red-500 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto"
              onClick={() => setAdminMode(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
              Salir Modo Jefe
            </motion.button>
          )}
        </motion.div>

        {keyModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setKeyModalOpen(false)}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                Ingresa la clave secreta
              </h3>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Clave secreta..."
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl flex items-center gap-2 justify-center"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Check className="w-4 h-4" />
                    Entrar
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setKeyModalOpen(false);
                      setAdminKey("");
                    }}
                    className="flex-1 bg-gray-500 text-white font-bold py-3 rounded-xl flex items-center gap-2 justify-center"
                    whileHover={{ scale: 1.02 }}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Título de la aventura"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                className="flex-1 p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="date"
                value={newImageDate}
                onChange={(e) => setNewImageDate(e.target.value)}
                className="p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <textarea
              placeholder="Descripción (opcional)"
              value={newImageDescription}
              onChange={(e) => setNewImageDescription(e.target.value)}
              rows={2}
              className="w-full p-4 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="p-4 border border-orange-300 rounded-xl focus:outline-none"
              required
            />
            <motion.button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 justify-center mx-auto disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {uploading ? (
                "Subiendo..."
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Agregar Chispa
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              {adminMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-1 rounded-full">
                  <motion.button
                    onClick={() => handleEditImage(img)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
              <img
                src={img.image_url}
                alt={img.title}
                loading="lazy"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">{img.title}</h3>
                  {img.adventure_date && (
                    <p className="text-xs opacity-90">{img.adventure_date}</p>
                  )}
                  {img.description && (
                    <p className="text-xs opacity-90 line-clamp-2">{img.description}</p>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Image className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          ))}
          {images.length === 0 && (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Plus className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 text-xl">¡Añade la primera aventura!</p>
            </motion.div>
          )}
        </div>

        {editingImage && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setEditingImage(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                Editar Aventura
              </h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="Título"
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="date"
                  name="adventure_date"
                  value={editForm.adventure_date || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Descripción"
                  rows={3}
                  className="w-full p-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Imagen actual:</p>
                  <img
                    src={editForm.image_url}
                    alt={editForm.title}
                    className="w-full h-48 object-cover rounded-xl mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full border border-orange-300 rounded-xl p-3"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <motion.button
                    type="submit"
                    disabled={editUploading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl flex items-center gap-2 justify-center disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editUploading ? (
                      "Guardando..."
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Guardar
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditingImage(null)}
                    className="flex-1 bg-gray-500 text-white font-bold py-3 rounded-xl flex items-center gap-2 justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
