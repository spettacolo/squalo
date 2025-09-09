Download and install font WOFF2 files for local serving

This project expects the following files to be present under `public/fonts/`:

- VarelaRound-Regular.woff2
- CascadiaCode-Regular.woff2
- CascadiaCode-Semibold.woff2

How to download (PowerShell, Windows)

# create the folder (run from project root)
md .\public\fonts -Force

# download Varela Round (from Google Fonts static URL)
Invoke-WebRequest -Uri "https://fonts.gstatic.com/s/varelaround/v16/w8gdH283Tvk__Lua32Tysj.woff2" -OutFile ".\public\fonts\VarelaRound-Regular.woff2"

# download Cascadia Code (GitHub release raw URLs or ms/official sources)
# regular
Invoke-WebRequest -Uri "https://github.com/microsoft/cascadia-code/releases/download/v2111.01/CascadiaCode-2111.01.zip" -OutFile ".\public\fonts\CascadiaCode.zip"
# extract the zip and rename the woff2 files accordingly (manual step)

Notes:
- The Varela Round URL above is a stable Google Fonts static file path, but may change over time; if it 404s, visit https://fonts.google.com/specimen/Varela+Round and grab the WOFF2 from the CSS link.
- Cascadia Code releases contain multiple variable and static font files; download the ZIP from the GitHub releases page and extract the desired .woff2 files into `public/fonts/` and rename them to the filenames listed above.

After placing the files, restart the dev server (`npm run dev`) and the site will prefer the local fonts (font-display: swap is used).
