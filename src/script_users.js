document.getElementById('fetch-drivers').addEventListener('click', function() {
    const url = 'https://docs.google.com/spreadsheets/d/1EXM_bEm9UoIm3QTVQ3MPrwrCwfW9vqK-ctFnUKHfBsc/gviz/tq?tqx=out:json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const jsonData = JSON.parse(data.substr(47).slice(0, -2));
            displayData(jsonData.table.rows);
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Erro: ' + error.message;
        });
});

function displayData(rows) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    rows.forEach(row => {
        const nome = row.c[0]?.v || 'N/A';
        const sobrenome = row.c[1]?.v || 'N/A';
        const modeloVeiculo = row.c[2]?.v || 'N/A';
        const anoVeiculo = row.c[3]?.v || 'N/A';
        const placa = row.c[4]?.v || 'N/A';
        const cor = row.c[5]?.v || 'N/A';
        const telefone = row.c[6]?.v || 'N/A';
        const bairro = row.c[8]?.v || 'N/A';
        const status = localStorage.getItem(`${nome}_${sobrenome}_status`) || (row.c[9]?.v || 'livre');

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h3>${nome} ${sobrenome}</h3>
            <p><strong>Modelo do Veículo:</strong> ${modeloVeiculo}</p>
            <p><strong>Ano do Veículo:</strong> ${anoVeiculo}</p>
            <p><strong>Placa:</strong> ${placa}</p>
            <p><strong>Cor:</strong> ${cor}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Bairro:</strong> ${bairro}</p>
            <p><span class="status-indicator ${status}"></span> ${status === 'livre' ? 'Motorista Livre' : 'Motorista Ocupado'}</p>
            <button onclick="requestRide('${nome} ${sobrenome}', '${telefone}')">Solicitar Corrida</button>
            `;

        resultDiv.appendChild(card);
    });
}

function requestRide(nome, telefone) {
    const mensagem = encodeURIComponent(`Olá, gostaria de solicitar uma corrida com ${nome}.`);
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}

// Atualiza a lista de motoristas ao carregar a página
document.getElementById('fetch-drivers').click();