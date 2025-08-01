import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

if (typeof window !== "undefined") {
  // Only set the worker on the client
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export { getDocument };
