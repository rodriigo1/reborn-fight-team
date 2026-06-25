// ============================================================
// routes/perfil.js — Rotas do Perfil
// ============================================================

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { verificarToken } = require('../middleware/auth');
const { obterPerfil, atualizarPerfil, atualizarFoto } = require('../controllers/perfilController');

// Configurar multer para upload de fotos de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'perfil'));
    },
    filename: (req, file, cb) => {
        // Usar o ID do utilizador + timestamp para evitar conflitos
        const ext = path.extname(file.originalname);
        cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
    fileFilter: (req, file, cb) => {
        const tipos = ['image/jpeg', 'image/png', 'image/webp'];
        if (tipos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPG, PNG ou WebP são aceites.'));
        }
    },
});

// Perfil do utilizador (requer autenticação)
router.get('/', verificarToken, obterPerfil);
router.put('/', verificarToken, atualizarPerfil);

// Upload de foto de perfil
router.put('/foto', verificarToken, upload.single('foto'), atualizarFoto);

module.exports = router;
