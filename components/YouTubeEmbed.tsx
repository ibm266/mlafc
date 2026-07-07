type Props = {
  videoId: string;
  title: string;
  className?: string;
};

export function YouTubeEmbed({ videoId, title, className = '' }: Props) {
  return (
    <div className={`mx-auto w-full max-w-3xl ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line-dark bg-night p-3 shadow-[0_24px_56px_rgba(6,15,21,0.28)] md:p-4">
        <div className="overflow-hidden rounded-xl border border-brass/35 bg-black shadow-[inset_0_0_0_1px_rgba(176,141,62,0.15)]">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
