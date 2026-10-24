const socket = io();

function createCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function createServiceRow(service) {
  const tr = document.createElement('tr');
  tr.dataset.serviceId = service.id;

  tr.appendChild(createCell(service.name));
  tr.appendChild(createCell(service.description));
  tr.appendChild(createCell(`${service.duration} min`));
  tr.appendChild(createCell(`$${service.price}`));
  tr.appendChild(createCell(service.category));

  const availableCell = createCell(service.available ? 'Sí' : 'No');
  availableCell.className = `service-available ${service.available ? 'yes' : 'no'}`;
  tr.appendChild(availableCell);

  const actionCell = document.createElement('td');
  const button = document.createElement('button');
  button.className = 'toggle-btn';
  button.dataset.sid = service.id;
  button.textContent = 'Cambiar disponibilidad';
  actionCell.appendChild(button);
  tr.appendChild(actionCell);

  return tr;
}

function createBookingRow(booking) {
  const tr = document.createElement('tr');
  tr.dataset.bookingId = booking.id;

  tr.appendChild(createCell(booking.clientName));
  tr.appendChild(createCell(booking.clientEmail));
  tr.appendChild(createCell(booking.date));
  tr.appendChild(createCell(booking.time));
  tr.appendChild(createCell(booking.status));
  tr.appendChild(createCell(String((booking.services || []).length)));

  return tr;
}

function clearEmptyState(tableBody, emptyId) {
  const emptyRow = document.getElementById(emptyId);
  if (emptyRow) {
    emptyRow.remove();
  }
  return tableBody;
}

// --- Eventos que llegan DESDE el servidor ---
socket.on('service:created', service => {
  const tbody = document.getElementById('servicesTable');
  if (!tbody) return;
  clearEmptyState(tbody, 'servicesEmpty');
  tbody.appendChild(createServiceRow(service));
});

socket.on('service:updated', service => {
  const tbody = document.getElementById('servicesTable');
  if (!tbody) return;
  const row = tbody.querySelector(`tr[data-service-id="${service.id}"]`);
  if (row) {
    row.replaceWith(createServiceRow(service));
  }
});

socket.on('service:deleted', ({ id }) => {
  const tbody = document.getElementById('servicesTable');
  if (!tbody) return;
  const row = tbody.querySelector(`tr[data-service-id="${id}"]`);
  if (row) {
    row.remove();
  }
});

socket.on('booking:created', booking => {
  const tbody = document.getElementById('bookingsTable');
  if (!tbody) return;
  clearEmptyState(tbody, 'bookingsEmpty');
  tbody.appendChild(createBookingRow(booking));
});

socket.on('booking:updated', booking => {
  const tbody = document.getElementById('bookingsTable');
  if (!tbody) return;
  const row = tbody.querySelector(`tr[data-booking-id="${booking.id}"]`);
  if (row) {
    row.replaceWith(createBookingRow(booking));
  }
});

socket.on('booking:deleted', ({ id }) => {
  const tbody = document.getElementById('bookingsTable');
  if (!tbody) return;
  const row = tbody.querySelector(`tr[data-booking-id="${id}"]`);
  if (row) {
    row.remove();
  }
});

// --- Eventos que salen HACIA el servidor ---
document.addEventListener('click', event => {
  const button = event.target.closest('.toggle-btn');
  if (!button) return;
  socket.emit('service:toggle-availability', button.dataset.sid);
});

// --- Formularios: reutilizan la API REST (mismas capas) ---
const serviceForm = document.getElementById('serviceForm');
if (serviceForm) {
  serviceForm.addEventListener('submit', async event => {
    event.preventDefault();
    const body = {
      name: serviceForm.name.value,
      description: serviceForm.description.value,
      duration: Number(serviceForm.duration.value),
      price: Number(serviceForm.price.value),
      category: serviceForm.category.value,
      available: serviceForm.available.checked
    };

    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    serviceForm.reset();
  });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async event => {
    event.preventDefault();
    const body = {
      clientName: bookingForm.clientName.value,
      clientEmail: bookingForm.clientEmail.value,
      date: bookingForm.date.value,
      time: bookingForm.time.value
    };

    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    bookingForm.reset();
  });
}
