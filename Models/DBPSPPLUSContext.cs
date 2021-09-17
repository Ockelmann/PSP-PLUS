using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace PSP_.Models
{
    public partial class DBPSPPLUSContext : DbContext
    {
        public DBPSPPLUSContext()
        {
        }

        public DBPSPPLUSContext(DbContextOptions<DBPSPPLUSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<EquipoDesarrollo> EquipoDesarrollos { get; set; }
        public virtual DbSet<ErroresPsp> ErroresPsps { get; set; }
        public virtual DbSet<Parametro> Parametros { get; set; }
        public virtual DbSet<Proyecto> Proyectos { get; set; }
        public virtual DbSet<Recordatorio> Recordatorios { get; set; }
        public virtual DbSet<TiemposPsp> TiemposPsps { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<UsuarioProyecto> UsuarioProyectos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=DESKTOP-FGBRIH1;DATABASE=DBPSPPLUS;user=capacitacion;password=12345");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Modern_Spanish_CI_AS");

            modelBuilder.Entity<EquipoDesarrollo>(entity =>
            {
                entity.HasKey(e => e.IdEquipoDesarrollo)
                    .HasName("PK__EquipoDe__C3028438B612E927");

                entity.ToTable("EquipoDesarrollo");

                entity.Property(e => e.IdEquipoDesarrollo).HasColumnName("idEquipoDesarrollo");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombre");
            });

            modelBuilder.Entity<ErroresPsp>(entity =>
            {
                entity.HasKey(e => e.IdErrorPsp)
                    .HasName("PK__ErroresP__9CDF13FADBB031B4");

                entity.ToTable("ErroresPSP");

                entity.Property(e => e.IdErrorPsp).HasColumnName("idErrorPSP");

                entity.Property(e => e.Correlativo).HasColumnName("correlativo");

                entity.Property(e => e.Cronometro).HasColumnName("cronometro");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.Eliminado)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("eliminado");

                entity.Property(e => e.Fecha)
                    .HasColumnType("date")
                    .HasColumnName("fecha");

                entity.Property(e => e.FechaHoraFinal)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaHoraFinal");

                entity.Property(e => e.FechaHoraInicio)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaHoraInicio");

                entity.Property(e => e.FechaRealGrabacion).HasColumnType("datetime");

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.Introducido)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("introducido");

                entity.Property(e => e.LenguajeDesarrollo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("lenguajeDesarrollo");

                entity.Property(e => e.Solucion)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("solucion");

                entity.Property(e => e.TiempoCorrecion)
                    .HasColumnType("decimal(8, 2)")
                    .HasColumnName("tiempoCorrecion");

                entity.Property(e => e.TipoError)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("tipoError");

                entity.HasOne(d => d.IdProyectoNavigation)
                    .WithMany(p => p.ErroresPsps)
                    .HasForeignKey(d => d.IdProyecto)
                    .HasConstraintName("FK_ErroresPSP_PROYECTO");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.ErroresPsps)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ErroresPSP_USUARIO");
            });

            modelBuilder.Entity<Parametro>(entity =>
            {
                entity.HasKey(e => e.IdParametro)
                    .HasName("PK__Parametr__9C816E5FD1A2843F");

                entity.Property(e => e.IdParametro).HasColumnName("idParametro");

                entity.Property(e => e.Clave)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("clave");

                entity.Property(e => e.Correo)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.Inactividad).HasColumnName("inactividad");
            });

            modelBuilder.Entity<Proyecto>(entity =>
            {
                entity.HasKey(e => e.IdProyecto)
                    .HasName("PK__Proyecto__D0AF4CB453ABCE88");

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.Property(e => e.Cliente)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("cliente");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.Dev)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("dev");

                entity.Property(e => e.FechaFinalEsperada)
                    .HasColumnType("date")
                    .HasColumnName("fechaFinalEsperada");

                entity.Property(e => e.FechaFinalReal)
                    .HasColumnType("date")
                    .HasColumnName("fechaFinalReal");

                entity.Property(e => e.FechaInicioEsperada)
                    .HasColumnType("date")
                    .HasColumnName("fechaInicioEsperada");

                entity.Property(e => e.FechaInicioReal)
                    .HasColumnType("date")
                    .HasColumnName("fechaInicioReal");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.TotalHorasTrabajadas)
                    .HasColumnType("decimal(8, 2)")
                    .HasColumnName("totalHorasTrabajadas")
                    .HasDefaultValueSql("((0.0))");
            });

            modelBuilder.Entity<Recordatorio>(entity =>
            {
                entity.HasKey(e => e.IdRecordatorios)
                    .HasName("PK__Recordat__3EC6A1217D91126C");

                entity.Property(e => e.IdRecordatorios).HasColumnName("idRecordatorios");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.Estado)
                    .IsUnicode(false)
                    .HasColumnName("estado")
                    .HasDefaultValueSql("('No Leído')");

                entity.Property(e => e.FechaHoraRecordatorio)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaHoraRecordatorio");

                entity.Property(e => e.HorasAlerta)
                    .HasColumnType("decimal(8, 2)")
                    .HasColumnName("horasAlerta");

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.TipoRecordatorio).HasColumnName("tipoRecordatorio");

                entity.HasOne(d => d.IdProyectoNavigation)
                    .WithMany(p => p.Recordatorios)
                    .HasForeignKey(d => d.IdProyecto)
                    .HasConstraintName("FK_Recordatorios_PROYECTO");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Recordatorios)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Recordatorios_USUARIO");
            });

            modelBuilder.Entity<TiemposPsp>(entity =>
            {
                entity.HasKey(e => e.IdTiempoPsp)
                    .HasName("PK__TiemposP__08E1CCE536053972");

                entity.ToTable("TiemposPSP");

                entity.Property(e => e.IdTiempoPsp).HasColumnName("idTiempoPSP");

                entity.Property(e => e.Cronometro).HasColumnName("cronometro");

                entity.Property(e => e.Descripcion)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.FechaHoraFinal)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaHoraFinal");

                entity.Property(e => e.FechaHoraInicio)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaHoraInicio");

                entity.Property(e => e.FechaRealGrabacion).HasColumnType("datetime");

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.HasOne(d => d.IdProyectoNavigation)
                    .WithMany(p => p.TiemposPsps)
                    .HasForeignKey(d => d.IdProyecto)
                    .HasConstraintName("FK_TiemposPSP_PROYECTO");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.TiemposPsps)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TiemposPSP_USUARIO");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario)
                    .HasName("PK__Usuario__645723A60AAB8444");

                entity.ToTable("Usuario");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.Apellidos)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("apellidos");

                entity.Property(e => e.Clave)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("clave");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasColumnName("estado")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.FechaNacimiento)
                    .HasColumnType("date")
                    .HasColumnName("fechaNacimiento");

                entity.Property(e => e.IdEquipoDesarrollo).HasColumnName("idEquipoDesarrollo");

                entity.Property(e => e.Nombres)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("nombres");

                entity.Property(e => e.Rol)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("rol");

                entity.HasOne(d => d.IdEquipoDesarrolloNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.IdEquipoDesarrollo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USUARIO_EQUIPODESARROLLO");
            });

            modelBuilder.Entity<UsuarioProyecto>(entity =>
            {
                entity.HasKey(e => new { e.IdUsuario, e.IdProyecto })
                    .HasName("PK__UsuarioP__395DD76DE28D64C7");

                entity.ToTable("UsuarioProyecto");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.HasOne(d => d.IdProyectoNavigation)
                    .WithMany(p => p.UsuarioProyectos)
                    .HasForeignKey(d => d.IdProyecto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USUARIOPROYECTO_PROYECTO");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioProyectos)
                    .HasForeignKey(d => d.IdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_USUARIOPROYECTO_USUARIO");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
