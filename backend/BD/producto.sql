DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idProducto` varchar(255) NOT NULL,
  `nombreProducto` varchar(255) NOT NULL,
  `color` varchar(250) NOT NULL,
  `precio` int(11) NOT NULL,
  `talla` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `genero` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProductos` (`idProducto`),
  KEY `nombreProducto` (`nombreProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `idProducto`, `nombreProducto`, `color`, `precio`, `talla`, `stock`, `genero`) VALUES
(6, '45216', 'Nike Air-Force 1', 'Blanco', 100, 36, 10, 'Niño');
COMMIT;