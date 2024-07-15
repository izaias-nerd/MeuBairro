function toggleStatus(event) {
    const button = event.target;
    const nome = button.getAttribute('data-nome');
    const sobrenome = button.getAttribute('data-sobrenome');
    let status = button.getAttribute('data-status');

    // Toggle status
    if (status === 'livre') {
        button.classList.remove('green');
        button.classList.add('red');
        button.setAttribute('data-status', 'ocupado');
        button.textContent = 'Sinalizar Livre';
        status = 'ocupado';
    } else {
        button.classList.remove('red');
        button.classList.add('green');
        button.setAttribute('data-status', 'livre');
        button.textContent = 'Sinalizar Ocupado';
        status = 'livre';
    }

    // Update the status in local storage
    localStorage.setItem(`${nome}_${sobrenome}_status`, status);

    // Update the status indicator in the local storage file
    fetch('/updateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, sobrenome, status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result !== 'success') {
            console.error('Erro ao atualizar o status.');
        }
    })
    .catch(error => console.error('Erro:', error));
}

// Function to initialize the button status from localStorage
function initializeButtonStatus() {
    document.querySelectorAll('.status-button').forEach(button => {
        const nome = button.getAttribute('data-nome');
        const sobrenome = button.getAttribute('data-sobrenome');
        const storedStatus = localStorage.getItem(`${nome}_${sobrenome}_status`);
        const currentStatus = button.getAttribute('data-status');

        if (storedStatus && storedStatus !== currentStatus) {
            const newStatus = storedStatus === 'livre' ? 'Sinalizar Ocupado' : 'Sinalizar Livre';
            const colorClass = storedStatus === 'livre' ? 'green' : 'red';

            button.classList.remove(currentStatus === 'livre' ? 'green' : 'red');
            button.classList.add(colorClass);
            button.setAttribute('data-status', storedStatus);
            button.textContent = newStatus;
        }
    });
}

// Initialize the button status on page load
document.addEventListener('DOMContentLoaded', initializeButtonStatus);
