<?php
require_once 'conexion.php';

$mensaje = '';
$error = '';

// -------------------------------------------------------------
// OPERACIÓN: CREAR / ACTUALIZAR (CREATE & UPDATE)
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['guardar_articulo'])) {
    $id = $_POST['id'] ?? null;
    $codigo = trim($_POST['codigo_barras']);
    $nombre = trim($_POST['nombre']);
    $precio = floatval($_POST['precio']);
    $stock = intval($_POST['stock']);
    $almacen = trim($_POST['almacen']);

    if (!empty($codigo) && !empty($nombre) && $precio > 0) {
        if ($id) {
            // ACTUALIZAR (UPDATE)
            $stmt = $pdo->prepare("UPDATE articulos SET codigo_barras = ?, nombre = ?, precio = ?, stock = ?, almacen = ? WHERE id = ?");
            $stmt->execute([$codigo, $nombre, $precio, $stock, $almacen, $id]);
            $mensaje = "¡Artículo actualizado exitosamente!";
        } else {
            // CREAR (CREATE)
            try {
                $stmt = $pdo->prepare("INSERT INTO articulos (codigo_barras, nombre, precio, stock, almacen) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$codigo, $nombre, $precio, $stock, $almacen]);
                $mensaje = "¡Artículo registrado en FerreGest exitosamente!";
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    $error = "Error: El código de barras ya se encuentra registrado.";
                } else {
                    $error = "Error al guardar el registro: " . $e->getMessage();
                }
            }
        }
    } else {
        $error = "Por favor completa todos los campos requeridos correctamente.";
    }
}

// -------------------------------------------------------------
// OPERACIÓN: ELIMINAR (DELETE)
// -------------------------------------------------------------
if (isset($_GET['eliminar'])) {
    $id = intval($_GET['eliminar']);
    $stmt = $pdo->prepare("DELETE FROM articulos WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: index.php?msg=eliminado");
    exit();
}

if (isset($_GET['msg']) && $_GET['msg'] === 'eliminado') {
    $mensaje = "Artículo eliminado del inventario correctamente.";
}

// -------------------------------------------------------------
// OBTENER DATOS PARA EDICIÓN
// -------------------------------------------------------------
$articulo_editar = null;
if (isset($_GET['editar'])) {
    $id_editar = intval($_GET['editar']);
    $stmt = $pdo->prepare("SELECT * FROM articulos WHERE id = ?");
    $stmt->execute([$id_editar]);
    $articulo_editar = $stmt->fetch();
}

// -------------------------------------------------------------
// OPERACIÓN: LEER (READ)
// -------------------------------------------------------------
$stmt = $pdo->query("SELECT * FROM articulos ORDER BY id DESC");
$articulos = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FerreGest - Sistema de Inventario</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body class="bg-light">

<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.php">🛠️ FerreGest - Control de Inventario</a>
        <span class="navbar-text text-white-50">Sprint 1 Incremento Funcional</span>
    </div>
</nav>

<div class="container">

    <!-- MENSAJES DE ALERTA -->
    <?php if ($mensaje): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?= htmlspecialchars($mensaje) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if ($error): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= htmlspecialchars($error) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="row">
        <!-- FORMULARIO: CREAR / EDITAR -->
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        <?= $articulo_editar ? '✏️ Editar Artículo' : '➕ Nuevo Artículo' ?>
                    </h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="index.php">
                        <input type="hidden" name="id" value="<?= $articulo_editar['id'] ?? '' ?>">

                        <div class="mb-3">
                            <label class="form-label">Código de Barras</label>
                            <input type="text" name="codigo_barras" class="form-control" required 
                                   value="<?= htmlspecialchars($articulo_editar['codigo_barras'] ?? '') ?>">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Nombre del Artículo</label>
                            <input type="text" name="nombre" class="form-control" required 
                                   value="<?= htmlspecialchars($articulo_editar['nombre'] ?? '') ?>">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Precio ($)</label>
                            <input type="number" step="0.01" name="precio" class="form-control" required 
                                   value="<?= htmlspecialchars($articulo_editar['precio'] ?? '') ?>">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Stock / Existencias</label>
                            <input type="number" name="stock" class="form-control" required 
                                   value="<?= htmlspecialchars($articulo_editar['stock'] ?? '0') ?>">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Almacén / Localidad</label>
                            <select name="almacen" class="form-select" required>
                                <?php 
                                $almacenes = ['Tienda Principal', 'Sucursal', 'Almacén Central'];
                                foreach ($almacenes as $alm): 
                                    $selected = ($articulo_editar['almacen'] ?? '') === $alm ? 'selected' : '';
                                ?>
                                    <option value="<?= $alm ?>" <?= $selected ?>><?= $alm ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <button type="submit" name="guardar_articulo" class="btn btn-success w-100">
                            <i class="bi bi-save"></i> <?= $articulo_editar ? 'Actualizar' : 'Guardar' ?>
                        </button>

                        <?php if ($articulo_editar): ?>
                            <a href="index.php" class="btn btn-secondary w-100 mt-2">Cancelar Edición</a>
                        <?php endif; ?>
                    </form>
                </div>
            </div>
        </div>

        <!-- TABLA: CONSULTAR (READ) -->
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white">
                    <h5 class="card-title mb-0">📦 Catalogo de Existencias</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Almacén</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (count($articulos) > 0): ?>
                                    <?php foreach ($articulos as $art): ?>
                                        <tr>
                                            <td><code><?= htmlspecialchars($art['codigo_barras']) ?></code></td>
                                            <td><strong><?= htmlspecialchars($art['nombre']) ?></strong></td>
                                            <td>RD$ <?= number_format($art['precio'], 2) ?></td>
                                            <td>
                                                <span class="badge <?= $art['stock'] <= 50 ? 'bg-danger' : 'bg-success' ?>">
                                                    <?= htmlspecialchars($art['stock']) ?> uds
                                                </span>
                                            </td>
                                            <td><?= htmlspecialchars($art['almacen']) ?></td>
                                            <td>
                                                <a href="index.php?editar=<?= $art['id'] ?>" class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-pencil"></i>
                                                </a>
                                                <a href="index.php?eliminar=<?= $art['id'] ?>" 
                                                   class="btn btn-sm btn-outline-danger"
                                                   onclick="return confirm('¿Seguro que deseas eliminar este producto?')">
                                                    <i class="bi bi-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6" class="text-center text-muted">No hay artículos registrados.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>