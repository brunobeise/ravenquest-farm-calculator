const imageModules = import.meta.glob("../assets/**/**/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function getImage(folder: string, imageName: string): string {
  const entry = Object.entries(imageModules).find(([path]) =>
    path.endsWith(`/${folder}/${imageName}`)
  );
  return entry?.[1] ?? "";
}
