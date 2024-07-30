// Función para generar la URL del QR
function generateQrUrl() {
    // Obtener los valores de los campos del formulario
    const fullName = document.getElementById('name').value.trim();
    const organization = document.getElementById('organization').value.trim();
    const title = document.getElementById('title').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Obtener los valores de los campos de dirección
    const addressStreet = document.getElementById('addressStreet').value.trim();
    const addressLocality = document.getElementById('addressLocality').value.trim();
    const addressRegion = document.getElementById('addressRegion').value.trim();
    const addressPostalCode = document.getElementById('addressPostalCode').value.trim();
    const addressCountry = document.getElementById('addressCountry').value.trim();
    
    // Separar nombre y apellido
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    // Crear contenido de la vCard con los datos del formulario
    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;
FN:${escapeVCard(fullName)}
ORG:${escapeVCard(organization)}
TITLE:${escapeVCard(title)}
TEL:${escapeVCard(phone)}
EMAIL:${escapeVCard(email)}
ADR;TYPE=HOME:;;${escapeVCard(addressStreet)};${escapeVCard(addressLocality)};${escapeVCard(addressRegion)};${escapeVCard(addressPostalCode)};${escapeVCard(addressCountry)}
END:VCARD
    `.trim();

    // Codificar el contenido de la vCard para la URL
    const encodedVCardData = encodeURIComponent(vCardData);

    // Ajustar el tamaño y resolución del QR
    const qrSize = '500x500'; // Puedes cambiar el tamaño aquí

    // Crear URL para el QR
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}&data=${encodedVCardData}`;
}

// Función para escapar los caracteres especiales de la vCard
function escapeVCard(data) {
    return data.replace(/[\n\r]/g, '\\n').replace(/;/g, '\\;').replace(/:/g, '\\:');
}

// Actualizar la vista previa del QR
function updateQrPreview() {
    const qrImage = document.getElementById('qrImage');
    qrImage.src = generateQrUrl();
    
    // Mostrar el marco y el botón de descarga solo si hay datos en el QR
    const qrcodeFrame = document.getElementById('qrcodeFrame');
    const downloadButton = document.getElementById('downloadQrButton');

    if (document.getElementById('name').value.trim() || 
        document.getElementById('organization').value.trim() ||
        document.getElementById('title').value.trim() ||
        document.getElementById('phone').value.trim() ||
        document.getElementById('email').value.trim() ||
        document.getElementById('addressStreet').value.trim() ||
        document.getElementById('addressLocality').value.trim() ||
        document.getElementById('addressRegion').value.trim() ||
        document.getElementById('addressPostalCode').value.trim() ||
        document.getElementById('addressCountry').value.trim()) {
        qrcodeFrame.classList.remove('hidden');
        downloadButton.classList.remove('hidden');
    } else {
        qrcodeFrame.classList.add('hidden');
        downloadButton.classList.add('hidden');
    }
}

// Agregar event listeners para actualizar el QR mientras se completan los campos
const inputs = document.querySelectorAll('#vcardForm input');
inputs.forEach(input => {
    input.addEventListener('input', updateQrPreview);
});

// Configurar el botón de descarga
document.getElementById('downloadQrButton').addEventListener('click', function() {
    fetch(generateQrUrl())
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png'; // Nombre del archivo descargado
            link.click();
            URL.revokeObjectURL(url); // Limpiar el objeto URL después de la descarga
        })
        .catch(error => console.error('Error al descargar la imagen:', error));
});

// Inicializar vista previa si hay datos predefinidos
updateQrPreview();
