mkdir -p src/links/build
cp links/public/index.html src/links
cp links/public/trash.svg src/links
cp links/public/build/bundle.css src/links/build
cp links/public/build/bundle.js src/links/build
cp links/public/build/bundle.js.map src/links/build

mkdir -p src/nomatch/build
cp nomatch/public/index.html src/nomatch
cp nomatch/public/build/bundle.css src/nomatch/build
cp nomatch/public/build/bundle.js src/nomatch/build
cp nomatch/public/build/bundle.js.map src/nomatch/build
