/*
|-----------------------------------------
| setting up LogoEditor for the App
|-----------------------------------------
*/

'use client';

import { Check, ChevronRight, Crop as CropIcon, Layout, Loader2, Maximize2, StarIcon, Trash2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import type { BrandConfiguration, BrandFontFamily, BrandFontSize } from './PrimaryMenuEditor';

interface LogoEditorProps {
  config: BrandConfiguration;
  setConfig: Dispatch<SetStateAction<BrandConfiguration>>;
}

type LogoOffsetKey = 'logoDesktopOffsetX' | 'logoDesktopOffsetY' | 'logoMobileOffsetX' | 'logoMobileOffsetY';

const fontOptions = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
];

const sizeOptions = [
  { label: 'Small', value: 'text-lg' },
  { label: 'Medium', value: 'text-xl' },
  { label: 'Large', value: 'text-2xl' },
  { label: 'Extra Large', value: 'text-3xl' },
];

const offsetGroups: Array<{
  title: string;
  description: string;
  xKey: LogoOffsetKey;
  yKey: LogoOffsetKey;
}> = [
  {
    title: 'Desktop Position',
    description: 'Controls logo margin on tablet and desktop menu.',
    xKey: 'logoDesktopOffsetX',
    yKey: 'logoDesktopOffsetY',
  },
  {
    title: 'Mobile Position',
    description: 'Controls logo margin on mobile menu.',
    xKey: 'logoMobileOffsetX',
    yKey: 'logoMobileOffsetY',
  },
];

const clampOffset = (value: number) => Math.max(-120, Math.min(120, Number.isFinite(value) ? value : 0));

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
  });
}

const MediaLibrary = ({ onImageSelect, selectedImage }: { onImageSelect: (newImage: string) => void; selectedImage: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false);
  const [tempSrc, setTempSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media/v1');
      if (response.ok) {
        const data = await response.json();
        setImages(data?.data?.map((i: { url: string }) => i.url) || []);
      }
    } catch {
      toast.error('Library sync error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempSrc(reader.result?.toString() || '');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setPixelCrop(null);
        setIsCropping(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startCropFromLibrary = (url: string) => {
    setTempSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setPixelCrop(null);
    setIsCropping(true);
  };

  const uploadImageBlob = async (blob: Blob, fileName: string) => {
    const fileToCompress = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

    const compressed = await imageCompression(fileToCompress, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/jpeg',
    });

    const formData = new FormData();
    formData.append('image', compressed);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error('Upload failed');

    const newUrl = data.data.url;
    await fetch('/api/media/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delete_url: data.data.delete_url,
        url: newUrl,
        display_url: data.data.display_url,
      }),
    });

    onImageSelect(newUrl);
    setIsCropping(false);
    fetchImages();
  };

  const handleSaveUploadImages = async () => {
    if (!tempSrc || !pixelCrop) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(tempSrc, pixelCrop, rotation);
      if (!blob) throw new Error('Blob generation failed');
      await uploadImageBlob(blob, 'brand-logo.jpg');
    } catch (e) {
      console.error('Processing error:', e);
      toast.error('Processing failed. Please try a different image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveFullImage = async () => {
    if (!tempSrc) return;
    setProcessing(true);
    try {
      if (/^https?:\/\//.test(tempSrc)) {
        onImageSelect(tempSrc);
        setIsCropping(false);
        return;
      }

      const response = await fetch(tempSrc);
      const blob = await response.blob();
      await uploadImageBlob(blob, 'brand-logo-full.jpg');
    } catch (e) {
      console.error('Full image processing error:', e);
      toast.error('Full image save failed. Please try a different image.');
    } finally {
      setProcessing(false);
    }
  };

  if (isCropping && tempSrc) {
    return (
      <div className="flex flex-col h-[80vh] bg-white/10 rounded-sm overflow-hidden border border-white/30 shadow-2xl backdrop-blur-3xl">
        <div className="p-4 border-b border-white/15 flex items-center justify-between bg-white/10">
          <div className="flex items-center gap-2">
            <CropIcon className="w-4 h-4 text-white/80" />
            <span className="text-sm font-bold uppercase tracking-widest text-white/80">Crop Studio</span>
          </div>
        </div>
        <div className="relative flex-1 bg-black/35">
          <Cropper
            image={tempSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, p) => setPixelCrop(p)}
          />
        </div>
        <div className="p-6 bg-white/10 border-t border-white/15 space-y-6 backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-white/50">Zoom</span>
              <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={v => setZoom(v[0])} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-white/50">Rotate</span>
              <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={v => setRotation(v[0])} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Square', r: 1 },
              { label: '16:9', r: 16 / 9 },
              { label: 'Free', r: undefined },
            ].map(opt => (
              <Button
                key={opt.label}
                variant="ghost"
                size="sm"
                onClick={() => setAspect(opt.r)}
                className={`text-[10px] uppercase font-bold tracking-widest h-8 ${aspect === opt.r ? 'bg-white/25 text-white border border-white/30' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
            <Button variant="ghost" className="text-white/50 hover:text-white" onClick={() => setIsCropping(false)}>
              Cancel
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSaveFullImage} disabled={processing} variant="outlineGlassy" className="min-w-[120px]">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                Full image
              </Button>
              <Button
                onClick={handleSaveUploadImages}
                disabled={processing}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 min-w-[120px]"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Apply & Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white/10 text-white rounded-sm border border-white/30 shadow-2xl backdrop-blur-3xl">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold italic tracking-tighter">Media Assets</h3>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Select an existing image or upload new</p>
        </div>
        <Button asChild variant="outlineGlassy" className="h-10">
          <label className="cursor-pointer">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload New <Input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </Button>
      </div>
      <ScrollArea className="h-[50vh]">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/70" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {images.map(url => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={url}
                onClick={() => startCropFromLibrary(url)}
                className={`group relative aspect-square rounded-sm cursor-pointer overflow-hidden border-2 transition-all ${selectedImage === url ? 'border-white shadow-lg ring-2 ring-white/20' : 'border-white/10 hover:border-white/40'}`}
              >
                <Image src={url} alt="asset" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/80">Crop & Select</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-sm text-white/30">
            <Layout className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No assets found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function LogoEditor({ config, setConfig }: LogoEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateOffset = (key: LogoOffsetKey, value: number) => {
    setConfig(prev => ({ ...prev, [key]: clampOffset(value) }));
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-4 rounded-sm shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
                <Layout className="w-3.5 h-3.5" /> Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-3 py-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                    {config.logoIsPublished ? 'Visible' : 'Hidden'}
                  </span>
                  <Switch
                    checked={config.logoIsPublished}
                    onCheckedChange={value => setConfig(p => ({ ...p, logoIsPublished: value }))}
                    className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
                  />
                </div>
                {config.logoUrl && (
                  <Button variant="outlineFire" size="sm" onClick={() => setConfig(p => ({ ...p, logoUrl: null }))}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className="group relative h-80 rounded-sm bg-white/5 border-2 border-dashed border-white/40 hover:border-white/80 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4">
                  {config.logoUrl ? (
                    <>
                      <Image src={config.logoUrl} alt="logo" fill className="object-contain p-12 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-black px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                          <UploadCloud className="w-3 h-3" /> Change logo
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center group">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-white transition-all">
                        <UploadCloud className="w-10 h-10 text-white/20 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                        Select Brand Logo
                      </p>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none overflow-visible">
                <DialogHeader className="sr-only">
                  <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>
                <MediaLibrary
                  selectedImage={config.logoUrl || ''}
                  onImageSelect={u => {
                    setConfig(p => ({ ...p, logoUrl: u }));
                    setIsDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4 rounded-sm border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Logo Position</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Use negative values for left/up and positive values for right/down.</p>
              </div>
              <Button
                variant="outlineGlassy"
                size="sm"
                onClick={() =>
                  setConfig(p => ({
                    ...p,
                    logoDesktopOffsetX: 0,
                    logoDesktopOffsetY: 0,
                    logoMobileOffsetX: 0,
                    logoMobileOffsetY: 0,
                  }))
                }
              >
                Reset
              </Button>
            </div>

            <div className="grid gap-4">
              {offsetGroups.map(group => (
                <div key={group.title} className="space-y-4 rounded-sm border border-white/10 bg-black/10 p-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{group.title}</h4>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">{group.description}</p>
                  </div>

                  {[
                    { label: 'Left / Right', key: group.xKey, helper: 'Negative = left, positive = right' },
                    { label: 'Up / Down', key: group.yKey, helper: 'Negative = up, positive = down' },
                  ].map(item => {
                    const value = Number(config[item.key] || 0);

                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{item.label}</label>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">{item.helper}</p>
                          </div>
                          <div className="flex h-9 w-24 overflow-hidden rounded-sm border border-white/20 bg-white/5">
                            <Input
                              type="number"
                              min={-120}
                              max={120}
                              value={value}
                              onChange={e => updateOffset(item.key, Number(e.target.value))}
                              className="h-full rounded-none border-0 bg-transparent px-2 text-right text-xs font-black text-white"
                            />
                            <span className="flex items-center pr-2 text-[10px] font-bold text-white/40">px</span>
                          </div>
                        </div>
                        <Slider value={[value]} min={-120} max={120} step={1} onValueChange={v => updateOffset(item.key, v[0])} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">Brand Name</label>
            <Input
              value={config.brandName}
              onChange={e => setConfig(p => ({ ...p, brandName: e.target.value }))}
              className="h-14 bg-white/5 border-white/20 rounded-sm text-lg font-bold placeholder:text-white/5 focus:ring-white/20 focus:border-white/40"
              placeholder="Untitled Branding"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Text Color</label>
              <div className="relative group">
                <div className="h-14 bg-white/5 rounded-sm border border-white/20 flex items-center px-4 gap-4 cursor-pointer hover:bg-white/10 transition-all">
                  <div
                    className="w-6 h-6 rounded-full shadow-inner border border-white/30 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: config.textColor }}
                  />
                  <span className="text-xs font-mono font-black text-white/60 uppercase">{config.textColor}</span>
                </div>
                <input
                  type="color"
                  value={config.textColor}
                  onChange={e => setConfig(p => ({ ...p, textColor: e.target.value }))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Font Size</label>
              <div className="relative">
                <select
                  value={config.fontSize}
                  onChange={e => setConfig(p => ({ ...p, fontSize: e.target.value as BrandFontSize }))}
                  className="w-full h-14 bg-white/5 rounded-sm border border-white/20 px-4 appearance-none text-xs font-black text-white/70 focus:outline-none"
                >
                  {sizeOptions.map(o => (
                    <option key={o.value} value={o.value} className="bg-slate-900">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/70 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-2">
              <StarIcon className="w-3.5 h-3.5" /> Branding Typography
            </label>
            <div className="grid grid-cols-3 gap-3">
              {fontOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setConfig(p => ({ ...p, fontFamily: opt.value as BrandFontFamily }))}
                  className={`h-24 rounded-sm border transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${config.fontFamily === opt.value ? 'bg-white/20 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-white/20 hover:bg-white/10 hover:text-white/40'}`}
                >
                  <span className={`text-2xl font-black italic ${opt.value}`}>Aa</span>
                  <span className="text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                  {config.fontFamily === opt.value && <motion.div layoutId="brand-font-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
