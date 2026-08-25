import { Router } from 'express';
import categoriasRoutes from './categorias.routes.js';
import unidadesRoutes from './unidades.routes.js';
import productosRoutes from './productos.routes.js';
import descuentosRoutes from './descuentos.routes.js';
import ofertasRoutes from './ofertas.routes.js';
import clientesRoutes from './clientes.routes.js';
import ordenesRoutes from './ordenes.routes.js';
import favoritosRoutes from './favoritos.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    data: {
      nombre: 'Rosamark API',
      version: '3.0.0',
      recursos: [
        '/categorias',
        '/unidades',
        '/productos',
        '/descuentos/tipos',
        '/descuentos/valores',
        '/descuentos/codigos',
        '/descuentos/validar-codigo',
        '/ofertas',
        '/clientes/registro',
        '/clientes/login',
        '/clientes/me',
        '/clientes/:id/ordenes',
        '/ordenes',
        '/ordenes/:id',
        '/favoritos',
        '/clientes/me/contrasena',
      ],
    },
    error: null,
  });
});

router.use('/categorias', categoriasRoutes);
router.use('/unidades', unidadesRoutes);
router.use('/productos', productosRoutes);
router.use('/descuentos', descuentosRoutes);
router.use('/ofertas', ofertasRoutes);
router.use('/clientes', clientesRoutes);
router.use('/ordenes', ordenesRoutes);
router.use('/favoritos', favoritosRoutes);

export default router;
