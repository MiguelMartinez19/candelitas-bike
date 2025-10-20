import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="grid md:grid-cols-3 gap-8 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
              Candelitas Bike
            </h3>
            <p className="text-white/90">
              La chispa que no se apaga. Acelera con la llama de la hermandad.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/90">Explora</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/gallery"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  to="/members"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Miembros
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Únete
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/90">Sigue la Llama</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://www.facebook.com/share/1AVXSQ9FUE/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              {/* <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a> */}
              <a
                href="https://www.tiktok.com/@candelitas.biker"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-tiktok"
                  viewBox="0 0 16 16"
                >
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
          <p>
            &copy; 2024 Candelitas Bike. Todos los derechos reservados. ¡Mantén la chispa
            viva!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
