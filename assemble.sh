(cd links; npm run build)
mkdir -p src/links/build
cp links/public/index.html src/links
cp links/public/pencil.svg src/links
cp links/public/trash.svg src/links
cp links/public/build/bundle.css src/links/build
cp links/public/build/bundle.js src/links/build
cp links/public/build/bundle.js.map src/links/build

(cd nomatch; npm run build)
mkdir -p src/nomatch/build
cp nomatch/public/index.html src/nomatch
cp nomatch/public/build/bundle.css src/nomatch/build
cp nomatch/public/build/bundle.js src/nomatch/build
cp nomatch/public/build/bundle.js.map src/nomatch/build

(cd error; npm run build)
mkdir -p src/error/build
cp error/public/index.html src/error
cp error/public/build/bundle.css src/error/build
cp error/public/build/bundle.js src/error/build
cp error/public/build/bundle.js.map src/error/build

(cd export; npm run build)
mkdir -p src/export/build
cp export/public/index.html src/export
cp export/public/build/bundle.css src/export/build
cp export/public/build/bundle.js src/export/build
cp export/public/build/bundle.js.map src/export/build

(cd import; npm run build)
mkdir -p src/import/build
cp import/public/index.html src/import
cp import/public/build/bundle.css src/import/build
cp import/public/build/bundle.js src/import/build
cp import/public/build/bundle.js.map src/import/build

(cd popup; npm run build)
mkdir -p src/popup/build
cp popup/public/index.html src/popup
cp popup/public/build/bundle.css src/popup/build
cp popup/public/build/bundle.js src/popup/build
cp popup/public/build/bundle.js.map src/popup/build