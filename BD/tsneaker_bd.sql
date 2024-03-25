-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 24-03-2024 a las 20:29:06
-- Versión del servidor: 8.2.0
-- Versión de PHP: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tsneaker_bd`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `buscarOrden`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarOrden` (IN `_id` INT, IN `_idCompra` VARCHAR(15))   begin
    select * from ordenesdecompras where id= _id or idCompra = _idCompra;
end$$

DROP PROCEDURE IF EXISTS `buscarPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarPersona` (`_id` INT, `_idPersona` VARCHAR(15))   begin
    select * from personas where id = _id or idPersona=_idPersona;
end$$

DROP PROCEDURE IF EXISTS `buscarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarProducto` (IN `_id` VARCHAR(15), IN `_idProducto` VARCHAR(255))   begin
    select * from productos where idProducto =_idProducto or id = _id;
end$$

DROP PROCEDURE IF EXISTS `buscarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarUsuario` (IN `_id` INT(11), IN `_idUsuario` VARCHAR(15))   begin
    select * from usuario where id=_id or idUsuario = _idUsuario;
end$$

DROP PROCEDURE IF EXISTS `filtrarOrden`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarOrden` (IN `_parametros` VARCHAR(250), IN `_pagina` SMALLINT UNSIGNED, IN `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idCompra&idUsuario&idProducto&detalle&montoTotal&fechaCreacion&idFactura') INTO @filtro;
    SELECT concat("SELECT * from ordenesdecompras where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `filtrarPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarPersona` (IN `_parametros` VARCHAR(250), IN `_pagina` SMALLINT UNSIGNED, IN `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idPersona&nombre&apellido1&apellido2&') INTO @filtro;
    SELECT concat("SELECT * from personas where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `filtrarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarProducto` (IN `_parametros` VARCHAR(250), IN `_pagina` SMALLINT UNSIGNED, IN `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idProducto&nombreProducto&color&precio&talla&genero') INTO @filtro;
    SELECT concat("SELECT * from productos Where", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsOrden`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsOrden` (IN `_parametros` VARCHAR(255))   begin
    SELECT cadenaFiltro(_parametros, 'idCompra&idUsuario&idProducto&detalle&montoTotal&fechaCreacion&idFactura') INTO @filtro;
    SELECT concat("SELECT count(idCompra) from ordenesdecompras where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsOrdenes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsOrdenes` (IN `_parametros` VARCHAR(255))   begin
    SELECT cadenaFiltro(_parametros, 'idCompra') INTO @filtro;
    SELECT concat("SELECT count(idCompra) from ordenesdecompras where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsPersona` (IN `_parametros` VARCHAR(250))   begin
    SELECT cadenaFiltro(_parametros, 'idPersona&nombre&apellido1&apellido2&') INTO @filtro;
    SELECT concat("SELECT count(idPersona) from personas where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsProducto` (IN `_parametros` VARCHAR(250))   begin
    SELECT cadenaFiltro(_parametros, 'idProducto&nombreProducto&color&precio&talla&genero&') INTO @filtro;
    SELECT concat("SELECT count(id) from productos where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `verificarToken`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verificarToken` (IN `_idUsuario` VARCHAR(15), IN `_tkR` VARCHAR(255))   begin
    select idRol from usuario where idUsuario = _idUsuario or tkR = _tkR;
end$$

--
-- Funciones
--
DROP FUNCTION IF EXISTS `cadenaFiltro`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `cadenaFiltro` (`_parametros` VARCHAR(250), `_campos` VARCHAR(100)) RETURNS VARCHAR(250) CHARSET utf8mb3 COLLATE utf8mb3_spanish_ci  begin
    declare _salida varchar (100);
    set @param = _parametros;
    set @campos = _campos;
    set @filtro = "";
    WHILE (LOCATE('&', @param) > 0) DO
        set @valor = SUBSTRING_INDEX(@param, '&', 1);
        set @param = substr(@param, LOCATE('&', @param)+1);
        set @campo = SUBSTRING_INDEX(@campos, '&', 1);
        set @campos = substr(@campos, LOCATE('&', @campos)+1);
        set @filtro = concat(@filtro, " ", @campo, " LIKE '", @valor, "' and");       
    END WHILE;
    set @filtro = TRIM(TRAILING 'and' FROM @filtro);  
    return @filtro;
end$$

DROP FUNCTION IF EXISTS `editarOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editarOrden` (`_idCompra` VARCHAR(255), `_idUsuario` VARCHAR(255), `_idProducto` VARCHAR(255), `_detalle` VARCHAR(255), `_montoTotal` INT(11)) RETURNS INT  begin
    declare _cant int;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant > 0 then
        update ordenesdecompras set
            idCompra = _idCompra,
            idUsuario = _idUsuario,
            idProducto = _idProducto,
            detalle = _detalle,
            montoTotal = _montoTotal
        where idCompra = _idCompra;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `editarPersona`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editarPersona` (`_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100), `_idRol` VARCHAR(100)) RETURNS INT  begin
    declare _cant int;
    select count(idPersona) into _cant from personas where idPersona = _idPersona;
    if _cant > 0 then
        update personas set
            idPersona = _idPersona,
            nombre = _nombre,
            apellido1 = _apellido1,
            apellido2 = _apellido2,
            telefono = _telefono,
            celular = _celular,
            direccion = _direccion,
            correo = _correo,
            idRol = _idRol
        where idPersona = _idPersona;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `editarProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editarProducto` (`_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_color` VARCHAR(255), `_precio` INT, `_talla` INT, `_stock` INT, `_genero` VARCHAR(75)) RETURNS INT  begin
    declare _cant int;
    select count(idProducto) into _cant from productos where idProducto = _idProducto;
    if _cant > 0 then
        update productos set
        	idProducto = _idProducto,
            nombreProducto = _nombreProducto,
            precio = _precio,
            talla = _talla,
            stock = _stock,
            genero = _genero,
            color = _color
        where idProducto = _idProducto;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `eliminarOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarOrden` (`_idCompra` INT(1)) RETURNS INT  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
     if _cant > 0 then
            set _resp = 1;
            delete from ordenesdecompras where idCompra = _idCompra;
        else 
            set _resp = 2;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `eliminarPersona`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarPersona` (`_idPersona` INT(1)) RETURNS INT  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idPersona) into _cant from personas where idPersona = _idPersona;
    if _cant > 0 then
        set _resp = 1;
        select count(idUsuario) into _cant from ordenesdecompras where idUsuario = _idPersona;
        if _cant = 0 then
            delete from personas where idPersona = _idPersona;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `eliminarProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarProducto` (`_idProducto` INT(11)) RETURNS INT  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idProducto) into _cant from productos where idProducto = _idProducto;
    if _cant > 0 then
        set _resp = 1;
        select count(idProducto) into _cant from ordenesdecompras where idProducto = _idProducto;
        if _cant = 0 then
            delete from productos where idProducto = _idProducto;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `eliminarUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarUsuario` (`_idUsuario` VARCHAR(255)) RETURNS INT  begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where id = _id;
    if _cant > 0 then
        delete from usuario where idUsuario = _idUsuario;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `modificarToken`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `modificarToken` (`_idUsuario` VARCHAR(15), `_tkR` VARCHAR(255)) RETURNS INT  begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where idUsuario = _idUsuario;
    if _cant > 0 then
        update usuario set
                tkR = _tkR
                where idUsuario = _idUsuario;
        if _tkR <> "" then
            update usuario set
                ultimoAcceso = now()
                where idUsuario = _idUsuario;
        end if;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevaOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevaOrden` (`_idCompra` VARCHAR(255), `_idUsuario` VARCHAR(255), `_idProducto` VARCHAR(255), `_detalle` VARCHAR(255), `_montoTotal` INT(11), `_fechaCreacion` DATE, `_idFactura` INT) RETURNS INT  begin
    declare _cant int;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant < 1 then
        SELECT stock FROM productos WHERE idProducto = _idProducto INTO @stock;
        UPDATE productos SET stock = @stock-1 WHERE idProducto = _idProducto;
        insert into ordenesdecompras(idCompra,idUsuario, idProducto, detalle, montoTotal,fechaCreacion,idFactura) 
            values (_idCompra,_idUsuario, _idProducto, _detalle, _montoTotal,_fechaCreacion,_idFactura);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoAdmin`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoAdmin` (`_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100)) RETURNS INT  begin 
    declare _cant int;
    select count(_idPersona) into _cant from Personas where idPersona = _idPersona;
    if _cant < 1 then
        insert into personas(idPersona, nombre, apellido1, apellido2, telefono, 
            celular, direccion, correo) 
            values (_idPersona, _nombre, _apellido1, _apellido2, _telefono, 
            _celular, _direccion, _correo,1);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoOrden` (`_idCompra` VARCHAR(255), `_idUsuario` VARCHAR(255), `_idProducto` VARCHAR(255), `_detalle` VARCHAR(255), `_montoTotal` INT(11), `_fechaCreacion` DATE, `_idFactura` INT) RETURNS INT  begin
    declare _cant int;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant < 1 then
        SELECT stock FROM productos WHERE idProducto = _idProducto INTO @stock;
        UPDATE productos SET stock = @stock-1 WHERE idProducto = _idProducto;
        insert into ordenesdecompras(idCompra,idUsuario, idProducto, detalle, montoTotal,fechaCreacion,idFactura) 
            values (_idCompra,_idUsuario, _idProducto, _detalle, _montoTotal,_fechaCreacion,_idFactura);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoPersona`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoPersona` (`_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100), `_idRol` VARCHAR(250)) RETURNS INT  begin 
    declare _cant int;
    select count(_idPersona) into _cant from Personas where idPersona = _idPersona;
    if _cant < 1 then
        insert into personas(idPersona, nombre, apellido1, apellido2, telefono, 
            celular, direccion, correo,idRol) 
            values (_idPersona, _nombre, _apellido1, _apellido2, _telefono, 
            _celular, _direccion, _correo,_idRol);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoProducto` (`_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_color` VARCHAR(255), `_precio` INT, `_Talla` VARCHAR(15), `_stock` INT, `_genero` VARCHAR(255)) RETURNS INT  begin
    declare _cant int;
    select count(idProducto) into _cant from productos where idProducto = _idProducto;
    if _cant < 1 then
        insert into productos(idProducto, nombreProducto, precio, talla, stock, 
            color, genero) 
            values (_idProducto, _nombreProducto, _precio, _talla, _stock, 
            _color, _genero);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoUsuario` (`_idUsuario` VARCHAR(15), `_idRol` INT, `_passw` VARCHAR(255)) RETURNS INT  begin
    declare _cant int;
    select count(id) into _cant from usuario where idUsuario = _idUsuario;
    if _cant < 1 then
        insert into usuario(idUsuario, idRol, passw) 
            values (_idUsuario, _idRol, _passw);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `passwUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `passwUsuario` (`_idUsuario` VARCHAR(255), `_passw` VARCHAR(255)) RETURNS INT  begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where idUsuario = _idUsuario;
    if _cant > 0 then
        update usuario set
            passw = _passw
        where idUsuario = _idUsuario;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `rolUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `rolUsuario` (`_idUsuario` INT, `_idRol` INT) RETURNS INT  begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where idUsuario = _idUsuario;
    if _cant > 0 then
        update usuario set
            idRol = _idRol
        where idUsuario = _idUsuario;
    end if;
    return _cant;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenesdecompras`
--

DROP TABLE IF EXISTS `ordenesdecompras`;
CREATE TABLE IF NOT EXISTS `ordenesdecompras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idCompra` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idUsuario` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idProducto` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `detalle` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `montoTotal` int NOT NULL,
  `fechaCreacion` date NOT NULL,
  `idFactura` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idusuario` (`idUsuario`),
  KEY `idProducto` (`idProducto`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `ordenesdecompras`
--

INSERT INTO `ordenesdecompras` (`id`, `idCompra`, `idUsuario`, `idProducto`, `detalle`, `montoTotal`, `fechaCreacion`, `idFactura`) VALUES
(10, '490144', '702730904', '1', 'Compra Cancelada', 55000, '2023-07-06', 879506),
(9, '14468', '702730904', '1', 'Compra Realizada', 115000, '2023-07-06', 277072),
(11, '231186', '702730904', '1', 'Compra Realizada', 55000, '2023-07-06', 578937),
(12, '958484', '702730904', '1', 'Compra Realizada', 55000, '2023-07-07', 150655),
(13, '302872', '702730904', '1', 'Compra Realizada', 55000, '2023-07-07', 267689),
(14, '642555', '702730904', '2', 'Compra Realizada', 60000, '2023-07-07', 347209),
(15, '634085', '702730904', '1', 'Compra Realizada', 55000, '2023-07-07', 739299),
(16, '217617', '702730904', '1', 'Compra Realizada', 55000, '2023-07-07', 156092),
(17, '472150', '702730904', '1', 'Compra Realizada', 55000, '2023-07-07', 460459);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

DROP TABLE IF EXISTS `personas`;
CREATE TABLE IF NOT EXISTS `personas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idPersona` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido1` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido2` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `celular` varchar(9) COLLATE utf8mb3_spanish_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idRol` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idRol` (`idRol`),
  KEY `id` (`id`),
  KEY `idPersona` (`idPersona`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `idPersona`, `nombre`, `apellido1`, `apellido2`, `telefono`, `celular`, `direccion`, `correo`, `idRol`) VALUES
(1, '702730905', 'Denny', 'Gutrie', 'Arguedas', '2178-1853', '6178-1853', 'Limon', 'denny@gamil.com', '1'),
(3, '000000001', 'Miguel', 'Aragon', 'Duarte', '7894-4562', '6498-5265', 'Limon,CR', 'miguel@gmail.com', '1'),
(6, '702730904', 'Anthony', 'Gutrie', 'Arguedas', '1271-1291', '6177-8543', 'Limon,CR', 'anthony@gmail.com', '2'),
(7, '504190962', 'Micaela', 'Arat', 'Turning', '6172-2303', '8989-3992', 'Limon', 'michael@gmail.com', '1');

--
-- Disparadores `personas`
--
DROP TRIGGER IF EXISTS `editarPersona`;
DELIMITER $$
CREATE TRIGGER `editarPersona` AFTER UPDATE ON `personas` FOR EACH ROW BEGIN
	UPDATE usuario
    SET idUsuario= NEW.idPersona,
    idRol=NEW.idRol
	WHERE Usuario.idUsuario = OLD.idPersona;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `eliminarPersona`;
DELIMITER $$
CREATE TRIGGER `eliminarPersona` AFTER DELETE ON `personas` FOR EACH ROW BEGIN
    DELETE FROM usuario WHERE Usuario.idUsuario = OLD.idPersona;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idProducto` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombreProducto` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `color` varchar(250) COLLATE utf8mb3_spanish_ci NOT NULL,
  `precio` int NOT NULL,
  `talla` int NOT NULL,
  `stock` int NOT NULL,
  `genero` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProductos` (`idProducto`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `idProducto`, `nombreProducto`, `color`, `precio`, `talla`, `stock`, `genero`) VALUES
(1, '1', 'NIKE QUEST 5', 'Negro', 55000, 41, 48, 'Hombre'),
(2, '2', 'NIKE REVOLUTION 6 NN', 'Azul Oscuro', 60000, 42, 34, 'Hombre'),
(3, '3', 'NIKE AIR ZOOM VOMERO 16', 'Azul Oscuro', 142000, 42, 35, 'Hombre'),
(4, '4', 'NIKE DOWNSHIFTER 12', 'Negro', 59000, 38, 50, 'Hombre'),
(5, '5', 'RUN SWIFT 3', 'Negro', 72000, 39, 35, 'Hombre'),
(6, '6', 'NIKE AIR ZOOM PEGASUS 39', 'Negro', 122000, 42, 65, 'Hombre'),
(7, '7', 'NIKE ZOOMX INVINCIBLE RUN FK 3', 'Negro', 143000, 40, 80, 'Hombre'),
(8, '8', 'NIKE SB ZOOM BLAZER LOW PRO GT', 'Negro', 38000, 39, 75, 'Hombre'),
(9, '9', 'NIKE IN-SEASON TR 13', 'Gris', 68000, 42, 85, 'Hombre'),
(10, '10', 'NIKE COURT VISION MID', 'Blanco', 55000, 42, 90, 'Hombre'),
(11, '11', 'PWRFRAME TR 2 WNS', 'Blanco', 65000, 36, 25, 'Mujer'),
(12, '12', 'ADIZERO SL W', 'Salmon', 980000, 34, 65, 'Mujer'),
(13, '13', 'RESPONSE SUPER 3.0', 'Negro', 95000, 33, 20, 'Mujer'),
(14, '14', 'CHUCK TAYLOR ALL STAR LIFT', 'Negro', 60000, 35, 100, 'Mujer'),
(15, '15', 'NIKE ZOOM COURT PRO HC', 'Blanco', 100000, 37, 10, 'Mujer'),
(16, '16', 'JUMPMAN TWO TREY', 'Blanco', 130000, 42, 200, 'Hombre'),
(17, '17', 'PRESCHOOL REVOLUTION 6 FLYEASE NN PSV', 'Negro', 22000, 34, 90, 'Niño'),
(18, '18', 'NIKE AIR MAX ALPHA TRAINER 5', 'Negro', 80000, 42, 60, 'Hombre'),
(19, '19', 'NIKE MC TRAINER 2', 'Azul', 43000, 40, 200, 'Hombre'),
(20, '20', 'NIKE METCON 8', 'Blanco', 115000, 42, 100, 'Hombre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idRol` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombreRol` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idRol` (`idRol`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `idRol`, `nombreRol`) VALUES
(1, '1\r\n', 'Administrador'),
(2, '2', 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idRol` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `passw` varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,
  `ultimoAcceso` date DEFAULT NULL,
  `tkR` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idPersona` (`idUsuario`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `idUsuario`, `idRol`, `passw`, `ultimoAcceso`, `tkR`) VALUES
(1, '702730905', '1', '$2y$10$oXdbHLw8Vuvx0g5DWy48B.GciTx538zFw8C6QI3QNcJA.6wT2461y', '2023-07-07', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwcm95ZWN0byIsImlhdCI6MTY4ODc1NDcyMiwiaWRSb2wiOjF9.NYflI_SVaYxzeMnirQRDNmbLqmqh7kY0f8u9Vp6b7wA'),
(6, '702730904', '2', '$2y$10$lkDQ.hAS1nMrz8KWCBQNueSLkfHrfq8fAZrLjRDCKg04Ozryc66vu', '2023-07-07', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwcm95ZWN0byIsImlhdCI6MTY4ODc1NjYxOSwiaWRSb2wiOjJ9.Fzy3nbjYok_3Gwo5jgS6J593bBdnIBqmiRBnRMFT6L0'),
(7, '504190962', '1', '$2y$10$I8eYt5T3joWPoQGSnso1luiHmyNtQUlaLHfJl5kY6SNhKrCvytHJK', '2024-03-24', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwcm95ZWN0byIsImlhdCI6MTcxMTMxMTk1NiwiaWRSb2wiOjF9.YkGu5kBaqrhbb_nb9SdsfB7_GrwRlDxDNbAiY8y1AyI');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
