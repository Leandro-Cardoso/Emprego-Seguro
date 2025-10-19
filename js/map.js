function createMapIframe(location) {
    const urlBase = "https://www.google.com/maps";
    const query = `?q=${encodeURIComponent(location)}&output=embed`;
    const iframeSrc = `${urlBase}${query}`;

    return `<iframe 
        src="${iframeSrc}"
        width="500" 
        height="300" 
        style="border:0;" 
        frameborder="0" 
        allowfullscreen 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;
}
