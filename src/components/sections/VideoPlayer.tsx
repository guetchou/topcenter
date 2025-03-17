
import { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.src = "https://static.videezy.com/system/resources/previews/000/021/810/original/CALLCENTER-CC0.mp4";
            videoRef.current.load(); // Charge la vidéo
            observer.disconnect(); // Arrête d'observer une fois la vidéo chargée
          }
        });
      },
      { threshold: 0.1 } // Déclenche lorsque 10% de la vidéo est visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      autoPlay 
      loop 
      muted 
      playsInline
      className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      onLoadedData={() => setVideoLoaded(true)}
    >
      <source type="video/mp4" />
      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
  );
};

export default VideoPlayer;
