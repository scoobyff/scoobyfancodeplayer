import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Player() {
  const router = useRouter();
  const { id } = router.query;
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchChannelData();
  }, [id]);

  const fetchChannelData = async () => {
    try {
      const response = await fetch('/api/channel-data');
      const data = await response.text();

      const lines = data.split('\n');
      const channels = {};

      lines.forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        const parts = line.split('|');
        console.log('Parsing line:', line);
        console.log('Parts:', parts);
        
        if (parts.length >= 3) {
          const channelId = parts[0].trim();
          channels[channelId] = {
            id: channelId,
            name: parts[1] ? parts[1].trim() : 'Unknown',
            url: parts[2] ? parts[2].trim() : '',
            user_agent: parts[3] ? parts[3].trim() : '',
            referer: parts[4] ? parts[4].trim() : 'https://example.com/'
          };
          console.log('Added channel:', channelId, channels[channelId]);
        }
      });

      if (!channels[id]) {
        setError(`Channel with ID '${id}' not found`);
        return;
      }

      setChannel(channels[id]);
    } catch (err) {
      setError('Failed to fetch channel data');
    }
  };

  useEffect(() => {
    if (!channel) return;

    const initPlayer = async () => {
      // Wait for shaka to load
      if (typeof shaka === 'undefined') {
        setTimeout(initPlayer, 100);
        return;
      }

      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        console.error('Browser not supported');
        return;
      }

      const video = document.querySelector('video');
      const player = new shaka.Player();

      await player.attach(video);

      const container = document.querySelector('.shaka-video-container');
      const ui = new shaka.ui.Overlay(player, container, video);
      ui.getControls();

      // Player configuration (same as DRM version but no DRM)
      const config = {
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 5,
          bufferBehind: 30,
          retryParameters: {
            timeout: 15000,
            maxAttempts: 3,
            baseDelay: 500,
            backoffFactor: 1.5
          },
          segmentRequestTimeout: 10000,
          useNativeHlsOnSafari: true
        },
        manifest: {
          retryParameters: {
            timeout: 10000,
            maxAttempts: 2
          }
        }
      };

      // NO DRM configuration - removed completely

      player.configure(config);

      // Request filter for headers (same as DRM version)
      player.getNetworkingEngine().registerRequestFilter((type, request) => {
        request.headers['Referer'] = channel.referer;

        if (channel.user_agent) {
          request.headers['User-Agent'] = channel.user_agent;
        }
      });

      // Error handling (same as DRM version)
      player.addEventListener('error', (event) => {
        console.error('Shaka Player Error:', event.detail);
      });

      // Auto fullscreen on play (same as DRM version)
      video.addEventListener('play', () => {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(() => {});
        }
      }, { once: true });

      // Load stream
      try {
        await player.load(channel.url);
      } catch (error) {
        console.error('Load error:', error);
      }
    };

    initPlayer();
  }, [channel]);

  if (error) {
    return <div style={{ color: 'white', padding: '20px' }}>{error}</div>;
  }

  if (!channel) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{channel.name}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.6.0/shaka-player.ui.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.6.0/controls.min.css" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          background: #000;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .shaka-video-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        video {
          width: 100%;
          height: 100%;
          background: #000;
          object-fit: contain;
        }
        .shaka-spinner-container {
          display: none !important;
        }
      `}</style>

      <div className="shaka-video-container" data-shaka-player>
        <video autoPlay playsInline preload="metadata"></video>
      </div>
    </>
  );
}
