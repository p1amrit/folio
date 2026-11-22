# Folio

Folio is a browser-local file previewer. Select or drag in one or more files to preview them. File contents stay on your device.

## Run locally

Open `index.html` in a modern browser. The app uses HTML, CSS, and vanilla JavaScript and has no build step.

## Preview support

- PDF, common images, and browser-supported video and audio
- Plain text, code, JSON, CSV, and TSV
- Extracted content from legacy Word 97–2003 DOC, DOCX, XLSX, and PPTX
- ZIP archive listings

You can filter open files by filename and switch previews with Alt + Up or Down. Office previews extract content without reproducing the original page or slide layout. Unsupported files can be downloaded from the workspace.

Legacy DOC previews show the main document text and support unencrypted files up to 16 MB. Folio uses the bundled CFB library (Apache-2.0) to read the Word container.
