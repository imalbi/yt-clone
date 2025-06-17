<script lang="ts">
let sampleImg="/media/hq720.avif";
let avatar= "/media/avatar.webp";
export let video;

export function formatTimeAgo(isoDateString:string) {
  if (!isoDateString) return '';

  const now = new Date();
  const past = new Date(isoDateString);
  
  // Differenza in secondi
  const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Meno di un minuto
  if (secondsAgo < 60) {
    return "pochi secondi fa";
  }

  // Meno di un'ora
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return minutes === 1 ? '1 minuto fa' : `${minutes} minuti fa`;
  }

  // Meno di 24 ore
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return hours === 1 ? '1 ora fa' : `${hours} ore fa`;
  }

  // Meno di un mese (circa 30 giorni)
  if (secondsAgo < 2592000) {
    const days = Math.floor(secondsAgo / 86400);
    return days === 1 ? '1 giorno fa' : `${days} giorni fa`;
  }

  // Meno di un anno (circa 365 giorni)
  if (secondsAgo < 31536000) {
    const months = Math.floor(secondsAgo / 2592000);
    return months === 1 ? '1 mese fa' : `${months} mesi fa`;
  }

  // Più di un anno
  const years = Math.floor(secondsAgo / 31536000);
  return years === 1 ? '1 anno fa' : `${years} anni fa`;
}

</script>

<a href="/video/{video.id}">
    <article class="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
        <div>
            <img class="rounded-2xl w-full" src={video.snippet.thumbnails.medium.url} alt="Thumbnail">
        </div>
        <div class="flex flex-row gap-2">
            <aside class=" flex-shrink-0"><img class="rounded-full size-12 mt-2 object-cover " src={video.channelAvatarUrl} alt="Avatar"></aside>
            <div class="flex flex-col">
                <h1 class="text-2xl font-semibold">{video.snippet.title}</h1>
                <p class=" text-gray-600">{video.snippet.channelTitle}</p>
                <p class="text-gray-600">{video.statistics.viewCount} visualizzazioni • {formatTimeAgo(video.snippet.publishedAt)}</p>
            </div>
        </div>
    </article>
</a>
