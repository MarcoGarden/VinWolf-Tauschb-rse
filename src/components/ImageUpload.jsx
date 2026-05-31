// useState: speichert Upload-Status, Fehlermeldung und Vorschau
import { useState } from 'react'

// supabase: brauchen wir fuer den Upload in Supabase Storage
import { supabase } from '../supabase'

export default function ImageUpload({ userId, imagePath, onUploadComplete }) {
  
  // uploading: true solange das Bild hochgeladen wird
  const [uploading, setUploading] = useState(false)

  // error: Fehlermeldung falls der Upload nicht klappt
  const [error, setError] = useState(null)

  // previewUrl: oeffentliche Bild-URL fuer die Vorschau
  const [previewUrl, setPreviewUrl] = useState(null)

  // Wird aufgerufen sobald der Nutzer ein Bild auswaehlt
  async function handleImageChange(e) {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    setUploading(true)
    setError(null)

    // Dateiname wird bereinigt, damit keine problematischen Zeichen im Storage-Pfad landen
    const safeFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')

    // Bilder werden pro Nutzer in einem eigenen Ordner gespeichert
    const filePath = `${userId}/${Date.now()}-${safeFileName}`

    // Upload in den Supabase Storage Bucket listing-images
    const { error } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file)

    if (error) {
      setError('Bild konnte nicht hochgeladen werden.')
      setUploading(false)
      return
    }

    // Oeffentliche URL fuer die Vorschau erzeugen
    const { data } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath)

    setPreviewUrl(data.publicUrl)

    // Gibt den Storage-Pfad an die Eltern-Komponente zurueck
    onUploadComplete(filePath)

    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bild
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-white hover:file:bg-green-800 disabled:opacity-50"
      />

      {uploading && (
        <p className="mt-2 text-sm text-gray-500">
          Bild wird hochgeladen...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {imagePath && !previewUrl && (
        <p className="mt-2 text-sm text-green-700">
          Bild wurde hochgeladen.
        </p>
      )}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Vorschau des Inseratbilds"
          className="mt-4 h-48 w-full rounded-lg object-cover"
        />
      )}
    </div>
  )
}