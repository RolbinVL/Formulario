// Validación del formulario con Bootstrap 5
(function () {
    'use strict';
    window.addEventListener('load', function () {
        const forms = document.getElementsByClassName('needs-validation');
        Array.prototype.forEach.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// Agrega una nueva fila a la tabla de construcciones
function agregarFilaConstruccion() {
    const tbody = document.getElementById('construcciones-tbody');
    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td>
            <input list="usosConstruccion" class="form-control" placeholder="Ej: Residencial, comercial..." required>
        </td>
        <td>
            <input type="number" class="form-control" min="0" placeholder="Años" required>
        </td>
        <td>
            <select class="form-select" required>
                <option value="">Seleccione...</option>
                <option>Excelente</option>
                <option>Muy bueno</option>
                <option>Bueno</option>
                <option>Regular</option>
                <option>Malo</option>
            </select>
        </td>
        <td>
            <input type="number" class="form-control" min="1" placeholder="1" required>
        </td>
        <td>
            <input type="number" class="form-control" min="0" placeholder="0" required>
        </td>
        <td>
            <input type="number" class="form-control construccion-area" min="0" step="0.01" placeholder="m²" required>
        </td>
        <td>
            <input type="number" class="form-control construccion-valor" min="0" step="0.01" placeholder="₡/m²" required>
        </td>
        <td>
            <input type="number" class="form-control construccion-total" step="0.01" readonly placeholder="₡">
        </td>
    `;
    actualizarCalculos();
}

// Cálculos automáticos para terrenos y construcciones
function actualizarCalculos() {
    const area = parseFloat(document.getElementById('area')?.value) || 0;
    const valorUnitario = parseFloat(document.getElementById('valorUnitario')?.value) || 0;
    const valorTotal = area * valorUnitario;

    const campoValorTotal = document.getElementById('valorTotal');
    const campoValorTerreno = document.getElementById('valorTotalTerreno');
    if (campoValorTotal) campoValorTotal.value = valorTotal.toFixed(2);
    if (campoValorTerreno) campoValorTerreno.value = valorTotal.toFixed(2);

    // Calcular valor total construcciones
    let totalConstrucciones = 0;
    document.querySelectorAll('#construcciones-tbody tr').forEach(row => {
        const area = parseFloat(row.querySelector('.construccion-area')?.value) || 0;
        const valor = parseFloat(row.querySelector('.construccion-valor')?.value) || 0;
        const total = area * valor;

        const campoTotal = row.querySelector('.construccion-total');
        if (campoTotal) campoTotal.value = total.toFixed(2);

        totalConstrucciones += total;
    });

    const campoTotalConstrucciones = document.getElementById('valorTotalConstrucciones');
    const campoValorConstruccion = document.getElementById('valorTotalConstruccion');
    if (campoTotalConstrucciones) campoTotalConstrucciones.value = totalConstrucciones.toFixed(2);
    if (campoValorConstruccion) campoValorConstruccion.value = totalConstrucciones.toFixed(2);

    const campoValorFinal = document.getElementById('valorTotalFinal');
    if (campoValorFinal) campoValorFinal.value = (valorTotal + totalConstrucciones).toFixed(2);
}

// Listeners de campos clave para cálculos automáticos
['area', 'valorUnitario'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', actualizarCalculos);
});

// Escuchar cambios en inputs de construcciones (dinámicos y existentes)
document.addEventListener('input', function (e) {
    if (e.target.classList.contains('construccion-area') || e.target.classList.contains('construccion-valor')) {
        actualizarCalculos();
    }
});

// Marcar todos los servicios si se selecciona "Todos los anteriores"
const chkTodos = document.getElementById('todosServicios');
if (chkTodos) {
    chkTodos.addEventListener('change', function () {
        const servicios = ['acera', 'cordonCano', 'caneria', 'alcantarillado', 'telefono2', 'electricidad', 'alumbrado'];
        servicios.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = this.checked;
        });
    });
}

// Validación de formato de email
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('input', function () {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.setCustomValidity('Por favor ingrese un correo electrónico válido.');
        } else {
            this.setCustomValidity('');
        }
    });
});

// Formato en vivo de cédulas
['cedula', 'cedulaRepresentante'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/[^\d-]/g, '');
            if (this.value.length === 9 && !this.value.includes('-')) {
                this.value = this.value.replace(/(\d{1})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        });
    }
});

// Confirmación antes de enviar el formulario
const form = document.getElementById('formulariBienes');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (this.checkValidity()) {
            const confirmado = confirm('¿Está seguro de que desea enviar esta declaración? Verifique que toda la información sea correcta.');
            if (confirmado) {
                alert('La declaración ha sido enviada exitosamente al correo bsandi@desamparados.go.cr');
                // Aquí iría el submit real o AJAX
            }
        } else {
            this.classList.add('was-validated');
        }
    });
}
