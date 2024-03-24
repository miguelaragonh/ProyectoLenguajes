DELIMITER $$

DROP PROCEDURE IF EXISTS `numRegsProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `numRegsProducto`(`_parametros` VARCHAR(250))
begin
    SELECT cadenaFiltro(_parametros, 'idProducto') INTO @filtro;
    SELECT concat("SELECT count(id) from productos where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `filtrarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `filtrarProducto`(IN `_parametros` VARCHAR(250), IN `_pagina` SMALLINT UNSIGNED, IN `_cantRegs` SMALLINT UNSIGNED)
begin
    SELECT cadenaFiltro(_parametros, 'idProducto') INTO @filtro;
    SELECT concat("SELECT * from productos Where", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS `buscarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buscarProducto`(IN `_idProducto` VARCHAR(15))
begin
    select * from productos where idProducto=_idProducto;
end$$

DROP FUNCTION IF EXISTS `editarProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editarProducto`(`_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_color` VARCHAR(255), `_precio` INT, `_talla` INT, `_stock` INT, `_genero` VARCHAR(75)) RETURNS int(1)
begin
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


DROP FUNCTION IF EXISTS `eliminarProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `eliminarProducto`(`_idProducto` INT(11)) RETURNS int(11)
begin
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

DROP FUNCTION IF EXISTS `nuevoProducto`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `nuevoProducto`(`_idProducto` VARCHAR(255), `_nombreProducto` VARCHAR(255), `_precio` INT, `_Talla` VARCHAR(15), `_stock` INT, `_color` VARCHAR(255), `_genero` VARCHAR(255)) RETURNS int(1)
begin
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

DELIMITER ;