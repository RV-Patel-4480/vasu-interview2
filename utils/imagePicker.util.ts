import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type PickImageOptions = {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  mediaTypes?: ImagePicker.MediaType;
};

export type PickImageResult = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string | null;
  fileSize?: number;
  type?: string | null;
};

class ImagePickerError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const pickImageFromGallery = async (
  options?: PickImageOptions,
): Promise<PickImageResult | null> => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new ImagePickerError(
        "PERMISSION_DENIED",
        "Media library permission not granted",
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options?.mediaTypes ?? "images",
      allowsEditing: options?.allowsEditing ?? true,
      aspect: options?.aspect ?? [1, 1],
      quality: options?.quality ?? 0.7,
      base64: false,
      exif: false,
    });

    if (result.canceled) {
      return null;
    }

    if (!result.assets || result.assets.length === 0) {
      throw new ImagePickerError("NO_ASSET", "No image selected");
    }

    const asset = result.assets[0];

    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      type: asset.type,
    };
  } catch (error: any) {
    handleImagePickerError(error);
    return null;
  }
};

const handleImagePickerError = (error: any) => {
  console.error("ImagePickerError:", error);

  if (error instanceof ImagePickerError) {
    switch (error.code) {
      case "PERMISSION_DENIED":
        Alert.alert(
          "Permission Required",
          "Please allow photo access from settings to continue.",
        );
        break;

      case "NO_ASSET":
        // silent fail (user UX choice)
        break;

      default:
        Alert.alert("Error", error.message || "Image picker failed.");
    }
    return;
  }

  Alert.alert("Error", "Something went wrong while selecting image.");
};
