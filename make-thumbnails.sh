#!/bin/bash

pushd assets/img/gallery/

for i in *; do
  case "$i" in
    tn-*) continue ;;
  esac
  if [ -f "tn-$i" ]; then
    continue
  fi
  convert -resize 200x200 "$i" "tn-$i"
done

popd
