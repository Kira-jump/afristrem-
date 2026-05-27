import { MuxUploader } from "@/components/admin/mux-uploader";

export default function AdminUploadsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold">
        <span className="text-gold-gradient">Upload</span> vidéo
      </h1>
      <p className="mt-1 text-sm text-white/60">
        Téléverse directement vers Mux. La barre de progression suit le transfert
        chunk par chunk. À la fin, copie l'URL HLS et colle-la dans le formulaire
        film/épisode.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-elevated p-6 sm:p-8">
        <MuxUploader />
      </div>

      <section className="mt-6 rounded-xl border border-white/10 bg-elevated p-5 text-sm text-white/60">
        <h3 className="mb-2 font-display text-white">Comment ça marche</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Tu choisis ou glisses-déposes un fichier vidéo (.mp4, .mov, .mkv…)</li>
          <li>Le navigateur le découpe en chunks et l'envoie directement à Mux</li>
          <li>Mux encode en HLS adaptatif (240p → 4K selon la source)</li>
          <li>Quand l'asset est `ready`, l'URL HLS apparaît — copie-la</li>
          <li>Colle-la dans le champ "URL vidéo" d'un film ou épisode</li>
        </ol>
        <p className="mt-3 text-xs text-white/40">
          💡 Requiert MUX_TOKEN_ID + MUX_TOKEN_SECRET sur Vercel.
        </p>
      </section>
    </div>
  );
}
