export const fileToBase64 = (file) => new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => resolve(null);
});
