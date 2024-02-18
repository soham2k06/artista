"use client";

import Image from "next/image";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import { CldImage, CldUploadWidget } from "next-cloudinary";

import { dataUrl, getImageSize } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

function MediaUploader({
  onValueChange,
  setImage,
  publicId,
  image,
  type,
}: MediaUploaderProps) {
  const { toast } = useToast();

  function onUploadSuccess(result: any) {
    setImage((prev: any) => ({
      ...prev,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  }

  function onUploadError() {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  }

  return (
    <CldUploadWidget
      uploadPreset="magecraft"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccess}
      onError={onUploadError}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>
          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="Original Image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload an image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}

export default MediaUploader;
