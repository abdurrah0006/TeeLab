const MAX = 1024

/** Reads an image file, downsizes it for the GPU, returns { src, aspect, name }. */
export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Please choose an image file (PNG, JPG, WEBP, SVG).'))
    const fr = new FileReader()
    fr.onerror = () => reject(new Error('Could not read that file.'))
    fr.onload = () => {
      const img = new window.Image()
      img.onerror = () => reject(new Error('That image could not be decoded.'))
      img.onload = () => {
        const w0 = img.naturalWidth || 512
        const h0 = img.naturalHeight || 512
        const k = Math.min(1, MAX / Math.max(w0, h0))
        const c = document.createElement('canvas')
        c.width = Math.max(1, Math.round(w0 * k))
        c.height = Math.max(1, Math.round(h0 * k))
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        resolve({ src: c.toDataURL('image/webp', 0.92), aspect: c.width / c.height, name: file.name.replace(/\.[^.]+$/, '') })
      }
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  })
}
