type Props = {
  videoId: string;
  title: string;
};

export function YouTubeEmbed({ videoId, title }: Props) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-night shadow-[0_14px_34px_rgba(18,43,58,0.12)]">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
