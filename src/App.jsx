import { useState } from 'react'
import {
  FiGrid,
  FiUsers,
  FiPlusSquare,
  FiBarChart2,
  FiLogOut,
  FiTool,
  FiEye,
  FiUserCheck,
  FiClipboard,
  FiMapPin // Icono para Ubicaciones
  , FiEdit, FiTrash2, FiCpu, FiCode, FiShare2, FiPrinter,
  FiHardDrive, // Icono para Equipos
  
} from 'react-icons/fi';
import Modal from 'react-modal';
import './App.css'

// Configuración de react-modal para la accesibilidad
Modal.setAppElement('#root');


// --- DATOS DE EJEMPLO (MOCK DATA) ---
const mockUsers = [
  { id: 1, nombre: 'Admin General', area: 'Dirección General', puesto: 'Director', role: 'Administrador', estado: 'Activo', email: 'admin@dominio.com', telefono: '1001' },
  { id: 2, nombre: 'Ana Torres', area: 'Educación', puesto: 'Soporte TI', role: 'Técnico', estado: 'Activo', email: 'atorres@dominio.com', telefono: '2001' },
  { id: 3, nombre: 'Carlos Ruiz', area: 'Cultura', puesto: 'Soporte TI', role: 'Técnico', estado: 'Inactivo', email: 'cruiz@dominio.com', telefono: '2002' },
  { id: 4, nombre: 'Luis Paez', area: 'Deporte', puesto: 'Coordinador', role: 'Usuario', estado: 'Activo', email: 'lpaez@dominio.com', telefono: '3001' },
];

const mockTasks = [
  { id: 'TICKET-001', fechaRegistro: '2025-11-28', departamento: 'Contabilidad', ubicacion: 'Oficina 302', tipoEquipo: 'Impresora', descripcion: 'No imprime, luz parpadea.', prioridad: 'Alta', asignadoA: 2, estado: 'Asignada', area: 'Periféricos' },
  { id: 'TICKET-002', fechaRegistro: '2025-11-29', departamento: 'Diseño', ubicacion: 'Oficina 101', tipoEquipo: 'PC', descripcion: 'Photoshop se cierra inesperadamente.', prioridad: 'Media', asignadoA: 3, estado: 'En Proceso', area: 'Software' },
  { id: 'TICKET-003', fechaRegistro: '2025-11-30', departamento: 'Desarrollo', ubicacion: 'Oficina 205', tipoEquipo: 'Router', descripcion: 'Sin acceso a internet en el ala oeste.', prioridad: 'Alta', asignadoA: 2, estado: 'Asignada', area: 'Redes' },
  { id: 'TICKET-004', fechaRegistro: '2025-12-01', departamento: 'Gerencia', ubicacion: 'Sala de Juntas', tipoEquipo: 'Monitor', descripcion: 'El monitor no da señal de video.', prioridad: 'Baja', asignadoA: null, estado: 'Pendiente de Asignar', area: 'Hardware' },
];

const mockUbicaciones = [
  { id: 1, nombre: 'Oficina 302', piso: 3, edificio: 'A', tipo: 'Oficina Administrativa', responsable: 'Luis Paez' },
  { id: 2, nombre: 'Oficina 101', piso: 1, edificio: 'A', tipo: 'Oficina Administrativa', responsable: 'Jefe de Diseño' },
  { id: 3, nombre: 'Site Principal', piso: 2, edificio: 'B', tipo: 'Sala de Servidores', responsable: 'Admin General' },
  { id: 4, nombre: 'Sala de Juntas A', piso: 1, edificio: 'C', tipo: 'Área Común', responsable: 'Gerencia' },
];

const mockEquipos = [
  { id: 'EQ-001', tipo: 'PC', marca: 'Dell', modelo: 'Optiplex 7080', numSerie: 'SN-12345', so: 'Windows 11 Pro', usuarioActualId: 2, ultimoMantenimiento: '2025-10-15', ubicacionId: 2 },
  { id: 'EQ-002', tipo: 'Laptop', marca: 'HP', modelo: 'EliteBook 840', numSerie: 'SN-67890', so: 'Windows 10 Pro', usuarioActualId: 4, ultimoMantenimiento: '2025-11-20', ubicacionId: 1 },
  { id: 'EQ-003', tipo: 'PC', marca: 'Lenovo', modelo: 'ThinkCentre M70q', numSerie: 'SN-54321', so: 'Ubuntu 22.04', usuarioActualId: 3, ultimoMantenimiento: '2025-09-01', ubicacionId: 2 },
];

const mockNovedades = []; // Se eliminan los ejemplos para empezar desde cero.

// --- COMPONENTES SIMULADOS DE MÓDULOS ---
// En un proyecto más grande, cada uno estaría en su propio archivo.

function LoginScreen({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Sistema de Soporte</h1>
        <p className="app-subtitle">Gestión de Tareas y Mantenimiento</p>
        <h2>Selecciona tu Perfil</h2>
        {mockUsers.map(user => (
          <button key={user.id} onClick={() => onLogin(user)}>
            <FiUserCheck /> {user.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Componentes de UI Reutilizables ---

function PriorityTag({ priority }) {
  // Si la prioridad no está definida, no renderizamos nada. Esto evita el crash.
  if (!priority) {
    return null;
  }
  const priorityClass = `priority-${priority.toLowerCase()}`;
  return <span className={`priority-tag ${priorityClass}`}>{priority}</span>;
}

function AdminDashboard({ users, tasks }) {
  const tecnicos = users.filter(u => u.role === 'Técnico');
  const tareasPendientes = tasks.filter(t => t.estado === 'Pendiente de Asignar').length;
  const tecnicosDisponibles = tecnicos.filter(u => u.estado === 'Activo').length;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiGrid /> Dashboard de Administrador</h2>
      </div>
      <div className="card">
        <div className="kpi-card-container">
          <div className="kpi-card">
            <div className="value">{tasks.length}</div>
            <div className="label">Tareas Totales</div>
          </div>
          <div className="kpi-card">
            <div className="value">{tareasPendientes}</div>
            <div className="label">Tareas Pendientes de Asignar</div>
          </div>
          <div className="kpi-card">
            <div className="value">{tecnicosDisponibles} / {tecnicos.length}</div>
            <div className="label">Técnicos Disponibles</div>
          </div>
        </div>
        {/* Añadimos el div .table-container que faltaba */}
        <div className="table-container"> 
          <table>
            <thead><tr><th>Técnico</th><th>Estado</th><th>Tareas Asignadas</th></tr></thead>
            <tbody>
              {users.filter(u => u.role === 'Técnico').map(user => (
                <tr key={user.id}><td>{user.nombre}</td><td>{user.estado}</td><td>{tasks.filter(t => t.asignadoA === user.id).length}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TecnicoDashboard({ user, tasks, onUpdateTask, onSaveNovedad }) {
  const misTareas = tasks.filter(task => parseInt(task.asignadoA) === user.id);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [informeData, setInformeData] = useState({});

  const handleToggleExpand = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null); // Si ya está expandido, lo colapsamos
    } else {
      setExpandedTaskId(taskId); // Si no, lo expandimos
      // Inicializamos el formulario para esta tarea
      const task = misTareas.find(t => t.id === taskId);
      setInformeData({
        diagnosticoTecnico: task.diagnosticoTecnico || '',
        accionesRealizadas: task.accionesRealizadas || '',
        problemaReportado: '' // Campo para reportar un problema
      });
    }
  };

  const handleInformeChange = (e) => {
    const { name, value } = e.target;
    setInformeData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalizar = (taskId) => {
    const updateData = { ...informeData, estado: 'Finalizado' };
    onUpdateTask(taskId, updateData);
    setExpandedTaskId(null); // Colapsamos la tarjeta
  };

  const handleReportarProblema = (taskId) => {
    if (!informeData.problemaReportado.trim()) {
      alert('Por favor, describe el problema antes de enviarlo.');
      return;
    }
    const mensaje = `Problema en Tarea ${taskId}: ${informeData.problemaReportado}`;
    onSaveNovedad(mensaje, user);
    alert('Problema reportado al administrador.');
    setInformeData(prev => ({ ...prev, problemaReportado: '' })); // Limpiamos el campo
  };

  return (
    <div className="module-container">
      <h2><FiTool /> Mis Tareas Asignadas</h2>
      {misTareas.length > 0 ? (
        <div className="task-grid">
          {misTareas.map(task => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <div key={task.id} className="task-card">
                <div className="task-card-header"><span className="task-id">{task.id}</span><PriorityTag priority={task.prioridad} /></div>
                <div className="task-card-body">
                  <p>{task.descripcion}</p>
                  <p><strong>Área:</strong> {task.area}</p>
                  <p><strong>Ubicación:</strong> {task.ubicacion}</p>
                  <p><strong>Estado:</strong> <span className={`status-${task.estado.replace(/ /g, '-').toLowerCase()}`}>{task.estado}</span></p>
                </div>
                {isExpanded && (
                  <div className="task-card-details">
                    <div className="form-group"><label>Diagnóstico Técnico</label><textarea name="diagnosticoTecnico" value={informeData.diagnosticoTecnico} onChange={handleInformeChange}></textarea></div>
                    <div className="form-group"><label>Acciones Realizadas</label><textarea name="accionesRealizadas" value={informeData.accionesRealizadas} onChange={handleInformeChange}></textarea></div>
                    <div className="form-group"><label>Reportar un Problema (Opcional)</label><textarea name="problemaReportado" placeholder="Describe aquí si hubo un problema que impidió finalizar la tarea..." value={informeData.problemaReportado} onChange={handleInformeChange}></textarea></div>
                    <div className="task-card-actions">
                      <button className="btn" onClick={() => handleReportarProblema(task.id)}>Reportar Problema</button>
                      <button className="btn btn-primary" onClick={() => handleFinalizar(task.id)}>Finalizar Tarea</button>
                    </div>
                  </div>
                )}
                <button onClick={() => handleToggleExpand(task.id)} style={{ marginTop: 'auto', backgroundColor: 'var(--color-primary)', color: 'white' }}><FiEye /> {isExpanded ? 'Cerrar Informe' : 'Ver / Completar Informe'}</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card"><p>No tienes tareas asignadas. ¡Buen trabajo!</p></div>
      )}
    </div>
  );
}

function AreaServicioView({ area, tasks, users }) {
  const tareasDelArea = tasks.filter(task => task.area === area);

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Tareas de {area}</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID Tarea</th><th>Fecha</th><th>Descripción</th><th>Técnico Asignado</th><th>Estatus</th><th>Prioridad</th></tr>
          </thead>
          <tbody>
            {tareasDelArea.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td><td>{task.fechaRegistro}</td><td>{task.descripcion}</td><td>{users.find(u => u.id === task.asignadoA)?.nombre || 'No asignado'}</td><td><span className={`status-${task.estado.replace(/ /g, '-').toLowerCase()}`}>{task.estado}</span></td><td><PriorityTag priority={task.prioridad} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {tareasDelArea.length === 0 && <div className="card"><p>No hay tareas registradas para el área de {area}.</p></div>}
      </div>
    </div>
  );
}

function GestionUsuarios({ users, onSaveUser, onDeleteUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Para edición
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const initialFormState = { nombre: '', area: 'Educación', puesto: '', role: 'Usuario', estado: 'Activo' };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData(user);
    } else {
      setCurrentUser(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUser(formData);
    handleCloseModal();
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(userToDelete.id);
    handleCloseDeleteModal();
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiUsers /> Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlusSquare /> Agregar Usuario
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>{currentUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
                <button type="button" className="close-button" onClick={handleCloseModal}>&times;</button>
              </div>
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="area">Área</label>
                <select id="area" name="area" value={formData.area} onChange={handleInputChange} className="form-select">
                  <option>Educación</option><option>Cultura</option><option>Deporte</option><option>Dirección General</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="puesto">Puesto</label>
                <input type="text" id="puesto" name="puesto" value={formData.puesto} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rol</label>
                <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="form-select">
                  <option>Usuario</option><option>Técnico</option><option>Administrador</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={handleCloseModal} style={{ background: 'var(--color-border)' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button type="button" className="close-button" onClick={handleCloseDeleteModal}>&times;</button>
        </div>
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>? Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn" onClick={handleCloseDeleteModal}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
        </div>
      </Modal>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Área</th><th>Puesto</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}><td>{user.nombre}</td><td>{user.area}</td><td>{user.puesto}</td><td>{user.role}</td><td>{user.estado}</td>
                <td className="action-buttons">
                  <button className="btn-icon btn-edit" onClick={() => handleOpenModal(user)}><FiEdit /></button>
                  <button className="btn-icon btn-delete" onClick={() => handleOpenDeleteModal(user)}><FiTrash2 /></button>
                </td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*  */function CrearTarea({ users, equipos, onSaveTask }) {
  const initialFormState = {
    tipoMantenimiento: 'Correctivo', equipoId: '', usuarioAsignadoId: '', // Cambiamos a usuarioAsignadoId
    fechaRegistro: new Date().toISOString().slice(0, 10),
    problemaReportado: '',
    asignadoA: '', estado: 'Pendiente de Asignar', recomendaciones: '', proximoMantenimiento: '', prioridad: 'Media', area: 'Hardware' // Añadimos el área de servicio
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'equipoId') {
      const equipoSeleccionado = equipos.find(eq => eq.id === value);
      const usuario = equipoSeleccionado ? users.find(u => u.id === equipoSeleccionado.usuarioActualId) : null;
      setFormData(prev => ({ ...prev, usuarioAsignadoId: usuario ? usuario.id : '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTask(formData);
    alert('Mantenimiento registrado con éxito!');
    setFormData(initialFormState); // Limpia el formulario
  };

  const tecnicos = users.filter(u => u.role === 'Técnico');

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiPlusSquare /> Registro de Mantenimiento</h2>
      </div>
      {/* Formulario reorganizado en una cuadrícula para un layout más compacto */}
      <form onSubmit={handleSubmit} className="form-grid">
        {/* Fila 1: Datos iniciales */}
        <div className="form-group"><label>Tipo</label><select name="tipoMantenimiento" value={formData.tipoMantenimiento} onChange={handleInputChange} className="form-select"><option>Preventivo</option><option>Correctivo</option></select></div>
        <div className="form-group"><label>Equipo</label><select name="equipoId" value={formData.equipoId} onChange={handleInputChange} className="form-select" required><option value="">Seleccione...</option>{equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.id} - {eq.marca}</option>)}</select></div>
        <div className="form-group">
          <label>Usuario del Equipo</label>
          <select name="usuarioAsignadoId" value={formData.usuarioAsignadoId} onChange={handleInputChange} className="form-select">
            <option value="">No asignado</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
          </select>
        </div>

        {/* Fila 2: Descripción del problema */}
        <div className="form-group span-3"><label>Problema Reportado / Descripción</label><textarea name="problemaReportado" value={formData.problemaReportado} onChange={handleInputChange} rows="3" required></textarea></div>

        {/* Fila 5: Asignación y estado */}
        <div className="form-group"><label>Área de Servicio</label><select name="area" value={formData.area} onChange={handleInputChange} className="form-select"><option>Hardware</option><option>Software</option><option>Redes</option><option>Periféricos</option><option>Otro</option></select></div>
        <div className="form-group"><label>Prioridad</label><select name="prioridad" value={formData.prioridad} onChange={handleInputChange} className="form-select"><option>Baja</option><option>Media</option><option>Alta</option></select></div>
        <div className="form-group"><label>Estatus</label><select name="estado" value={formData.estado} onChange={handleInputChange} className="form-select"><option>Pendiente de Asignar</option><option>Asignada</option><option>En Proceso</option><option>Finalizado</option></select></div>
        <div className="form-group"><label>Responsable Técnico</label><select name="asignadoA" value={formData.asignadoA} onChange={handleInputChange} className="form-select"><option value="">Asignar después...</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></div>

        {/* Fila 6: Campos finales y Acciones */}
        <div className="form-group span-2"><label>Próximo Mantenimiento</label><input type="date" name="proximoMantenimiento" value={formData.proximoMantenimiento} onChange={handleInputChange} className="form-select"/></div>
        <div className="form-actions span-3">
          <button type="submit" className="btn btn-primary">Registrar Mantenimiento</button>
          <button type="button" className="btn" style={{ background: 'var(--color-border)' }}>Agregar Evidencia</button>
        </div>
      </form>
    </div>
  );
}

function TecnicoReportes({ currentUser, onSaveNovedad, misNovedades }) {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }
    onSaveNovedad(mensaje, currentUser);
    setMensaje('');
    alert('Novedad enviada al administrador.');
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiClipboard /> Reportar Novedad al Administrador</h2>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Escribe tu reporte, novedad o incidencia:</label>
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows="5" required></textarea>
          </div>
          <div className="form-actions"><button type="submit" className="btn btn-primary">Enviar Novedad</button></div>
        </form>
      </div>
      {/* Aquí podrías agregar una lista de tus novedades enviadas si lo deseas */}
    </div>
  );
}

function Reportes({ tasks, users, novedades, onMarcarLeido }) {
  // Simplemente ordenamos las tareas por fecha para mostrar las más recientes primero.
  const sortedTasks = tasks
    .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)); // Ordenamos por fecha descendente

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiClipboard /> Bitácora y Novedades</h2>
      </div>

      {/* Sección de Novedades de Técnicos */}
      <div className="card">
        <h3>Novedades de Técnicos</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Fecha</th><th>Técnico</th><th>Mensaje</th><th>Acción</th></tr></thead>
            <tbody>
              {novedades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(novedad => (
                <tr key={novedad.id} className={!novedad.leido ? 'novedad-no-leida' : ''}>
                  <td>{novedad.fecha}</td><td>{novedad.tecnicoNombre}</td><td>{novedad.mensaje}</td>
                  <td>{!novedad.leido && <button className="btn" onClick={() => onMarcarLeido(novedad.id)}>Marcar como leído</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Bitácora de Tareas */}
      <div className="card">
        <h3>Bitácora de Tareas</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Fecha</th><th>ID Tarea</th><th>Área</th><th>Descripción</th><th>Técnico</th><th>Estatus</th></tr></thead>
            <tbody>
              {sortedTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.fechaRegistro}</td><td>{task.id}</td><td>{task.area}</td><td>{task.descripcion}</td><td>{users.find(u => u.id === task.asignadoA)?.nombre || 'No asignado'}</td><td><span className={`status-${task.estado.replace(/ /g, '-').toLowerCase()}`}>{task.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedTasks.length === 0 && <p>Aún no hay tareas registradas.</p>}
        </div>
      </div>
    </div>
  );
}

function GestionUbicaciones({ ubicaciones, onSaveUbicacion, onDeleteUbicacion, equipos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUbicacion, setCurrentUbicacion] = useState(null);
  const [ubicacionToDelete, setUbicacionToDelete] = useState(null);

  const initialFormState = { nombre: '', piso: '', edificio: '', tipo: 'Oficina Administrativa', responsable: '' };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (ubicacion = null) => {
    if (ubicacion) {
      setCurrentUbicacion(ubicacion);
      setFormData(ubicacion);
    } else {
      setCurrentUbicacion(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUbicacion(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveUbicacion(formData);
    handleCloseModal();
  };

  const handleOpenDeleteModal = (ubicacion) => {
    setUbicacionToDelete(ubicacion);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUbicacionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    onDeleteUbicacion(ubicacionToDelete.id);
    handleCloseDeleteModal();
  };

  return (
    <div className="module-container">
      {/* Cabecera del módulo con título y botón */}
      <div className="module-header">
        <h2>
          <FiMapPin />
          <span>Gestión de Ubicaciones</span>
        </h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlusSquare />
          <span>Agregar Ubicación</span>
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
            <div className="modal-header">
              <h3>{currentUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}</h3>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la Ubicación</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Ubicación</label>
                <select id="tipo" name="tipo" value={formData.tipo} onChange={handleInputChange} className="form-select">
                  <option>Oficina Administrativa</option>
                  <option>Sala de Servidores</option>
                  <option>Bodega</option>
                  <option>Taller</option>
                  <option>Área Común</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="responsable">Responsable del Área</label>
                <input type="text" id="responsable" name="responsable" value={formData.responsable} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="piso">Piso</label>
                <input type="number" id="piso" name="piso" value={formData.piso} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edificio">Edificio</label>
                <input type="text" id="edificio" name="edificio" value={formData.edificio} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn" onClick={handleCloseModal} style={{ background: 'var(--color-border)'}}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button type="button" className="close-button" onClick={handleCloseDeleteModal}>&times;</button>
        </div>
        <p>¿Estás seguro de que deseas eliminar la ubicación <strong>{ubicacionToDelete?.nombre}</strong>? Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn" onClick={handleCloseDeleteModal}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
        </div>
      </Modal>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Responsable</th><th>Piso/Edificio</th><th>Equipos en Sitio</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {ubicaciones.map(ubicacion => (
              <tr key={ubicacion.id}>
                <td>{ubicacion.nombre}</td>
                <td>{ubicacion.tipo}</td>
                <td>{ubicacion.responsable || 'No asignado'}</td>
                <td>Piso {ubicacion.piso}, Edif. {ubicacion.edificio}</td>
                <td>{equipos.filter(e => e.ubicacionId === ubicacion.id).length}</td>
                <td className="action-buttons">
                  <button className="btn-icon btn-edit" onClick={() => handleOpenModal(ubicacion)}><FiEdit /></button>
                  <button className="btn-icon btn-delete" onClick={() => handleOpenDeleteModal(ubicacion)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function GestionEquipos({ equipos, users, ubicaciones, onSaveEquipo, onDeleteEquipo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipoToDelete, setEquipoToDelete] = useState(null);
  const [currentEquipo, setCurrentEquipo] = useState(null);

  const initialFormState = { tipo: 'PC', marca: '', modelo: '', numSerie: '', so: '', usuarioActualId: '', ultimoMantenimiento: '', ubicacionId: '' };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (equipo = null) => {
    if (equipo) {
      setCurrentEquipo(equipo);
      setFormData(equipo);
    } else {
      setCurrentEquipo(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEquipo(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEquipo(formData);
    handleCloseModal();
  };

  const handleOpenDeleteModal = (equipo) => {
    setEquipoToDelete(equipo);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setEquipoToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    onDeleteEquipo(equipoToDelete.id);
    handleCloseDeleteModal();
  };

  const getUserById = (id) => {
    const user = users.find(u => u.id === id);
    return user || null;
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FiHardDrive /> Gestión de Equipos</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlusSquare /> Agregar Equipo
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>{currentEquipo ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</h3>
                <button type="button" className="close-button" onClick={handleCloseModal}>&times;</button>
              </div>
              {/* Aquí irían los campos del formulario */}
              <div className="form-group"><label>Tipo</label><select name="tipo" value={formData.tipo} onChange={handleInputChange} className="form-select"><option>PC</option><option>Laptop</option><option>Impresora</option><option>Otro</option></select></div>
              <div className="form-group"><label>Marca</label><input type="text" name="marca" value={formData.marca} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Modelo</label><input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Número de Serie</label><input type="text" name="numSerie" value={formData.numSerie} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Sistema Operativo</label><input type="text" name="so" value={formData.so} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Usuario Asignado</label><select name="usuarioActualId" value={formData.usuarioActualId} onChange={handleInputChange} className="form-select"><option value="">No asignado</option>{users.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></div>
              <div className="form-group"><label>Ubicación</label><select name="ubicacionId" value={formData.ubicacionId} onChange={handleInputChange} className="form-select"><option value="">Sin especificar</option>{ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></div>
              <div className="form-group"><label>Último Mantenimiento</label><input type="date" name="ultimoMantenimiento" value={formData.ultimoMantenimiento} onChange={handleInputChange} className="form-select"/></div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={handleCloseModal} style={{ background: 'var(--color-border)' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button type="button" className="close-button" onClick={handleCloseDeleteModal}>&times;</button>
        </div>
        <p>¿Estás seguro de que deseas eliminar el equipo <strong>{equipoToDelete?.marca} {equipoToDelete?.modelo}</strong> (ID: {equipoToDelete?.id})? Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn" onClick={handleCloseDeleteModal}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
        </div>
      </Modal>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Tipo</th><th>Marca/Modelo</th><th>Usuario Asignado</th><th>Contacto (Usuario)</th><th>Último Mant.</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {equipos.map(equipo => {
              const usuarioAsignado = getUserById(equipo.usuarioActualId);
              return (
                <tr key={equipo.id}>
                  <td>{equipo.id}</td>
                  <td>{equipo.tipo}</td>
                  <td>{equipo.marca} {equipo.modelo}</td>
                  <td>{usuarioAsignado ? usuarioAsignado.nombre : 'No asignado'}</td>
                  <td>{usuarioAsignado ? `${usuarioAsignado.email} / ${usuarioAsignado.telefono}` : 'N/A'}</td>
                  <td>{equipo.ultimoMantenimiento}</td>
                  <td className="action-buttons">
                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal(equipo)}><FiEdit /></button>
                    <button className="btn-icon btn-delete" onClick={() => handleOpenDeleteModal(equipo)}><FiTrash2 /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentViewTitle, setCurrentViewTitle] = useState('');
  const [vistaActual, setVistaActual] = useState(''); // Vista para el usuario logueado
  const [users, setUsers] = useState(mockUsers);
  const [ubicaciones, setUbicaciones] = useState(mockUbicaciones);
  const [tasks, setTasks] = useState(mockTasks);
  const [equipos, setEquipos] = useState(mockEquipos);
  const [novedades, setNovedades] = useState(mockNovedades);

  const handleSaveUser = (userData) => {
    setUsers(prevUsers => {
      if (userData.id) { // Si tiene ID, es una actualización
        return prevUsers.map(u => u.id === userData.id ? userData : u);
      } else { // Si no, es uno nuevo
        const newId = Math.max(...prevUsers.map(u => u.id)) + 1;
        return [...prevUsers, { ...userData, id: newId }];
      }
    });
  };
  const handleSaveUbicacion = (ubicacionData) => {
    setUbicaciones(prev => {
      if (ubicacionData.id) { // Actualización
        return prev.map(u => u.id === ubicacionData.id ? ubicacionData : u);
      } else { // Creación
        const newId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
        return [...prev, { ...ubicacionData, id: newId }];
      }
    });
  };
  
  const handleSaveEquipo = (equipoData) => {
    setEquipos(prevEquipos => {
      if (equipoData.id) { // Actualización
        return prevEquipos.map(e => e.id === equipoData.id ? equipoData : e);
      } else { // Creación
        const newId = `EQ-${String(prevEquipos.length + 1).padStart(3, '0')}`;
        return [...prevEquipos, { ...equipoData, id: newId }];
      }
    });
  };

  const handleSaveTask = (taskData) => {
    setTasks(prevTasks => {
      if (taskData.id) { // Para edición futura
        return prevTasks.map(t => t.id === taskData.id ? taskData : t);
      } else { // Creación
        const newId = `TICKET-${String(prevTasks.length + 1).padStart(3, '0')}`;
        return [...prevTasks, { ...taskData, id: newId }];
      }
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers =>
      prevUsers.filter(user => user.id !== userId)
    );
  };

  const handleDeleteUbicacion = (ubicacionId) => {
    setUbicaciones(prev => prev.filter(u => u.id !== ubicacionId));
  };

  const onDeleteEquipo = (equipoId) => { setEquipos(prev => prev.filter(e => e.id !== equipoId)); };

  const handleUpdateTask = (taskId, updateData) => {
    setTasks(prevTasks =>
      prevTasks.map(task => task.id === taskId ? { ...task, ...updateData } : task)
    );
  };

  const handleSaveNovedad = (mensaje, tecnico) => {
    const nuevaNovedad = {
      id: novedades.length > 0 ? Math.max(...novedades.map(n => n.id)) + 1 : 1,
      tecnicoId: tecnico.id,
      tecnicoNombre: tecnico.nombre,
      fecha: new Date().toISOString().slice(0, 10),
      mensaje: mensaje,
      leido: false,
    };
    setNovedades(prev => [...prev, nuevaNovedad]);
  };

  const handleMarcarComoLeido = (novedadId) => {
    setNovedades(prev => 
      prev.map(n => n.id === novedadId ? { ...n, leido: true } : n)
    );
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Vista por defecto según el rol
    setVistaActual(user.role === 'Administrador' ? 'AdminDashboard' : 'TecnicoDashboard');
    setCurrentViewTitle(user.role === 'Administrador' ? 'Dashboard' : 'Mis Tareas');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setVistaActual('');
  };

  const navigateTo = (view, title) => {
    setVistaActual(view);
    setCurrentViewTitle(title);
  };

  // Si no hay usuario, muestra la pantalla de login
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'AdminDashboard':
        return <AdminDashboard users={users} tasks={tasks} />;
      case 'TecnicoDashboard':
        return <TecnicoDashboard user={currentUser} tasks={tasks} onUpdateTask={handleUpdateTask} onSaveNovedad={handleSaveNovedad} />;
      case 'GestionUsuarios':
        return <GestionUsuarios users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} />;
      case 'CrearTarea':
        return <CrearTarea users={users} equipos={equipos} onSaveTask={handleSaveTask} />;
      case 'GestionEquipos':
        return <GestionEquipos equipos={equipos} users={users} ubicaciones={ubicaciones} onSaveEquipo={handleSaveEquipo} onDeleteEquipo={onDeleteEquipo} />;
      case 'GestionUbicaciones':
        return <GestionUbicaciones ubicaciones={ubicaciones} onSaveUbicacion={handleSaveUbicacion} onDeleteUbicacion={handleDeleteUbicacion} equipos={equipos} />;
      case 'Reportes':
        return <Reportes tasks={tasks} users={users} novedades={novedades} onMarcarLeido={handleMarcarComoLeido} />;
      // Nuevas vistas por área de servicio
      case 'HardwareView':
        return <AreaServicioView area="Hardware" tasks={tasks} users={users} />;
      case 'SoftwareView':
        return <AreaServicioView area="Software" tasks={tasks} users={users} />;
      case 'RedesView':
        return <AreaServicioView area="Redes" tasks={tasks} users={users} />;
      case 'PerifericosView':
        return <AreaServicioView area="Periféricos" tasks={tasks} users={users} />;
      case 'TecnicoReportes':
        return <TecnicoReportes currentUser={currentUser} onSaveNovedad={handleSaveNovedad} />;
      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="app-container">
      <nav className="main-nav">
        <h1>Soporte Técnico</h1>
        <div className="user-info">
          <p>Hola, <strong>{currentUser.nombre}</strong></p>
          <p><small>Rol: {currentUser.role}</small></p>
        </div>

        {/* Menú condicional basado en el rol */}
        {currentUser.role === 'Administrador' && (
          <>
            <button onClick={() => navigateTo('AdminDashboard', 'Dashboard')}><FiGrid /> Dashboard</button>
            <button onClick={() => navigateTo('GestionUsuarios', 'Gestión de Usuarios')}><FiUsers /> Gestión de Usuarios</button>
            <button onClick={() => navigateTo('CrearTarea', 'Nueva Tarea')}><FiPlusSquare /> Nueva Tarea</button>
            <button onClick={() => navigateTo('GestionEquipos', 'Gestión de Equipos')}><FiHardDrive /> Gestión de Equipos</button>
            <button onClick={() => navigateTo('GestionUbicaciones', 'Ubicaciones')}><FiMapPin /> Ubicaciones</button>
            <button onClick={() => navigateTo('Reportes', 'Reportes')}><FiBarChart2 /> Reportes</button>
            
            {/* Separador y nuevos módulos de servicio */}
            <div className="form-divider" style={{ margin: '15px 20px' }}><span style={{color: 'var(--color-text-secondary)', fontSize: '0.8rem'}}>ÁREAS DE SERVICIO</span><hr /></div>
            <button onClick={() => navigateTo('HardwareView', 'Tareas de Hardware')}><FiCpu /> Hardware</button>
            <button onClick={() => navigateTo('SoftwareView', 'Tareas de Software')}><FiCode /> Software</button>
            <button onClick={() => navigateTo('RedesView', 'Tareas de Redes')}><FiShare2 /> Redes</button>
            <button onClick={() => navigateTo('PerifericosView', 'Tareas de Periféricos')}><FiPrinter /> Periféricos</button>
          </>
        )}

        {currentUser.role === 'Técnico' && (
          <>
            <button onClick={() => navigateTo('TecnicoDashboard', 'Mis Tareas')}><FiTool /> Mis Tareas</button>
            <button onClick={() => navigateTo('TecnicoReportes', 'Reportar Novedad')}><FiClipboard /> Reportar Novedad</button>
          </>
        )}

        <button onClick={handleLogout} className="logout-button"><FiLogOut /> Cerrar Sesión</button>
      </nav>
      <main className="content">
        {renderizarVista()}
      </main>
    </div>
  );
}

export default App
