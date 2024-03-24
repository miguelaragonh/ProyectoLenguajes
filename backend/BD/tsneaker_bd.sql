-- BASE ACTUALIZADA SOLO FALTA EL TOKEN
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3309
-- Tiempo de generación: 27-05-2023 a las 20:25:12
-- Versión del servidor: 10.10.2-MariaDB
-- Versión de PHP: 8.0.26

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarOrden` (`_id` INT, `_idCompra` VARCHAR(15))   begin
    select * from ordenesdecompras where idCompra = _idCompra ;
end$$

DROP PROCEDURE IF EXISTS `buscarPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarPersona` (`_id` INT, `_idPersona` VARCHAR(15))   begin
    select * from personas where id = _id or idPersona=_idPersona;
end$$

DROP PROCEDURE IF EXISTS `buscarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarProducto` (`_id` INT, `_idProducto` VARCHAR(15))   begin
    select * from productos where idProducto = _id or idProducto=_idProducto;
end$$

DROP PROCEDURE IF EXISTS `buscarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarUsuario` (`_id` INT(11), `_idUsuario` VARCHAR(15))   begin
    select * from usuario where idUsuario = _idUsuario or id = _id;
end$$

DROP PROCEDURE IF EXISTS `filtrarOrden`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarOrden` (`_parametros` VARCHAR(250), `_pagina` SMALLINT UNSIGNED, `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idOrden') INTO @filtro;
    SELECT concat("SELECT * from ordenesdecompra where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `filtrarPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarPersona` (IN `_parametros` VARCHAR(250), IN `_pagina` SMALLINT UNSIGNED, IN `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idPersona') INTO @filtro;
    SELECT concat("SELECT * from persona where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `filtrarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarProducto` (`_parametros` VARCHAR(250), `_pagina` SMALLINT UNSIGNED, `_cantRegs` SMALLINT UNSIGNED)   begin
    SELECT cadenaFiltro(_parametros, 'idProducto') INTO @filtro;
    SELECT concat("SELECT * from producto where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsOrdenes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsOrdenes` (`_parametros` VARCHAR(255))   begin
    SELECT cadenaFiltro(_parametros, 'idCompra') INTO @filtro;
    SELECT concat("SELECT count(idCompra) from ordenesdecompras where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsPersona`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsPersona` (`_parametros` VARCHAR(250))   begin
    SELECT cadenaFiltro(_parametros, 'idPersona') INTO @filtro;
    SELECT concat("SELECT count(idPersona) from personas where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `numRegsProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsProducto` (`_parametros` VARCHAR(250))   begin
    SELECT cadenaFiltro(_parametros, 'idProducto') INTO @filtro;
    SELECT concat("SELECT count(id) from productos where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
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
CREATE DEFINER=`root`@`localhost` FUNCTION `editarOrden` (`_id` INT, `_idCompra` VARCHAR(255), `_idUsuario` VARCHAR(255), `_idProducto` VARCHAR(255), `_detalle` VARCHAR(255), `_montoTotal` INT(11)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant > 0 then
        update personas set
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
CREATE DEFINER=`root`@`localhost` FUNCTION `editarPersona` (`_id` INT, `_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100)) RETURNS INT(1)  begin
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
            correo = _correo
        where idPersona = _idPersona;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `editarProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editarProducto` (`_id` INT, `_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_precio` INT, `_talla` INT, `_stock` INT, `_genero` VARCHAR(75), `_descripcion` VARCHAR(150)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idPersona) into _cant from personas where idPersona = _idPersona;
    if _cant > 0 then
        update productos set
            idProducto = _idProducto,
            nombreProducto = _nombreProducto,
            precio = _precio,
            talla = _talla,
            stock = _stock,
            genero = _genero,
            descripcion = _descripcion
        where idProducto = _idProducto;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `eliminarOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarOrden` (`_idCompra` INT(1)) RETURNS INT(1)  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant > 0 then
        set _resp = 1;
        select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
        if _cant = 0 then
            delete from ordenesdecompras where idCompra = _idCompra;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `eliminarPersona`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarPersona` (`_idPersona` INT(1)) RETURNS INT(1)  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idPersona) into _cant from personas where idPersona = _idPersona;
    if _cant > 0 then
        set _resp = 1;
        select count(idPersona) into _cant from ordenesdecompras where idUsuario = _idPersona;
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
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarProducto` (`_idProducto` INT(11)) RETURNS INT(11)  begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idProducto) into _cant from personas where idProducto = _idProducto;
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
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarUsuario` (`_idUsuario` VARCHAR(255)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where id = _id;
    if _cant > 0 then
        delete from usuario where idUsuario = _idUsuario;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevaOrden`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevaOrden` (`_idCompra` VARCHAR(255), `_idUsuario` VARCHAR(255), `_idProducto` VARCHAR(255), `_detalle` VARCHAR(255), `_montoTotal` INT(11)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idCompra) into _cant from ordenesdecompras where idCompra = _idCompra;
    if _cant < 1 then
        insert into ordenesdecompras(idCompra, idUsuario, idProducto, detalle, montoTotal) 
            values (_idCompra, _idUsuario, _idProducto, _detalle, _montoTotal);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoAdmin`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoAdmin` (`_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100)) RETURNS INT(1)  begin 
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

DROP FUNCTION IF EXISTS `nuevoPersona`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoPersona` (`_idPersona` VARCHAR(15), `_nombre` VARCHAR(30), `_apellido1` VARCHAR(15), `_apellido2` VARCHAR(15), `_telefono` VARCHAR(9), `_celular` VARCHAR(9), `_direccion` VARCHAR(255), `_correo` VARCHAR(100)) RETURNS INT(1)  begin 
    declare _cant int;
    select count(_idPersona) into _cant from Personas where idPersona = _idPersona;
    if _cant < 1 then
        insert into personas(idPersona, nombre, apellido1, apellido2, telefono, 
            celular, direccion, correo) 
            values (_idPersona, _nombre, _apellido1, _apellido2, _telefono, 
            _celular, _direccion, _correo,2);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoProducto` (`_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_precio` INT, `_Talla` VARCHAR(15), `_stock` INT, `_color` VARCHAR(255), `_genero` VARCHAR(255), `_descripcion` VARCHAR(255)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idProducto) into _cant from productos where idProducto = _idProducto;
    if _cant < 1 then
        insert into productos(idProducto, nombreProducto, precio, talla, stock, 
            color, genero, descripcion) 
            values (_idProducto, _nombreProducto, _precio, _talla, _stock, 
            _color, _genero, _descripcion);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `nuevoUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoUsuario` (`_idUsuario` VARCHAR(15), `_rol` INT, `_passw` VARCHAR(255)) RETURNS INT(1)  begin
    declare _cant int;
    select count(id) into _cant from usuario where idUsuario = _idUsuario;
    if _cant < 1 then
        insert into usuario(idUsuario, rol, passw) 
            values (_idUsuario, _rol, _passw);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `passwUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `passwUsuario` (`_id` INT, `_passw` VARCHAR(255)) RETURNS INT(1)  begin
    declare _cant int;
    select count(id) into _cant from usuario where id = _id;
    if _cant > 0 then
        update usuario set
            passw = _passw
        where id = _id;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `rolUsuario`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `rolUsuario` (`_id` INT, `_rol` INT) RETURNS INT(1)  begin
    declare _cant int;
    select count(id) into _cant from usuario where id = _id;
    if _cant > 0 then
        update usuario set
            rol = _rol
        where id = _id;
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCompra` varchar(255) NOT NULL,
  `idUsuario` varchar(255) NOT NULL,
  `idProducto` varchar(255) NOT NULL,
  `detalle` varchar(255) NOT NULL,
  `montoTotal` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCompra` (`idCompra`),
  KEY `idusuario` (`idUsuario`),
  KEY `idProducto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

DROP TABLE IF EXISTS `personas`;
CREATE TABLE IF NOT EXISTS `personas` (
  `id` int(11) NOT NULL,
  `idPersona` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido1` varchar(255) NOT NULL,
  `apellido2` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `celular` varchar(9) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `idRol` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idRol` (`idRol`),
  KEY `id` (`id`),
  KEY `idPersona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Disparadores `personas`
--
DROP TRIGGER IF EXISTS `editarPersona`;
DELIMITER $$
CREATE TRIGGER `editarPersona` AFTER UPDATE ON `personas` FOR EACH ROW BEGIN
	UPDATE usuario
    SET idUsuario= NEW.idPersona
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idProducto` varchar(255) NOT NULL,
  `nombreProducto` varchar(255) NOT NULL,
  `color` varchar(250) NOT NULL,
  `precio` int(11) NOT NULL,
  `talla` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCategoria` (`categoria`),
  KEY `idProductos` (`idProducto`),
  KEY `nombreProducto` (`nombreProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idRol` varchar(255) NOT NULL,
  `nombreRol` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idRol` (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` varchar(255) NOT NULL,
  `idRol` varchar(255) NOT NULL,
  `passw` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idPersona` (`idUsuario`),
  KEY `idRol` (`idRol`),
  KEY `passw` (`passw`),
  KEY `idPersona_2` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ordenesdecompras`
--
ALTER TABLE `ordenesdecompras`
  ADD CONSTRAINT `ordenProductos` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ordenesUsuarios` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `personasRoles` FOREIGN KEY (`idRol`) REFERENCES `roles` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `UsuariosPersonas` FOREIGN KEY (`idUsuario`) REFERENCES `personas` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
