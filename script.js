async function fetchClientProfile() {
    const clientId = document.getElementById('clientId').value;
    const profileDiv = document.getElementById('profile');
    const errorDiv = document.getElementById('error');

    if (!clientId) {
        showError('Please enter a client ID');
        return;
    }

    try {
        const response = await fetch(`https://cema-health-app.onrender.com/api/client/${clientId}`);
        if (!response.ok) {
            throw new Error('Client not found');
        }
        const data = await response.json();
        
        // Update personal information
        document.getElementById('clientName').textContent = data.name;
        document.getElementById('clientGender').textContent = data.gender;
        document.getElementById('clientEmail').textContent = data.email;
        document.getElementById('clientPhone').textContent = data.phone;
        document.getElementById('clientRegistered').textContent = data.registered_at;

        // Update active enrollments
        const activeEnrollmentsDiv = document.getElementById('activeEnrollments');
        activeEnrollmentsDiv.innerHTML = data.active_enrollments.length > 0 
            ? data.active_enrollments.map(createEnrollmentCard).join('')
            : '<p>No active enrollments</p>';

        // Update dropped enrollments
        const droppedEnrollmentsDiv = document.getElementById('droppedEnrollments');
        droppedEnrollmentsDiv.innerHTML = data.dropped_enrollments.length > 0
            ? data.dropped_enrollments.map(createEnrollmentCard).join('')
            : '<p>No dropped enrollments</p>';

        // Update appointments
        const appointmentsDiv = document.getElementById('appointments');
        appointmentsDiv.innerHTML = data.appointments.length > 0
            ? data.appointments.map(createAppointmentCard).join('')
            : '<p>No appointments</p>';

        profileDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    } catch (error) {
        showError(error.message);
        profileDiv.classList.add('hidden');
    }
}

function createEnrollmentCard(enrollment) {
    return `
        <div class="enrollment-card">
            <h3>${enrollment.program}</h3>
            <p><strong>Status:</strong> ${enrollment.status}</p>
            <p><strong>Start Date:</strong> ${enrollment.start_date}</p>
            <p><strong>End Date:</strong> ${enrollment.end_date}</p>
        </div>
    `;
}

function createAppointmentCard(appointment) {
    return `
        <div class="appointment-card">
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
            <p><strong>Doctor:</strong> ${appointment.doctor}</p>
        </div>
    `;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Add event listener for Enter key
document.getElementById('clientId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchClientProfile();
    }
}); 