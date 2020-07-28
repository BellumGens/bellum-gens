cd dist/bellumgens/server
for filename in *; do
  mv "${filename}" "../${filename}"
done

cd ../../ebleague/server
for filename in *; do
  mv "${filename}" "../${filename}"
done
