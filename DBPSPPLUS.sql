--USE CRUD;
--DROP DATABASE DBPSPPLUS;

CREATE DATABASE DBPSPPLUS;
GO
USE DBPSPPLUS;
GO

CREATE TABLE Proyectos(
	idProyecto			int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	nombre				varchar(100) NOT NULL,
	descripcion			varchar(MAX) NOT NULL,
	cliente				varchar(200) NOT NULL, -- Solamente Nombre del cliente
	fechaInicioEsperada	date NOT NULL,
	fechaInicioReal		date, -- Se completara con Trigger
	fechaFinalEsperada	date NOT NULL,
	fechaFinalReal		date, -- Se completara con Trigger
	dev					varchar(50) NOT NULL,
	totalHorasTrabajadas decimal(8,2) DEFAULT(0.0), -- Manejarlo en Horas | Se completara con Trigger
);
GO


CREATE TABLE EquipoDesarrollo(
	idEquipoDesarrollo	int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	nombre				varchar(100) NOT NULL,
	descripcion			varchar(100) NOT NULL,
);
GO
Insert into EquipoDesarrollo (nombre, descripcion) Values ('Desarrollo Móvil', 'Desarrollo Móvil');
Insert into EquipoDesarrollo (nombre, descripcion) Values ('Desarrollo Web', 'Desarrollo Web');
Insert into EquipoDesarrollo (nombre, descripcion) Values ('Desarrollo Escritorio', 'Desarrollo Escritorio');
GO
CREATE TABLE Usuario(
	idUsuario			int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	nombres				varchar(100) NOT NULL,
	apellidos			varchar(100) NOT NULL,
	email				varchar(100) NOT NULL,
	clave				varchar(100) NOT NULL,
	fechaNacimiento		date NOT NULL,
	rol					varchar(50) NOT NULL,
	idEquipoDesarrollo	int NOT NULL,
	estado              bit  DEFAULT (1) NOT NULL,
	RecuperaContraseña bit DEFAULT (0) NOT NULL,
	CONSTRAINT FK_USUARIO_EQUIPODESARROLLO FOREIGN KEY(idEquipoDesarrollo) 
		REFERENCES EquipoDesarrollo(idEquipoDesarrollo)
);
GO
INSERT INTO Usuario (nombres, apellidos, email, clave, fechaNacimiento, idEquipoDesarrollo, rol)
	values('admin', 'admin', 'admin@admin.com', 'x+L90ZdAVcs=', '2001/09/14', 1, 'administrador');
INSERT INTO Usuario (nombres, apellidos, email, clave, fechaNacimiento, idEquipoDesarrollo, rol)
	values('dev', 'dev', 'dev@dev.com', 'x+L90ZdAVcs=', '2001/10/14', 1, 'desarrollador');
GO
CREATE TABLE UsuarioProyecto( -- Varios desarrolladores podrán tener varios proyectos
	idUsuario		int NOT NULL,
	idProyecto		int NOT NULL,
	PRIMARY KEY(idUsuario,idProyecto),
	CONSTRAINT FK_USUARIOPROYECTO_USUARIO FOREIGN KEY(idUsuario) 
		REFERENCES Usuario(idUsuario),
	CONSTRAINT FK_USUARIOPROYECTO_PROYECTO FOREIGN KEY(idProyecto) 
		REFERENCES Proyectos(idProyecto),
);
GO

CREATE TABLE TiemposPSP(
	idTiempoPSP			int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	cronometro           BIT DEFAULT 0 NOT NULL,
	FechaRealGrabacion  datetime NOT NULL,
	fechaHoraInicio		datetime NOT NULL,
	fechaHoraFinal		datetime NOT NULL,
	descripcion			varchar(MAX) NOT NULL,
	idProyecto			int,
	idUsuario			int NOT NULL,
	CONSTRAINT FK_TiemposPSP_PROYECTO FOREIGN KEY(idProyecto) 
		REFERENCES Proyectos(idProyecto),
	CONSTRAINT FK_TiemposPSP_USUARIO FOREIGN KEY(idUsuario) 
		REFERENCES Usuario(idUsuario)
);
GO
CREATE TABLE ErroresPSP(
	idErrorPSP			int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	cronometro           BIT DEFAULT 0 NOT NULL,
	FechaRealGrabacion  datetime NOT NULL,
	fecha				date NOT NULL,
	descripcion			varchar(MAX) NOT NULL,
	solucion			varchar(MAX) NOT NULL,
	correlativo			int NOT NULL,
	tipoError			varchar(100) NOT NULL,
	introducido			varchar(100) NOT NULL,
	eliminado			varchar(100) NOT NULL, -- Fases
	fechaHoraInicio		datetime NOT NULL,
	fechaHoraFinal		datetime NOT NULL,
	tiempoCorrecion		decimal(8,2) NOT NULL, -- Sera la resta entre fechaHoraFinal - fechaHoraInicio
	lenguajeDesarrollo	varchar(100) NOT NULL,
	idProyecto			int,
	idUsuario			int NOT NULL,
	CONSTRAINT FK_ErroresPSP_PROYECTO FOREIGN KEY(idProyecto) 
		REFERENCES Proyectos(idProyecto),
	CONSTRAINT FK_ErroresPSP_USUARIO FOREIGN KEY(idUsuario) 
		REFERENCES Usuario(idUsuario)
);
GO
CREATE TABLE Recordatorios(
	idRecordatorios		int  IDENTITY(1,1) NOT NULL PRIMARY KEY,
	descripcion			varchar(MAX) NOT NULL,	
	idUsuario			int NOT NULL,
	tipoRecordatorio	int NOT NULL, -- Puede ser:  1,2,3,4
	idProyecto			int, -- Obligatorio para Tipo 2 y 3
	estado				varchar(MAX) DEFAULT('No Leído'), -- Ó Leído

	-- Recordatorio Tipo 1
	fechaHoraRecordatorio	datetime,

	-- Recordatorio Tipo 2 | Tiempo total de horas ingresadas de un proyecto
	horasAlerta				decimal(8,2),

	-- Recordatorio Tipo 3 | Si no se han ingresado actividades de algún proyecto
	-- Llenara el campo "fechaHoraRecordatorio" y "idProyecto"

	-- Recordatorio Tipo 4 | Si ya se ha excedido un tiempo (fecha) máximo de un proyecto en algún día.
	-- Llenara el campo "idProyecto"
	
	CONSTRAINT FK_Recordatorios_PROYECTO FOREIGN KEY(idProyecto) 
		REFERENCES Proyectos(idProyecto),
	CONSTRAINT FK_Recordatorios_USUARIO FOREIGN KEY(idUsuario) 
		REFERENCES Usuario(idUsuario)
);
GO

CREATE TABLE Parametros(
	idParametro int IDENTITY(1,1) primary key not null,
	inactividad int,
	correo varchar(100),
	clave varchar(100)
);
GO

INSERT INTO Parametros(inactividad, correo, clave) VALUES (5, 'pspplusti@gmail.com', 'pspplusti1914');
GO
----- Erick Echeverria/Debora Chacach 12/08/2021
-- ############################################################################################
-- #######################   TRIGGERS | TiemposPSP   ##########################################
-- ############################################################################################


-- ###############
-- #   AGREGAR   #
-- ###############
create trigger TR_HoraInicioRealTiemposPSP_Insertar
on TiemposPSP after insert
as begin
--Declarar variables
	declare @id_proyecto int, @fechaMinima date, @fechaMaxima date, @horasTrabajadas decimal(8,2), @idTiempoPSP int, @fechaHoraInicioTrabajado datetime, @fechaHoraFinalTrabajado datetime,
	@fechaMinimaTiempos date, @fechaMinimaErrores date, @fechaMaximaTiempos date, @fechaMaximaErrores date

	select @id_proyecto = idProyecto from inserted;
	select @fechaHoraInicioTrabajado = fechaHoraInicio from inserted;
	select @fechaHoraFinalTrabajado = fechaHoraFinal from inserted;

	select @fechaMinimaTiempos = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMinimaErrores = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyecto));

	IF @fechaMinimaErrores < @fechaMinimaTiempos
		BEGIN
		select @fechaMinima = @fechaMinimaErrores;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaTiempos ;
		END

	select @fechaMaximaTiempos = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMaximaErrores = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyecto));

	IF @fechaMaximaErrores > @fechaMaximaTiempos
		BEGIN
		select @fechaMaxima = @fechaMaximaErrores;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaTiempos;
		END

	select @horasTrabajadas = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajado,@fechaHoraFinalTrabajado)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas + @horasTrabajadas)
		where idProyecto=@id_proyecto
end

-- ###############
-- #  ELIMINAR   #
-- ###############
GO
create trigger TR_HoraInicioRealTiemposPSP_Eliminar
on TiemposPSP after delete
as begin
--Declarar variables
	declare @id_proyecto int, @fechaMinima date, @fechaMaxima date, @horasTrabajadas decimal(8,2), @idTiempoPSP int, @fechaHoraInicioTrabajado datetime, @fechaHoraFinalTrabajado datetime,
	@fechaMinimaTiempos date, @fechaMinimaErrores date, @fechaMaximaTiempos date, @fechaMaximaErrores date

	select @id_proyecto = idProyecto from deleted;
	select @fechaHoraInicioTrabajado = fechaHoraInicio from deleted;
	select @fechaHoraFinalTrabajado = fechaHoraFinal from deleted;

	select @fechaMinimaTiempos = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMinimaErrores = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyecto));
	IF @fechaMinimaTiempos < @fechaMinimaErrores
		BEGIN
		select @fechaMinima = @fechaMinimaTiempos;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaErrores;
		END


	select @fechaMaximaTiempos = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMaximaErrores = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyecto));
	
	IF @fechaMaximaTiempos > @fechaMaximaErrores
		BEGIN
		select @fechaMaxima = @fechaMaximaTiempos;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaErrores;
		END

	select @horasTrabajadas = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajado,@fechaHoraFinalTrabajado)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas - @horasTrabajadas)
		where idProyecto=@id_proyecto
end

-- ###############
-- #  ACTUALIZAR   #
-- ###############
GO
create trigger TR_HoraInicioRealTiemposPSP_Actualizar
on TiemposPSP after update
as begin
--Declarar variables
	declare @id_proyectoEntrante int, @id_proyectoAnterior int, @fechaHoraInicioTrabajadoEntrante datetime, @fechaHoraFinalTrabajadoEntrante datetime, @fechaHoraInicioTrabajadoSaliente datetime, @fechaHoraFinalTrabajadoSaliente datetime,
		@fechaMinima date, @fechaMaxima date, @horas_borrar decimal(8,2), @horas_Ingresar decimal(8,2), @fechaMinimaSaliente date, @fechaMaximaSaliente date,
		@fechaMinimaTiemposEntrante date, @fechaMinimaErroresEntrante date, @fechaMaximaTiemposEntrante date, @fechaMaximaErroresEntrante date,
		@fechaMinimaTiemposAnterior date, @fechaMinimaErroresAnterior date, @fechaMaximaTiemposAnterior date, @fechaMaximaErroresAnterior date;
	
	select @id_proyectoEntrante = idProyecto from inserted;
	select @id_proyectoAnterior = idProyecto from deleted;


	select @fechaHoraInicioTrabajadoEntrante = fechaHoraInicio from inserted;
	select @fechaHoraFinalTrabajadoEntrante = fechaHoraFinal from inserted;

	select @fechaHoraInicioTrabajadoSaliente = fechaHoraInicio from deleted;
	select @fechaHoraFinalTrabajadoSaliente = fechaHoraFinal from deleted;

	select @fechaMinimaTiemposEntrante = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyectoEntrante));
	select @fechaMinimaErroresEntrante = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyectoEntrante));

	select @fechaMaximaTiemposEntrante = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyectoEntrante));
	select @fechaMaximaErroresEntrante = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyectoEntrante));

	IF @fechaMinimaErroresEntrante < @fechaMinimaTiemposEntrante
		BEGIN
		select @fechaMinima = @fechaMinimaErroresEntrante;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaTiemposEntrante;
		END

	IF @fechaMaximaErroresEntrante > @fechaMaximaTiemposEntrante
		BEGIN
		select @fechaMaxima = @fechaMaximaErroresEntrante;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaTiemposEntrante;
		END


	select @fechaMinimaTiemposAnterior = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyectoAnterior));
	select @fechaMinimaErroresAnterior = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyectoAnterior));

	select @fechaMaximaTiemposAnterior = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyectoAnterior));
	select @fechaMaximaErroresAnterior = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyectoAnterior));

	IF @fechaMinimaTiemposAnterior < @fechaMinimaErroresAnterior
		BEGIN
		select @fechaMinimaSaliente = @fechaMinimaTiemposAnterior;
		END
	ELSE
		BEGIN
		select @fechaMinimaSaliente = @fechaMinimaErroresAnterior;
		END

	IF @fechaMaximaTiemposAnterior > @fechaMaximaErroresAnterior
		BEGIN
		select @fechaMaximaSaliente = @fechaMaximaTiemposAnterior;
		END
	ELSE
		BEGIN
		select @fechaMaximaSaliente = @fechaMaximaErroresAnterior;
		END

	select @horas_Ingresar = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajadoEntrante,@fechaHoraFinalTrabajadoEntrante)/3600.00), 2,0);
	select @horas_borrar = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajadoSaliente,@fechaHoraFinalTrabajadoSaliente)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas + @horas_Ingresar)
		where idProyecto=@id_proyectoEntrante;

	update Proyectos set fechaInicioReal=(@fechaMinimaSaliente), fechaFinalReal=(@fechaMaximaSaliente), totalHorasTrabajadas=(totalHorasTrabajadas - @horas_borrar)
		where idProyecto=@id_proyectoAnterior;

end

-- #########################################################################################
-- #######################   TRIGGERS | ErroresPSP   ##########################################
-- ############################################################################################


-- ###############
-- #   AGREGAR   #
-- ###############

GO
create trigger TR_HoraInicioRealErroresPSP_Insertar
on ErroresPSP after insert
as begin
--Declarar variables
	declare @id_proyecto int, @fechaMinima date, @fechaMaxima date, @horasTrabajadas decimal(8,2), @idTiempoPSP int, @fechaHoraInicioTrabajado datetime, @fechaHoraFinalTrabajado datetime,
	@fechaMinimaTiempos date, @fechaMinimaErrores date, @fechaMaximaTiempos date, @fechaMaximaErrores date

	select @id_proyecto = idProyecto from inserted;
	select @fechaHoraInicioTrabajado = fechaHoraInicio from inserted;
	select @fechaHoraFinalTrabajado = fechaHoraFinal from inserted;

	select @fechaMinimaTiempos = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMinimaErrores = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyecto));

	IF @fechaMinimaTiempos < @fechaMinimaErrores
		BEGIN
		select @fechaMinima = @fechaMinimaTiempos;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaErrores ;
		END

	select @fechaMaximaTiempos = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMaximaErrores = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyecto));

	IF @fechaMaximaTiempos > @fechaMaximaErrores
		BEGIN
		select @fechaMaxima = @fechaMaximaTiempos;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaErrores;
		END

	select @horasTrabajadas = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajado,@fechaHoraFinalTrabajado)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas + @horasTrabajadas)
		where idProyecto=@id_proyecto
end

-- ###############
-- #  ELIMINAR   #
-- ###############

GO
create trigger TR_HoraInicioRealErroresPSP_Eliminar
on ErroresPSP after delete
as begin
--Declarar variables
	declare @id_proyecto int, @fechaMinima date, @fechaMaxima date, @horasTrabajadas decimal(8,2), @idTiempoPSP int, @fechaHoraInicioTrabajado datetime, @fechaHoraFinalTrabajado datetime,
	@fechaMinimaTiempos date, @fechaMinimaErrores date, @fechaMaximaTiempos date, @fechaMaximaErrores date

	select @id_proyecto = idProyecto from deleted;
	select @fechaHoraInicioTrabajado = fechaHoraInicio from deleted;
	select @fechaHoraFinalTrabajado = fechaHoraFinal from deleted;

	select @fechaMinimaTiempos = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMinimaErrores = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyecto));
	IF @fechaMinimaErrores < @fechaMinimaTiempos
		BEGIN
		select @fechaMinima = @fechaMinimaErrores ;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaTiempos ;
		END


	select @fechaMaximaTiempos = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyecto));
	select @fechaMaximaErrores = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyecto));
	
	IF @fechaMaximaErrores > @fechaMaximaTiempos
		BEGIN
		select @fechaMaxima = @fechaMaximaErrores;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaTiempos;
		END

	select @horasTrabajadas = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajado,@fechaHoraFinalTrabajado)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas - @horasTrabajadas)
		where idProyecto=@id_proyecto
end

-- ###############
-- #  ACTUALIZAR   #
-- ###############
GO
create trigger TR_HoraInicioErroresPSP_Actualizar
on ErroresPSP after update
as begin
--Declarar variables
	declare @id_proyectoEntrante int, @id_proyectoAnterior int, @fechaHoraInicioTrabajadoEntrante datetime, @fechaHoraFinalTrabajadoEntrante datetime, @fechaHoraInicioTrabajadoSaliente datetime, @fechaHoraFinalTrabajadoSaliente datetime,
		@fechaMinima date, @fechaMaxima date, @horas_borrar decimal(8,2), @horas_Ingresar decimal(8,2), @fechaMinimaSaliente date, @fechaMaximaSaliente date,
		@fechaMinimaTiemposEntrante date, @fechaMinimaErroresEntrante date, @fechaMaximaTiemposEntrante date, @fechaMaximaErroresEntrante date,
		@fechaMinimaTiemposAnterior date, @fechaMinimaErroresAnterior date, @fechaMaximaTiemposAnterior date, @fechaMaximaErroresAnterior date;
	
	select @id_proyectoEntrante = idProyecto from inserted;
	select @id_proyectoAnterior = idProyecto from deleted;


	select @fechaHoraInicioTrabajadoEntrante = fechaHoraInicio from inserted;
	select @fechaHoraFinalTrabajadoEntrante = fechaHoraFinal from inserted;

	select @fechaHoraInicioTrabajadoSaliente = fechaHoraInicio from deleted;
	select @fechaHoraFinalTrabajadoSaliente = fechaHoraFinal from deleted;

	select @fechaMinimaTiemposEntrante = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyectoEntrante));
	select @fechaMinimaErroresEntrante = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyectoEntrante));

	select @fechaMaximaTiemposEntrante = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyectoEntrante));
	select @fechaMaximaErroresEntrante = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyectoEntrante));

	IF @fechaMinimaTiemposEntrante < @fechaMinimaErroresEntrante
		BEGIN
		select @fechaMinima = @fechaMinimaTiemposEntrante;
		END
	ELSE
		BEGIN
		select @fechaMinima = @fechaMinimaErroresEntrante;
		END

	IF @fechaMaximaTiemposEntrante >  @fechaMaximaErroresEntrante
		BEGIN
		select @fechaMaxima = @fechaMaximaTiemposEntrante;
		END
	ELSE
		BEGIN
		select @fechaMaxima = @fechaMaximaErroresEntrante;
		END


	select @fechaMinimaTiemposAnterior = CONVERT(date,(select MIN(fechaHoraInicio) from TiemposPSP WHERE idProyecto = @id_proyectoAnterior));
	select @fechaMinimaErroresAnterior = CONVERT(date,(select MIN(fechaHoraInicio) from ErroresPSP WHERE idProyecto = @id_proyectoAnterior));

	select @fechaMaximaTiemposAnterior = CONVERT(date,(select MAX(fechaHoraFinal) from TiemposPSP WHERE idProyecto = @id_proyectoAnterior));
	select @fechaMaximaErroresAnterior = CONVERT(date,(select MAX(fechaHoraFinal) from ErroresPSP WHERE idProyecto = @id_proyectoAnterior));

	IF @fechaMinimaErroresAnterior <  @fechaMinimaTiemposAnterior
		BEGIN
		select @fechaMinimaSaliente = @fechaMinimaErroresAnterior;
		END
	ELSE
		BEGIN
		select @fechaMinimaSaliente = @fechaMinimaTiemposAnterior;
		END

	IF @fechaMaximaErroresAnterior > @fechaMaximaTiemposAnterior
		BEGIN
		select @fechaMaximaSaliente = @fechaMaximaErroresAnterior;
		END
	ELSE
		BEGIN
		select @fechaMaximaSaliente = @fechaMaximaTiemposAnterior;
		END

	select @horas_Ingresar = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajadoEntrante,@fechaHoraFinalTrabajadoEntrante)/3600.00), 2,0);
	select @horas_borrar = ROUND((DATEDIFF(SECOND,@fechaHoraInicioTrabajadoSaliente,@fechaHoraFinalTrabajadoSaliente)/3600.00), 2,0);

	update Proyectos set fechaInicioReal=(@fechaMinima), fechaFinalReal=(@fechaMaxima), totalHorasTrabajadas=(totalHorasTrabajadas + @horas_Ingresar)
		where idProyecto=@id_proyectoEntrante;

	update Proyectos set fechaInicioReal=(@fechaMinimaSaliente), fechaFinalReal=(@fechaMaximaSaliente), totalHorasTrabajadas=(totalHorasTrabajadas - @horas_borrar)
		where idProyecto=@id_proyectoAnterior;

end

/*Albin Cordero PROC*/

GO
/****** Object:  StoredProcedure [dbo].[Analisis]    Script Date: 11/08/2021 14:56:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[Analisis]  @id int, @inn datetime,  @fn datetime
as
select case when (select s.nombre from Proyectos s where s.idProyecto=ps.idProyecto) is null then 'no asignado' else  (select s.nombre from Proyectos s where s.idProyecto=ps.idProyecto) end as Proyecto ,min(ps.fechaHoraInicio) as Fecha_Inicio, MAX(ps.fechaHoraFinal) as Fecha_Final , sum(Cast((ps.fechaHoraFinal - ps.fechaHoraInicio) as Float) * 24.0 ) as tiempo , count(ps.descripcion)+(select COUNT(er.idProyecto) from ErroresPSP er where er.idProyecto=ps.idProyecto and er.idUsuario=@id) as "Total de Tareas"
, case when(select min(er.fechaHoraInicio) from ErroresPSP er where er.idProyecto = ps.idProyecto  and er.idUsuario=@id ) is null then  '' else (select min(er.fechaHoraInicio) from ErroresPSP er where er.idProyecto = ps.idProyecto and er.idUsuario=@id )  end as errormin ,case when(select max(er.fechaHoraFinal) from ErroresPSP er where er.idProyecto = ps.idProyecto and er.idUsuario=@id ) is null then  '' else (select max(er.fechaHoraFinal) from ErroresPSP er where er.idProyecto = ps.idProyecto  and er.idUsuario=@id)  end as errormax
, case when (select sum(er.tiempoCorrecion) from ErroresPSP er where er.idProyecto=ps.idProyecto and er.idUsuario=@id) is null then 0 else (select sum(er.tiempoCorrecion) from ErroresPSP er where er.idProyecto=ps.idProyecto and er.idUsuario=@id) end  as terror
from TiemposPSP ps  left join Proyectos pr on ps.idProyecto=pr.idProyecto
where ps.idUsuario=@id
and ps.fechaHoraInicio between @inn   and @fn
group by ps.idProyecto
GO

--Débora Chacach
--Proceso almacenado para reporte de Actividades por Proyecto admin
create  proc reporteActividades_por_proyecto @idProyecto int
as
Select distinct TpSp.descripcion, TpSp.fechaHoraInicio,TpSp.fechaHoraFinal,Cast((TpSp.fechaHoraFinal - TpSp.fechaHoraInicio) as Float) * 24.0 as horas,u.nombres,p.nombre from TiemposPSP tpsp 
inner join Usuario u on  tpsp.idUsuario=u.idUsuario
inner join Proyectos p on tpsp.idProyecto=p.idProyecto
where  tpsp.idProyecto=@idProyecto
group by TpSp.descripcion, TpSp.fechaHoraInicio,TpSp.fechaHoraFinal,u.nombres,p.nombre  
 

go

--Débora Chacach
--Proceso almacenado para reporte de Actividades por Proyecto desarrollador
create proc reporteActividades_por_proyecto_desarrollador @idProyecto int, @idUsuario int
as

Select distinct TpSp.descripcion, TpSp.fechaHoraInicio,TpSp.fechaHoraFinal,Cast((TpSp.fechaHoraFinal - TpSp.fechaHoraInicio) as Float) * 24.0 as horas,u.nombres,p.nombre from TiemposPSP tpsp 
inner join Usuario u on  tpsp.idUsuario=u.idUsuario
inner join Proyectos p on tpsp.idProyecto=p.idProyecto
where tpsp.idUsuario=@idUsuario and tpsp.idProyecto=@idProyecto
group by TpSp.descripcion, TpSp.fechaHoraInicio,TpSp.fechaHoraFinal,u.nombres,p.nombre  







select * from ErroresPSP;

select * from EquipoDesarrollo
select * from Recordatorios;
select * from ErroresPSP;
select * from Usuario;
select * from Proyectos;
select * from UsuarioProyecto;
select * from Parametros;