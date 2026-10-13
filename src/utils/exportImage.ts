import { toPng } from "html-to-image"

interface ExportOptions {
  filename: string
  backgroundColor?: string
  pixelRatio?: number
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export async function exportNodeAsPng(
  node: HTMLElement,
  { filename, backgroundColor = "#ffffff", pixelRatio = 2 }: ExportOptions
): Promise<void> {
  const dataUrl = await toPng(node, {
    backgroundColor,
    pixelRatio,
    cacheBust: true,
  })
  const link = document.createElement("a")
  link.download = `${sanitizeFilename(filename)}.png`
  link.href = dataUrl
  link.click()
}
