document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    banner.classList.add("fade-in");
});

document.getElementById("uploadForm").addEventListener("submit", function(e) {
    e.preventDefault();  // Previne o envio do formulário
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            // Aqui você pode processar o conteúdo do arquivo (CSV ou JSON)
            if (file.name.endsWith('.csv')) {
                parseCSV(fileContent);
            } else if (file.name.endsWith('.json')) {
                parseJSON(fileContent);
            }
        };
        reader.readAsText(file);
    }
});

// Função para parse de CSV
function parseCSV(csv) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');  // Considerando que a primeira linha são os cabeçalhos
    const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });
        return entry;
    });

    // Exemplo de transformação: somar valores de uma coluna
    const total = data.reduce((sum, entry) => sum + parseFloat(entry['valor']), 0); // 'valor' é o nome da coluna
    console.log("Soma dos valores:", total);
}

function criarGrafico(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.nome),  // 'nome' é a coluna de rótulos
            datasets: [{
                label: 'Valores',
                data: data.map(item => item.valor),  // 'valor' é a coluna de valores
                backgroundColor: 'rgba(0, 209, 178, 0.2)',  // Cor verde-azulado
                borderColor: 'rgba(0, 209, 178, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chame essa função após extrair e transformar os dados
document.getElementById("filterInput").addEventListener("input", function() {
    const filterValue = this.value.toLowerCase();
    const filteredData = data.filter(item => item.nome.toLowerCase().includes(filterValue));
    criarGrafico(filteredData);  // Atualiza o gráfico com os dados filtrados
});

document.getElementById("generateChart").addEventListener("click", function() {
    const dataSelect = document.getElementById("dataSelect").value;
    const chartType = document.getElementById("chartType").value;

    let data;

    // Escolha do conjunto de dados
    if (dataSelect === "set1") {
        data = [
            { label: 'Jan', value: 30 },
            { label: 'Feb', value: 50 },
            { label: 'Mar', value: 70 },
        ];
    } else if (dataSelect === "set2") {
        data = [
            { label: 'A', value: 100 },
            { label: 'B', value: 150 },
            { label: 'C', value: 200 },
        ];
    } else {
        data = [
            { label: 'X', value: 80 },
            { label: 'Y', value: 120 },
            { label: 'Z', value: 160 },
        ];
    }

    // Gerar o gráfico com base no tipo escolhido
    createChart(data, chartType);
});

// Função para gerar gráficos
function createChart(data, chartType) {
    const chartContainer = document.getElementById('chartContainer');

    // Crie um novo canvas para o gráfico
    const newCanvas = document.createElement('canvas');
    chartContainer.appendChild(newCanvas);

    const ctx = newCanvas.getContext('2d');
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            data: data.map(item => item.value),
            backgroundColor: 'rgba(0, 209, 178, 0.2)',
            borderColor: 'rgba(0, 209, 178, 1)',
            borderWidth: 1
        }]
    };

    // Apagar gráfico anterior, se existir
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: chartType, // Tipo de gráfico (bar, line, pie)
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Eventos para pré-visualização de gráficos
document.addEventListener('DOMContentLoaded', function() {
    const chartTypeSelect = document.getElementById('chartType');
    const chartModels = document.getElementById('chartModels');
    const barChartModel = document.getElementById('barChartModel');
    const lineChartModel = document.getElementById('lineChartModel');
    const pieChartModel = document.getElementById('pieChartModel');
    
    // Canvas dos gráficos de preview
    const barPreviewCanvas = document.getElementById('barPreviewCanvas');
    const linePreviewCanvas = document.getElementById('linePreviewCanvas');
    const piePreviewCanvas = document.getElementById('piePreviewCanvas');

    // Função para desenhar o preview de cada tipo de gráfico
    function drawPreview(canvas, chartType) {
        const ctx = canvas.getContext('2d');
        const data = {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
                label: 'Exemplo de Dados',
                data: [12, 19, 3, 5],
                backgroundColor: chartType === 'pie' ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] : '#00D1B2', // Cor para gráfico de pizza ou barras
                borderColor: '#fff',
                borderWidth: 1
            }]
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar canvas

        new Chart(ctx, {
            type: chartType,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: chartType === 'bar' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {},
            }
        });
    }

    // Mostrar e desenhar o preview dos modelos de gráficos baseados na seleção do usuário
    chartTypeSelect.addEventListener('change', function() {
        // Exibir a caixa de modelos
        chartModels.style.display = 'block';

        // Mostrar/ocultar os modelos de gráficos
        barChartModel.style.display = chartTypeSelect.value === 'bar' ? 'block' : 'none';
        lineChartModel.style.display = chartTypeSelect.value === 'line' ? 'block' : 'none';
        pieChartModel.style.display = chartTypeSelect.value === 'pie' ? 'block' : 'none';

        // Desenhar o preview do gráfico selecionado
        if (chartTypeSelect.value === 'bar') {
            drawPreview(barPreviewCanvas, 'bar');
        } else if (chartTypeSelect.value === 'line') {
            drawPreview(linePreviewCanvas, 'line');
        } else if (chartTypeSelect.value === 'pie') {
            drawPreview(piePreviewCanvas, 'pie');
        }
    });

    // Inicialmente desenhar o gráfico de barras como preview
    drawPreview(barPreviewCanvas, 'bar');
});
// Inicializa o EmailJS com o seu User ID
emailjs.init("I7wFYy076SE_g9XhO");  // Substitua YOUR_USER_ID pela sua chave do EmailJS

// Adiciona o evento de envio do formulário de contato
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio tradicional do formulário

    const form = event.target;
    const formData = new FormData(form);

    // Envia o formulário usando EmailJS
    emailjs.sendForm('service_0swoaid', 'ytemplate_fh8xsj3', formData)
        .then(function(response) {
            // Exibe uma mensagem de sucesso
            document.getElementById('status-message').innerText = "Mensagem enviada com sucesso!";
            document.getElementById('status-message').style.color = 'green';
            form.reset();  // Limpa os campos após o envio
        }, function(error) {
            // Exibe uma mensagem de erro caso falhe
            document.getElementById('status-message').innerText = "Ocorreu um erro. Tente novamente.";
            document.getElementById('status-message').style.color = 'red';
        });
});
