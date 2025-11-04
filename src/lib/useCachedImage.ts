import { useEffect, useState } from 'react';
import { downloadAndCacheImage } from './exerciseCache';

export default function useCachedImage(id: string | number, url?: string | null) {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!url) return;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const local = await downloadAndCacheImage(id, url);
        if (mounted && local) setLocalUri(local as string);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchImage();

    return () => { mounted = false; };
  }, [id, url]);

  return { localUri, loading };
}
